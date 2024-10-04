// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import { LendingController } from "./LendingController.sol";
import { EscrowController } from "./EscrowController.sol";
import { OfferController } from "./OfferController.sol";

import { LienIsCurrent, TakerIsNotBorrower, MakerIsNotBorrower, InsufficientAskAmount, InvalidFee, CurrencyMismatch, CollectionMismatch, TokenMismatch, InvalidCriteria, InvalidToken, RequiresAskSide, RequiresBidSide, RequiresNakedBidSide, CannotTakeSoftOffer, CannotTakeHardOffer } from "./Errors.sol";

import { LoanOffer, MarketOffer, Lien, Permit, Side, Criteria } from "./Structs.sol";

import { TransferConduit } from "./TransferConduit.sol";

contract Kettle is Initializable, Ownable2StepUpgradeable, OfferController {
    using SafeERC20 for IERC20;

    uint256 private constant _BASIS_POINTS = 10_000;

    TransferConduit public conduit;
    LendingController public lending;
    EscrowController public escrow;

    uint256[] private _gap;

    function __Kettle_init(
        address conduitController,
        address lendingController, 
        address escrowController,
        address owner
    ) public initializer {
        __Ownable2Step_init();
        _transferOwnership(owner);

        __OfferController_init();

        conduit = TransferConduit(conduitController);
        lending = LendingController(lendingController);
        escrow = EscrowController(escrowController);
    }

    function fulfillMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(false, offer.soft) returns (uint256 netAmount) {
        _takeMarketOffer(tokenId, offer, signature, proof);

        netAmount = _transferFees(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        conduit.transferERC20From(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            netAmount
        );

        conduit.transferERC721From(
            offer.collateral.collection, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            tokenId
        );
    }

    function fulfillLoanOffer(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(false, offer.soft) returns (uint256 lienId) {
        uint256 principal = offer.side == Side.BID ? amount : offer.terms.amount;
        _takeLoanOffer(tokenId, principal, offer, signature, proof);

        conduit.transferERC20From(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            principal
        );

        conduit.transferERC721From(
            offer.collateral.collection, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            address(lending), 
            tokenId
        );

        lienId = lending.openLien(
            tokenId, 
            principal, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            offer
        );
    }

    function fulfillMarketOfferInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof  
    ) external requireSoft(false, offer.soft) returns (uint256 netAmount) {
        lending.validateLienIsCurrent(lienId, lien);

        _takeMarketOffer(lien.tokenId, offer, signature, proof);
        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );
        
        netAmount = _transferFees(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        if (offer.side == Side.ASK) {
            (uint256 debt,,) = lending.computeCurrentDebt(lien);
            if (debt > netAmount) {
                revert InsufficientAskAmount();
            }
        }

        lending.closeLienWithPayments(
            netAmount, 
            lienId, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            lien
        );

        lending.releaseCollateral(
            lien.collection, 
            lien.tokenId, 
            offer.side == Side.BID ? offer.maker : msg.sender
        );
    }

    function fulfillLoanOfferInLien(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(false, offer.soft) returns (uint256 newLienId) {
        lending.validateLienIsCurrent(lienId, lien);

        uint256 principal = offer.side == Side.BID ? amount : offer.terms.amount;

        _takeLoanOffer(lien.tokenId, principal, offer, signature, proof);
        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );

        if (offer.side == Side.ASK) {
            (uint256 debt,,) = lending.computeCurrentDebt(lien);
            if (debt > principal) {
                revert InsufficientAskAmount();
            }
        }

        lending.closeLienWithPayments(
            principal, 
            lienId, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            lien
        );

        newLienId = lending.openLien(
            lien.tokenId, 
            principal, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            lien.borrower, 
            offer
        );
    }

    function escrowMarketOffer(
        uint256 placeholder,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(true, offer.soft) returns (uint256 escrowId) {
        _takeMarketOffer(placeholder, offer, signature, proof);

        uint256 rebate = 0;
        if (offer.terms.rebate > 0) {
            rebate = Math.mulDiv(offer.terms.amount, offer.terms.rebate, _BASIS_POINTS);
            conduit.transferERC20From(
                offer.terms.currency,
                offer.side == Side.BID ? msg.sender : offer.maker, 
                address(escrow),
                rebate
            );
        }

        conduit.transferERC20From(
            offer.terms.currency,
            offer.side == Side.BID ? offer.maker : msg.sender,
            address(escrow),
            offer.terms.amount
        );

        escrowId = escrow.openEscrow(
            placeholder,
            rebate,
            offer.side == Side.BID ? offer.maker : msg.sender,
            offer.side == Side.BID ? msg.sender : offer.maker,
            offer
        );
    }

    function _transferFees(
        IERC20 currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = Math.mulDiv(amount, fee, _BASIS_POINTS);
        if (feeAmount > amount) revert InvalidFee();

        conduit.transferERC20From(currency, payer, recipient, feeAmount);
        netAmount = amount - feeAmount;
    }

    function _verifyBorrower(
        Side side,
        address borrower,
        address maker
    ) internal view {
        if (side == Side.ASK && borrower != maker) {
            revert MakerIsNotBorrower();
        }

        if (side == Side.BID && borrower != msg.sender) {
            revert TakerIsNotBorrower();
        }
    }

    function _matchTerms(
        IERC20 currency1,
        IERC20 currency2,
        IERC721 collection1,
        IERC721 collection2
    ) internal pure {
        if (currency1 != currency2) {
            revert CurrencyMismatch();
        }

        if (collection1 != collection2) {
            revert CollectionMismatch();
        }
    }

    modifier requireSoft(bool required, bool soft) {
        if (required != soft) {
            if (required) {
                revert CannotTakeHardOffer();
            } else {
                revert CannotTakeSoftOffer();
            }
        }
        _;
    }
}

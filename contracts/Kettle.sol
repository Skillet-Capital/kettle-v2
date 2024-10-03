// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import { KettleMath } from "./lib/KettleMath.sol";

import { LendingController } from "./Lending.sol";
import { EscrowController } from "./Escrow.sol";
import { OfferController } from "./OfferController.sol";

import { LienIsCurrent, TakerIsNotBorrower, MakerIsNotBorrower, InsufficientAskAmount, InvalidFee, CurrencyMismatch, CollectionMismatch, TokenMismatch, InvalidCriteria, InvalidToken, RequiresAskSide, RequiresBidSide, RequiresNakedBidSide, CannotTakeSoftOffer, CannotTakeHardOffer } from "./Errors.sol";

import { LoanOffer, MarketOffer, Lien, Permit, Side, Criteria } from "./Structs.sol";

contract Kettle is Initializable, Ownable2StepUpgradeable, OfferController, LendingController, EscrowController, ERC721Holder {
    using SafeERC20 for IERC20;

    uint256[] private _gap;

    function initialize(address lenderReceipt, address owner) public initializer {
        __LendingController_init(lenderReceipt);
        __EscrowController_init();
        __OfferController_init();

        __Ownable2Step_init();
        _transferOwnership(owner);
    }

    function fulfillMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(false, offer.soft) returns (uint256 netAmount) {
        _takeMarketOffer(offer, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId,
            proof
        );

        netAmount = _transferFees(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        IERC20(offer.terms.currency).safeTransferFrom(
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            netAmount
        );

        IERC721(offer.collateral.collection).safeTransferFrom(
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
        uint256 _amount = offer.side == Side.BID ? amount : offer.terms.amount;
        _takeLoanOffer(offer, _amount, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId, 
            proof
        );

        IERC20(offer.terms.currency).safeTransferFrom(
            offer.side == Side.BID ? offer.maker : msg.sender,
            offer.side == Side.BID ? msg.sender : offer.maker, 
            _amount
        );

        IERC721(offer.collateral.collection).safeTransferFrom(
            offer.side == Side.BID ? msg.sender : offer.maker, 
            address(this), 
            tokenId
        );

        lienId = _openLien(
            offer.side == Side.BID ? offer.maker : msg.sender,
            offer.side == Side.BID ? msg.sender : offer.maker,
            offer.collateral.collection, 
            tokenId,
            offer.terms.currency, 
            _amount, 
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function fulfillMarketOfferInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof  
    ) external requireSoft(false, offer.soft) lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256 netAmount) {
        if (offer.side == Side.BID && lien.borrower != msg.sender) {
            revert TakerIsNotBorrower();
        }

        if (offer.side == Side.ASK && lien.borrower != offer.maker) {
            revert MakerIsNotBorrower();
        }

        _takeMarketOffer(offer, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            0,  // tokenId matched in _verifyCollateral
            0
        );

        // (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);
        // uint256 marketFee = KettleMath.safeMulFee(offer.terms.amount, offer.fee.rate);
        // netAmount = offer.terms.amount - marketFee;

        // if (offer.side == Side.ASK && debt > netAmount) {
        //     revert InsufficientAskAmount();
        // }

        // address currentLender = _currentLender(lienId);

        // bool buyerIsLender = (offer.side == Side.BID && offer.maker == currentLender) || (offer.side == Side.ASK && msg.sender == currentLender);

        // // transfer amount in from buyer
        // if (!buyerIsLender) {
        //     IERC20(offer.terms.currency).safeTransferFrom(
        //         offer.side == Side.BID ? offer.maker : msg.sender, 
        //         address(this), 
        //         offer.terms.amount
        //     );
        // }

        // if (offer.side == Side.BID && netAmount < debt) {
        //     IERC20(offer.terms.currency).safeTransferFrom(
        //         msg.sender,
        //         address(this), 
        //         debt - netAmount
        //     );
        // }

        // // transfer market fee to market fee recipient
        // IERC20(offer.terms.currency).transfer(
        //     offer.fee.recipient, 
        //     marketFee
        // );

        // // transfer lending fee to lien recipient
        // IERC20(lien.currency).transfer(
        //     lien.recipient, 
        //     fee
        // );

        // // transfer amount owed to lender
        // IERC20(lien.currency).transfer(
        //     _currentLender(lienId), 
        //     lien.principal + interest
        // );

        // if (netAmount > debt) {
        //     // transfer excess amount to seller
        //     IERC20(offer.terms.currency).transfer(
        //         lien.borrower, 
        //         netAmount - debt
        //     );
        // }

        // transfer the net amount to the seller
        
        netAmount = _transferFees(
            offer.terms.currency, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        if (offer.side == Side.ASK && debt > netAmount) {
            revert InsufficientAskAmount();
        }

        _transferPayments(
            lien.currency, 
            netAmount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId),
            lien.recipient, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            offer.side == Side.BID ? msg.sender : offer.maker
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function fulfillLoanOfferInLien(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireSoft(false, offer.soft) lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256 newLienId) {
        uint256 _amount = offer.side == Side.BID ? amount : offer.terms.amount;

        if (offer.side == Side.BID && lien.borrower != msg.sender) {
            revert TakerIsNotBorrower();
        }

        if (offer.side == Side.ASK && lien.borrower != offer.maker) {
            revert MakerIsNotBorrower();
        }

        _takeLoanOffer(offer, amount, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            0,  // tokenId matched in _verifyCollateral
            0
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        if (offer.side == Side.ASK && debt > _amount) {
            revert InsufficientAskAmount();
        }

        _transferPayments(
            lien.currency, 
            _amount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId), 
            lien.recipient, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            offer.side == Side.BID ? msg.sender : offer.maker, 
            offer.side == Side.BID ? msg.sender : offer.maker
        );

        _closeLien(lienId);

        newLienId = _openLien(
            offer.maker, 
            lien.borrower, 
            lien.collection, 
            lien.tokenId,
            lien.currency, 
            amount, 
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    // function escrowMarketOffer(
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external requireSoft(true, offer.soft) returns (uint256 escrowId) {
    //     if (offer.side == Side.BID) {
    //         revert RequiresAskSide();
    //     }

    //     _takeMarketOffer(offer, signature);

    //     uint256 rebate = 0;
    //     if (rebate > 0) {
    //         rebate = KettleMath.safeMulFee(offer.terms.amount, offer.terms.rebate);
    //         IERC20(offer.terms.currency).safeTransferFrom(
    //             offer.side == Side.BID ? msg.sender : offer.maker, 
    //             address(this), 
    //             rebate
    //         );
    //     }

    //     IERC20(offer.terms.currency).safeTransferFrom(
    //         offer.side == Side.BID ? offer.maker : msg.sender,
    //         address(this),
    //         offer.terms.amount
    //     );

    //     escrowId = _openEscrow(
    //         offer.side,
    //         offer.collateral.identifier, // only for ask side
    //         offer.side == Side.BID ? offer.maker : msg.sender,
    //         offer.side == Side.BID ? msg.sender : offer.maker,
    //         offer.collateral.collection,
    //         offer.collateral.identifier,
    //         offer.terms.currency,
    //         offer.terms.amount,
    //         offer.fee.recipient,
    //         offer.fee.rate,
    //         offer.terms.rebate
    //     );
    // }

    function _transferFees(
        address currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = KettleMath.safeMulFee(amount, fee);
        if (feeAmount > amount) revert InvalidFee();

        IERC20(currency).safeTransferFrom(payer, recipient, feeAmount);
        netAmount = amount - feeAmount;
    }

    function _matchTerms(
        address currency1,
        address currency2,
        address collection1,
        address collection2,
        uint256 tokenId1,
        uint256 tokenId2
    ) internal pure {
        if (currency1 != currency2) {
            revert CurrencyMismatch();
        }

        if (collection1 != collection2) {
            revert CollectionMismatch();
        }

        if (tokenId1 != tokenId2) {
            revert TokenMismatch();
        }
    }

    function _verifyCollateral(
        Criteria criteria,
        uint256 identifier,
        uint256 tokenId,
        bytes32[] calldata proof
    ) internal pure {
        if (criteria == Criteria.PROOF) {
            if (
                !MerkleProof.verifyCalldata(
                    proof, 
                    bytes32(identifier), 
                    keccak256(abi.encode(bytes32(tokenId)))
                )
            ) {
                revert InvalidCriteria();
            }
        } else {
            if (!(tokenId == identifier)) {
                revert InvalidToken();
            }
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

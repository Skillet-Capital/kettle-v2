// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import { LendingController } from "./Lending.sol";
import { EscrowController } from "./Escrow.sol";
import { OfferController } from "./OfferController.sol";

import { ILenderReceipt } from "./interfaces/ILenderReceipt.sol";
import { IKettle } from "./interfaces/IKettle.sol";

import { LoanOffer, MarketOffer, Lien, Permit, Side, Criteria } from "./Structs.sol";

contract Kettle is IKettle, Initializable, Ownable2StepUpgradeable, OfferController, LendingController, EscrowController, ERC721Holder {
    using SafeERC20 for IERC20;

    uint256[] private _gap;

    function initialize(address lenderReceipt, address owner) public initializer {
        __LendingController_init(lenderReceipt);
        __EscrowController_init();
        __OfferController_init();

        __Ownable2Step_init();
        _transferOwnership(owner);
    }

    function buy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) external requireAsk(offer.side) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);

        netAmount = _market(
            msg.sender,
            offer.maker,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function buyWithPermit(
        MarketOffer calldata offer,
        Permit calldata permit,
        bytes calldata signature,
        bytes calldata permitSignature
    ) external requireAsk(offer.side) returns (uint256 netAmount) {

        bytes32 offerHash = _takeMarketOffer(offer, signature);
        _verifyPermit(permit, offerHash, permitSignature);

        netAmount = _market(
            permit.taker,
            offer.maker,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function sell(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireNakedBid(offer.side, offer.terms.withLoan) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);
        
        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId,
            proof
        );

        netAmount = _market(
            offer.maker,
            msg.sender,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            tokenId,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function lend(
        LoanOffer calldata offer,
        bytes calldata signature
    ) external requireAsk(offer.side) returns (uint256 lienId) 
    {
        _takeLoanOffer(offer, 0, signature);

        lienId = _lend(
            msg.sender, 
            offer.maker, 
            offer.collateral.collection, 
            offer.collateral.identifier,
            offer.terms.currency, 
            offer.terms.amount,
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function lendWithPermit(
        LoanOffer calldata offer,
        Permit calldata permit,
        bytes calldata signature,
        bytes calldata permitSignature
    ) public virtual requireAsk(offer.side) returns (uint256 lienId) {

        bytes32 offerHash = _takeLoanOffer(offer, 0, signature);
        _verifyPermit(permit, offerHash, permitSignature);

        lienId = _lend(
            permit.taker, 
            offer.maker, 
            offer.collateral.collection, 
            offer.collateral.identifier,
            offer.terms.currency, 
            offer.terms.amount,
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function borrow(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireBid(offer.side) returns (uint256 lienId) {

        _takeLoanOffer(offer, amount, signature);
        
        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId, 
            proof
        );

        lienId = _lend(
            offer.maker,
            msg.sender, 
            offer.collateral.collection, 
            tokenId,
            offer.terms.currency, 
            amount, 
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function _market(
        address buyer,
        address seller,
        address currency,
        uint256 amount,
        address collection,
        uint256 tokenId,
        address recipient,
        uint256 fee
    ) internal returns (uint256 netAmount) {

        netAmount = _transferFees(
            currency, 
            buyer, 
            recipient, 
            amount,
            fee
        );

        IERC20(currency).safeTransferFrom(
            buyer, 
            seller, 
            netAmount
        );

        IERC721(collection).safeTransferFrom(
            seller, 
            buyer, 
            tokenId
        );
    }

    function _lend(
        address lender,
        address borrower,
        address collection,
        uint256 tokenId,
        address currency,
        uint256 amount,
        uint256 rate,
        uint256 defaultRate,
        uint256 duration,
        uint256 gracePeriod,
        address recipient,
        uint256 fee
    ) internal returns (uint256 lienId) {

        lienId = _openLien(
            lender,
            borrower,
            collection, 
            tokenId,
            currency, 
            amount, 
            rate, 
            defaultRate, 
            duration, 
            gracePeriod, 
            recipient, 
            fee
        );

        IERC20(currency).safeTransferFrom(
            lender, 
            borrower,
            amount
        );

        IERC721(collection).safeTransferFrom(
            borrower, 
            address(this), 
            tokenId
        );
    }

    function repay(
        uint256 lienId,
        Lien calldata lien
    ) 
        external 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256) 
    {
        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        IERC20(lien.currency).safeTransferFrom(
            msg.sender, 
            _currentLender(lienId),
            lien.principal + interest
        );

        IERC20(lien.currency).safeTransferFrom(
            msg.sender, 
            lien.recipient,
            fee
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            lien.borrower, 
            lien.tokenId
        );

        _closeLien(lienId);

        return debt;
    }

    function claim(
        uint256 lienId,
        Lien calldata lien
    ) 
        external 
        lienIsValid(lienId, lien)
        returns (uint256)
    {
        if (!_lienIsDefaulted(lien)) {
            revert("LienIsCurrent");
        }

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            _currentLender(lienId), 
            lien.tokenId
        );

        _closeLien(lienId);

        return lienId;
    }

    function refinance(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) 
        external 
        requireBid(offer.side) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 newLienId) 
    {

        if (msg.sender != lien.borrower) {
            revert("TakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency,
            offer.terms.currency,
            lien.collection,
            offer.collateral.collection,
            lien.tokenId,
            offer.collateral.identifier
        );

        _takeLoanOffer(offer, amount, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        _transferPayments(
            lien.currency, 
            amount, 
            debt, 
            lien.principal + interest,
            fee,
            _currentLender(lienId), 
            lien.recipient, 
            offer.maker,
            msg.sender,
            msg.sender
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

    function buyInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature
    ) 
        external 
        requireAsk(offer.side) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 netAmount) 
    {        
        if (lien.borrower != offer.maker) {
            revert("AskMakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            lien.tokenId, 
            offer.collateral.identifier
        );

        _takeMarketOffer(offer, signature);

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        netAmount = _transferFees(
            offer.terms.currency, 
            msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        if (debt > netAmount) {
            revert("InsufficientAskAmount");
        }

        _transferPayments(
            lien.currency, 
            netAmount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId), 
            lien.recipient, 
            msg.sender, 
            msg.sender, 
            offer.maker
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            msg.sender, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function sellInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) 
        external
        requireNakedBid(offer.side, offer.terms.withLoan) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 netAmount) 
    {
        if (lien.borrower != msg.sender) {
            revert("TakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            0,  // tokenId matched in _verifyCollateral
            0
        );

        _takeMarketOffer(offer, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        netAmount = _transferFees(
            offer.terms.currency, 
            offer.maker, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        _transferPayments(
            lien.currency, 
            netAmount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId), 
            lien.recipient, 
            offer.maker, 
            msg.sender, 
            msg.sender
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            offer.maker, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function escrowBuy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) external returns (uint256 escrowId) {

        _takeMarketOffer(offer, signature);

        uint256 rebate = _calculateRebate(
            offer.terms.amount, 
            offer.terms.rebate
        );

        escrowId = _openEscrow(
            offer.collateral.identifier,
            msg.sender,
            offer.maker,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.terms.currency,
            offer.terms.amount,
            offer.fee.recipient,
            offer.fee.rate,
            rebate
        );

        if (rebate > 0) {
            IERC20(offer.terms.currency).safeTransferFrom(
                offer.maker,
                address(this),
                rebate
            );
        }

        IERC20(offer.terms.currency).safeTransferFrom(
            msg.sender,
            address(this),
            offer.terms.amount
        );
    }

    // function escrowSell(
    //     uint256 placeholder,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256 escrowId) {

    //     _takeMarketOffer(offer, signature);

    //     uint256 rebate = _calculateRebate(
    //         offer.terms.amount, 
    //         offer.terms.rebate
    //     );

    //     escrowId = _openEscrow(
    //         placeholder,
    //         offer.maker,
    //         msg.sender,
    //         offer.collateral.collection,
    //         offer.collateral.identifier,
    //         offer.terms.currency,
    //         offer.terms.amount,
    //         offer.fee.recipient,
    //         offer.fee.rate,
    //         rebate
    //     );

    //     if (rebate > 0) {
    //         IERC20(offer.terms.currency).safeTransferFrom(
    //             msg.sender,
    //             address(this),
    //             rebate
    //         );
    //     }

    //     IERC20(offer.terms.currency).safeTransferFrom(
    //         offer.maker,
    //         address(this),
    //         offer.terms.amount
    //     );
    // }

    function _transferFees(
        address currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = (amount * fee) / 10_000;
        if (feeAmount > amount) revert("InvalidFee");

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
            revert("CurrencyMismatch");
        }

        if (collection1 != collection2) {
            revert("CollectionMismatch");
        }

        if (tokenId1 != tokenId2) {
            revert("TokenMismatch");
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
                revert("InvalidCriteria");
            }
        } else {
            if (!(tokenId == identifier)) {
                revert("InvalidToken");
            }
        }
    }

    modifier requireBid(Side side) {
        if (side != Side.BID) {
            revert("RequiresBidSide");
        }
        _;
    }

    modifier requireNakedBid(Side side, bool withLoan) {
        if (side != Side.BID || withLoan) {
            revert("RequiresNakedBid");
        }
        _;
    }

    modifier requireAsk(Side side) {
        if (side != Side.ASK) {
            revert("RequiresAskSide");
        }
        _;
    }
}

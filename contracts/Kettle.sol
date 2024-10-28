// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "./interfaces/ILendingController.sol";
import "./interfaces/IEscrowController.sol";
import "./OfferController.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Kettle is Initializable, Ownable2StepUpgradeable, OfferController, ERC721Holder {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    ILendingController public LENDING_CONTROLLER;
    IEscrowController public ESCROW_CONTROLLER;

    uint256[50] private _gap;

    function __Kettle_init(
        address owner,
        address _lendingController, 
        address _escrowController
    ) external initializer {
        __OfferController_init();

        __Ownable2Step_init();
        _transferOwnership(owner);

        LENDING_CONTROLLER = ILendingController(_lendingController);
        ESCROW_CONTROLLER = IEscrowController(_escrowController);
    }

    // ==================================================
    //               MARKETPLACE FUNCTIONS
    // ==================================================

    function fulfillMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireMarketOffer(offer.kind) returns (uint256 netAmount) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        bool isBid = offer.side == Side.BID;
        address buyer = isBid ? offer.maker : msg.sender;
        address seller = isBid ? msg.sender : offer.maker;

        _takeMarketOffer(tokenId, offer, signature, proof);

        netAmount = _transferFees(
            offer.terms.currency, 
            buyer,
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        offer.terms.currency.safeTransferFrom(
            buyer,
            seller,
            netAmount
        );

        offer.collateral.collection.safeTransferFrom(
            seller,
            buyer,
            tokenId
        );
    }

    function fulfillLoanOffer(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireLoanOffer(offer.kind) returns (uint256 lienId) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        bool isBid = offer.side == Side.BID;
        uint256 principal = isBid ? amount : offer.terms.amount;
        address borrower = isBid ? msg.sender : offer.maker;
        address lender = isBid ? offer.maker : msg.sender;
        
        _takeLoanOffer(tokenId, principal, offer, signature, proof);

        offer.terms.currency.safeTransferFrom(
            lender,
            borrower,
            principal
        );

        offer.collateral.collection.safeTransferFrom(
            borrower,
            address(this),
            tokenId
        );

        lienId = LENDING_CONTROLLER.openLien(
            tokenId, 
            principal, 
            lender, 
            borrower, 
            offer
        );
    }

    function fulfillMarketOfferInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof  
    ) external requireMarketOffer(offer.kind) returns (uint256 netAmount) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );

        _takeMarketOffer(lien.tokenId, offer, signature, proof);

        address buyer = offer.side == Side.BID ? offer.maker : msg.sender;
        uint256 marketFee = Math.mulDiv(offer.terms.amount, offer.fee.rate, _BASIS_POINTS);
        if (marketFee > offer.terms.amount) {
            revert InvalidFee();
        }

        (
            address lender,
            uint256 debt,
            uint256 fee,
            uint256 interest
        ) = LENDING_CONTROLLER.repayLien(lienId, lien);

        if (offer.side == Side.ASK && (offer.terms.amount - marketFee) < debt) {
            revert InsufficientAskAmount();
        }

        _loanPayments(
            offer.terms.currency,
            lien.borrower,
            lender,
            buyer,
            lien.recipient,
            offer.fee.recipient,
            offer.terms.amount,
            lien.principal,
            interest,
            fee,
            marketFee
        );

        lien.collection.safeTransferFrom(
            address(this),
            buyer,
            lien.tokenId
        );
    }

    function fulfillLoanOfferInLien(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireLoanOffer(offer.kind) returns (uint256 newLienId) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );

        uint256 principal = offer.side == Side.BID ? amount : offer.terms.amount;
        _takeLoanOffer(lien.tokenId, principal, offer, signature, proof);

        address refinancer = offer.side == Side.BID ? offer.maker : msg.sender;

        (
            address lender,
            uint256 debt,
            uint256 fee,
            uint256 interest
        ) = LENDING_CONTROLLER.repayLien(lienId, lien);

        if (offer.side == Side.ASK && offer.terms.amount < debt) {
            revert InsufficientAskAmount();
        }

        _loanPayments(
            offer.terms.currency,
            lien.borrower,
            lender,
            refinancer,
            lien.recipient,
            address(0),
            principal,
            lien.principal,
            interest,
            fee,
            0
        );

        newLienId = LENDING_CONTROLLER.openLien(
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
    ) external requireMarketOffer(offer.kind) returns (uint256 escrowId) {
        if (!offer.soft) {
            revert CannotTakeHardOffer();
        }

        _takeMarketOffer(placeholder, offer, signature, proof);

        bool isBid = offer.side == Side.BID;
        address buyer = isBid ? offer.maker : msg.sender;
        address seller = isBid ? msg.sender : offer.maker;

        uint256 rebate = 0;
        if (offer.terms.rebate > 0) {
            rebate = Math.mulDiv(offer.terms.amount, offer.terms.rebate, _BASIS_POINTS);
            if (rebate > offer.terms.amount) {
                revert InvalidRebate();
            }

            offer.terms.currency.safeTransferFrom(
                seller,
                address(this),
                rebate
            );
        }

        offer.terms.currency.safeTransferFrom(
            buyer,
            address(this),
            offer.terms.amount
        );

        escrowId = ESCROW_CONTROLLER.openEscrow(
            placeholder,
            rebate,
            buyer,
            seller,
            offer
        );
    }

    // ==================================================
    //                LENDING FUNCTIONS
    // ==================================================

    function repayLien(
        uint256 lienId,
        Lien calldata lien
    ) external returns (uint256) {
        (
            address lender,
            uint256 debt,
            uint256 fee,
            uint256 interest
        ) = LENDING_CONTROLLER.repayLien(lienId, lien);

        lien.currency.safeTransferFrom(
            msg.sender,
            lender,
            lien.principal + interest
        );

        lien.currency.safeTransferFrom(
            msg.sender,
            lien.recipient,
            fee
        );

        lien.collection.safeTransferFrom(
            address(this),
            lien.borrower,
            lien.tokenId
        );

        return debt;
    }

    function claimLien(
        uint256 lienId,
        Lien calldata lien
    ) external {
        address lender = LENDING_CONTROLLER.claimLien(lienId, lien);

        lien.collection.safeTransferFrom(
            address(this),
            lender,
            lien.tokenId
        );
    }

    // ==================================================
    //                ESCROW FUNCTIONS
    // ==================================================

    function settleEscrow(
        uint256 tokenId,
        uint256 escrowId, 
        Escrow calldata escrow
    ) external onlyOwner {
        ESCROW_CONTROLLER.settleEscrow(escrowId, escrow, tokenId);

        uint256 netAmount = escrow.amount;
        if (escrow.fee > 0) {
            netAmount = _transferFees(
                escrow.currency,
                address(this),
                escrow.recipient,
                escrow.amount,
                escrow.fee
            );
        }

        escrow.currency.transfer(
            escrow.seller, 
            netAmount + escrow.rebate
        );

        escrow.collection.safeTransferFrom(
            ESCROW_CONTROLLER.TOKEN_SUPPLIER(),
            escrow.buyer,
            tokenId
        );
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external {
        escrow.currency.transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );

        ESCROW_CONTROLLER.claimEscrow(escrowId, escrow); 
    }

    function rejectEscrow(
        bool returnRebate,
        uint256 escrowId, 
        Escrow calldata escrow
    ) external onlyOwner {
        if (returnRebate) {
            escrow.currency.transfer(
                escrow.seller,
                escrow.rebate
            );

            escrow.currency.transfer(
                escrow.buyer,
                escrow.amount
            );
        } else {
            escrow.currency.transfer(
                escrow.buyer,
                escrow.amount + escrow.rebate
            );
        }

        ESCROW_CONTROLLER.rejectEscrow(escrowId, escrow, returnRebate);
    }

    // ==================================================
    //               HELPER FUNCTIONS
    // ==================================================

    function _transferFees(
        IERC20 currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = Math.mulDiv(amount, fee, _BASIS_POINTS);
        if (feeAmount > amount) revert InvalidFee();

        if (payer == address(this)) {
            currency.transfer(
                recipient,
                feeAmount
            );
        } else {
            currency.safeTransferFrom(
                payer,
                recipient,
                feeAmount
            );
        }

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

    function _loanPayments(
        IERC20 currency,
        address borrower,
        address lender,
        address financer,
        address lendingFeeRecipient,
        address marketFeeRecipient,
        uint256 amount,
        uint256 principal,
        uint256 interest,
        uint256 lendingFee,
        uint256 marketFee
    ) internal {
        uint256 debt = principal + interest + lendingFee;
        uint256 netProceeds = amount - marketFee;
        uint256 lenderOut = principal + interest;
        uint256 financerIn = amount;
        uint256 borrowerIn = debt > netProceeds ? debt - netProceeds : 0;
        uint256 borrowerOut = debt < netProceeds ? netProceeds - debt : 0;

        if (financer == lender) {
            if (amount >= lenderOut) {
                financerIn -= lenderOut;
                lenderOut = 0;
            } else {
                lenderOut -= amount;
                financerIn = 0;
            }
        }

        if (financerIn > 0) {
            currency.safeTransferFrom(financer, address(this), financerIn);
        }

        if (borrowerIn > 0) {
            currency.safeTransferFrom(borrower, address(this), borrowerIn);
        }

        if (borrowerOut > 0) {
            currency.transfer(borrower, borrowerOut);
        }

        if (lenderOut > 0) {
            currency.transfer(lender, lenderOut);
        }

        if (lendingFee > 0) {
            currency.transfer(lendingFeeRecipient, lendingFee);
        }

        if (marketFee > 0) {
            currency.transfer(marketFeeRecipient, marketFee);
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

    // ==================================================
    //                    MODIFIERS
    // ==================================================

    modifier requireMarketOffer(OfferKind kind) {
        if (kind != OfferKind.MARKET) {
            revert InvalidMarketOffer();
        }
        _;
    }

    modifier requireLoanOffer(OfferKind kind) {
        if (kind != OfferKind.LOAN) {
            revert InvalidLoanOffer();
        }
        _;
    }
}

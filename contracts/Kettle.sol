// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "./interfaces/IKettle.sol";
import "./interfaces/ILendingController.sol";
import "./interfaces/IEscrowController.sol";
import "./interfaces/IRedemptionController.sol";
import "./OfferController.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Kettle is IKettle, Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, OfferController, ERC721Holder {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    IEscrowController public ESCROW_CONTROLLER;
    ILendingController public LENDING_CONTROLLER;
    IRedemptionController public REDEMPTION_CONTROLLER;

    uint256[50] private _gap;

    function __Kettle_init(
        address owner,
        address _lendingController, 
        address _escrowController,
        address _redemptionManager
    ) external initializer {
        __Ownable_init(owner);
        __OfferController_init();

        LENDING_CONTROLLER = ILendingController(_lendingController);
        ESCROW_CONTROLLER = IEscrowController(_escrowController);
        REDEMPTION_CONTROLLER = IRedemptionController(_redemptionManager);
    }

    // ==================================================
    //               MARKETPLACE FUNCTIONS
    // ==================================================

    function redeemCollateral(
        uint256 tokenId,
        IERC721 collection,
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) external nonReentrant {
        _redeemCollateral(tokenId, collection, msg.sender, charge, signature);
    }

    function fulfillMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant requireMarketOffer(offer.kind) returns (uint256 netAmount) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);
        _takeMarketOffer(tokenId, offer, signature, proof);

        netAmount = _fulfillMarketOfferPayments(buyer, seller, offer);
        offer.collateral.collection.safeTransferFrom(
            seller,
            buyer,
            tokenId
        );
    }

    function fulfillMarketOfferWithRedemption(
        uint256 tokenId,
        MarketOffer calldata offer,
        RedemptionCharge calldata charge,
        bytes calldata offerSignature,
        bytes calldata chargeSignature,
        bytes32[] calldata proof
    ) external nonReentrant requireMarketOffer(offer.kind) returns (uint256 netAmount) {
        if (offer.soft) revert CannotTakeSoftOffer();
        if (offer.side == Side.BID) revert CannotRedeemFromBid();

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);
        _takeMarketOffer(tokenId, offer, offerSignature, proof);

        netAmount = _fulfillMarketOfferPayments(buyer, seller, offer);
        _redeemCollateral(
            tokenId, 
            offer.collateral.collection, 
            seller, 
            charge, 
            chargeSignature
        );
    }

    function _fulfillMarketOfferPayments(
        address buyer,
        address seller,
        MarketOffer calldata offer
    ) internal returns (uint256 netAmount) {
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
    }

    function _redeemCollateral(
        uint256 tokenId,
        IERC721 collection,
        address source,
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) internal {
        bytes32 _hash = _verifyRedemptionCharge(
            REDEMPTION_CONTROLLER.admin(), 
            tokenId,
            collection,
            charge, 
            signature
        );

        collection.safeTransferFrom(
            source,
            address(REDEMPTION_CONTROLLER.redemptionWallet()),
            tokenId
        );

        charge.currency.safeTransferFrom(
            msg.sender,
            address(REDEMPTION_CONTROLLER.redemptionWallet()),
            charge.amount
        );

        emit Redemption({
            hash: _hash,
            redeemer: msg.sender,
            collection: collection,
            tokenId: tokenId,
            currency: charge.currency,
            amount: charge.amount
        });
    }

    function fulfillLoanOffer(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant requireLoanOffer(offer.kind) returns (uint256 lienId) {
        if (offer.soft) {
            revert CannotTakeSoftOffer();
        }

        (address lender, address borrower) = _findBuyerAndSeller(offer.side, offer.maker);
        uint256 principal = _findPrincipal(offer.side, offer.terms.amount, amount);
        
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
    ) external nonReentrant requireMarketOffer(offer.kind) returns (uint256 netAmount) {
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
        uint256 marketFee = _calculateFee(offer.terms.amount, offer.fee.rate);

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
    ) external nonReentrant requireLoanOffer(offer.kind) returns (uint256 newLienId) {
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

        uint256 principal = _findPrincipal(offer.side, offer.terms.amount, amount);
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

        emit Refinance({
            oldLienId: lienId,
            newLienId: newLienId
        });
    }

    function escrowMarketOffer(
        uint256 placeholder,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant requireMarketOffer(offer.kind) returns (uint256 escrowId) {
        if (!offer.soft) {
            revert CannotTakeHardOffer();
        }

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);
        _takeMarketOffer(placeholder, offer, signature, proof);

        uint256 rebate = _escrowMarketOfferPayments(buyer, seller, offer);
        escrowId = ESCROW_CONTROLLER.openEscrow(
            placeholder,
            rebate,
            false,
            bytes32(0),
            0,
            buyer,
            seller,
            offer
        );
    }

    function escrowMarketOfferWithRedemption(
        uint256 placeholder,
        MarketOffer calldata offer,
        RedemptionCharge calldata charge,
        bytes calldata offerSignature,
        bytes calldata chargeSignature,
        bytes32[] calldata proof
    ) external nonReentrant requireMarketOffer(offer.kind) returns (uint256 escrowId) {
        if (!offer.soft) revert CannotTakeHardOffer();
        if (offer.side == Side.BID) revert CannotRedeemFromBid();

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);
        _takeMarketOffer(placeholder, offer, offerSignature, proof);

        uint256 rebate = _escrowMarketOfferPayments(buyer, seller, offer);

        // escrow and store redemption charge
        bytes32 _hash = _verifyRedemptionCharge(
            REDEMPTION_CONTROLLER.admin(),
            placeholder,
            offer.collateral.collection,
            charge, 
            chargeSignature
        );

        if (charge.currency != offer.terms.currency) {
            revert CurrencyMismatch();
        }

        charge.currency.safeTransferFrom(
            buyer,
            address(this),
            charge.amount
        );

        escrowId = ESCROW_CONTROLLER.openEscrow(
            placeholder,
            rebate,
            true,
            _hash,
            charge.amount,
            buyer,
            seller,
            offer
        );
    }

    function _escrowMarketOfferPayments(
        address buyer,
        address seller,
        MarketOffer calldata offer
    ) internal returns (uint256 rebate) {
        if (offer.terms.rebate > 0) {
            rebate = _calculateFee(offer.terms.amount, offer.terms.rebate);

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
    }

    // ==================================================
    //                LENDING FUNCTIONS
    // ==================================================

    function repayLien(
        uint256 lienId,
        Lien calldata lien
    ) external nonReentrant returns (uint256) {
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
    ) external nonReentrant {
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

        // redeem token if necessary
        if (escrow.withRedemption) {
            escrow.currency.transfer(
                address(REDEMPTION_CONTROLLER.redemptionWallet()),
                escrow.redemptionCharge
            );

            escrow.collection.safeTransferFrom(
                ESCROW_CONTROLLER.TOKEN_SUPPLIER(),
                address(REDEMPTION_CONTROLLER.redemptionWallet()),
                tokenId
            );

            emit Redemption({
                hash: escrow.redemptionHash,
                redeemer: escrow.buyer,
                collection: escrow.collection,
                tokenId: tokenId,
                currency: escrow.currency,
                amount: escrow.redemptionCharge
            });

        } else {
            escrow.collection.safeTransferFrom(
                ESCROW_CONTROLLER.TOKEN_SUPPLIER(),
                escrow.buyer,
                tokenId
            );
        }
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external nonReentrant {
        escrow.currency.transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );
        
        // if redemption, return charge to buyer
        if (escrow.withRedemption) {
            escrow.currency.transfer(
                escrow.buyer,
                escrow.redemptionCharge
            );
        }

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
                escrow.amount + escrow.redemptionCharge
            );
        } else {
            escrow.currency.transfer(
                escrow.buyer,
                escrow.amount + escrow.rebate
            );

            if (escrow.withRedemption) {
                escrow.currency.transfer(
                    escrow.buyer,
                    escrow.redemptionCharge
                );
            }
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
        uint256 feeAmount = _calculateFee(amount, fee);

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

        if (financer == lender) {
            if (amount >= lenderOut) {
                financerIn -= lenderOut;
                lenderOut = 0;
            } else {
                lenderOut -= amount;
                financerIn = 0;
            }
        }

        _processTransfer(currency, financer, address(this), financerIn);

        if (debt > netProceeds) {
            currency.safeTransferFrom(borrower, address(this), debt - netProceeds);
        }

        if (debt < netProceeds) {
            currency.transfer(borrower, netProceeds - debt);
        }

        _processTransfer(currency, address(this), lender, lenderOut);
        _processTransfer(currency, address(this), lendingFeeRecipient, lendingFee);
        _processTransfer(currency, address(this), marketFeeRecipient, marketFee);
    }

    function _processTransfer(
        IERC20 currency,
        address from,
        address to,
        uint256 amount
    ) internal {
        if (amount == 0) return;
        if (from == to) return;
        if (from == address(this)) {
            currency.transfer(to, amount);
        } else {
            currency.safeTransferFrom(from, to, amount);
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

    function _calculateFee(
        uint256 amount,
        uint256 rate
    ) internal pure returns (uint256 fee) {
        fee = Math.mulDiv(amount, rate, _BASIS_POINTS);
        if (fee > amount) {
            revert InvalidFee();
        }
    }

    function _findBuyerAndSeller(
        Side side,
        address maker
    ) internal view returns (address buyer, address seller) {
        if (side == Side.BID) {
            buyer = maker;
            seller = msg.sender;
        } else {
            buyer = msg.sender;
            seller = maker;
        }
    }

    function _findPrincipal(
        Side side,
        uint256 offerAmount,
        uint256 amount
    ) internal view returns (uint256 principal) {
        if (side == Side.BID) {
            principal = amount;
        } else {
            principal = offerAmount;
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

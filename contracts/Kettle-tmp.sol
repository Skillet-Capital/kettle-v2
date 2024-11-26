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
// import "./interfaces/IRedemptionManager.sol";
import "./OfferController.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Kettle is IKettle, Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, OfferController, ERC721Holder {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    ILendingController public LENDING_CONTROLLER;
    IEscrowController public ESCROW_CONTROLLER;
    // IRedemptionManager public REDEMPTION_CONTROLLER;

    uint256[50] private _gap;

    function __Kettle_init(
        address owner,
        address _lendingController, 
        address _escrowController
        // address _redemptionManager
    ) external initializer {
        __Ownable_init(owner);
        __OfferController_init();

        LENDING_CONTROLLER = ILendingController(_lendingController);
        ESCROW_CONTROLLER = IEscrowController(_escrowController);
        // REDEMPTION_MANAGER = IRedemptionManager(_redemptionManager);
    }

    // ==================================================
    //               MARKETPLACE FUNCTIONS
    // ==================================================

    function takeAsk(
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant {
        if (offer.kind != OfferKind.MARKET) {
            revert InvalidMarketOffer();
        }

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);

        _takeMarketOffer(offer.collateral.identifier, offer, signature, proof);

        if (offer.soft) {
            _escrowMarketOffer(buyer, seller, offer.collateral.identifier, offer);

        } else {
            _completeMarketOffer(buyer, seller, offer.collateral.identifier, offer);
        }
    }

    function takeAskWithDelayedPayment(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant {
        if (offer.kind != OfferKind.MARKET) {
            revert InvalidMarketOffer();
        }

        (address buyer, address seller) = _findBuyerAndSeller(offer.side, offer.maker);

        _takeMarketOffer(tokenId, offer, signature, proof);

        if (offer.soft) {
            _escrowMarketOffer(buyer, seller, tokenId, offer);

        } else {
            _completeMarketOffer(buyer, seller, tokenId, offer);
        }
    }

    function _completeMarketOffer(
        address buyer,
        address seller,
        uint256 tokenId,
        MarketOffer calldata offer
    ) internal {
        uint256 netAmount = _transferFees(
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

    function _escrowMarketOffer(
        address buyer,
        address seller,
        uint256 placeholder,
        MarketOffer calldata offer
    ) internal {
        uint256 rebate = 0;
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

        // open escrow
        ESCROW_CONTROLLER.openEscrow(
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

        escrow.collection.safeTransferFrom(
            ESCROW_CONTROLLER.TOKEN_SUPPLIER(),
            escrow.buyer,
            tokenId
        );
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external nonReentrant {
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

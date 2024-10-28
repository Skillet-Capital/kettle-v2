// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import "./interfaces/ILendingController.sol";
import "./EscrowController.sol";
import "./OfferController.sol";

import "./interfaces/ITransferConduit.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Kettle is Initializable, Ownable2StepUpgradeable, OfferController {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    ITransferConduit public conduit;
    ILendingController public lending;
    EscrowController public escrow;

    uint256[50] private _gap;

    // struct Payment {
    //     address from;
    //     address to;
    //     uint256 amount;
    // }

    function __Kettle_init(
        address conduitController,
        address lendingController, 
        address escrowController,
        address owner
    ) external initializer {
        __OfferController_init();

        conduit = ITransferConduit(conduitController);
        lending = ILendingController(lendingController);
        escrow = EscrowController(escrowController);

        __Ownable2Step_init();
        _transferOwnership(owner);
    }

    function fulfillMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireMarketOffer(offer.kind) requireSoft(false, offer.soft) returns (uint256 netAmount) {
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

        conduit.transferERC20From(
            offer.terms.currency, 
            buyer, 
            seller, 
            netAmount
        );

        conduit.transferERC721From(
            offer.collateral.collection, 
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
    ) external requireLoanOffer(offer.kind) requireSoft(false, offer.soft) returns (uint256 lienId) {
        bool isBid = offer.side == Side.BID;
        uint256 principal = isBid ? amount : offer.terms.amount;
        address borrower = isBid ? msg.sender : offer.maker;
        address lender = isBid ? offer.maker : msg.sender;
        
        _takeLoanOffer(tokenId, principal, offer, signature, proof);

        conduit.transferERC20From(
            offer.terms.currency, 
            lender, 
            borrower, 
            principal
        );

        conduit.transferERC721From(
            offer.collateral.collection, 
            borrower, 
            address(lending), 
            tokenId
        );

        lienId = lending.openLien(
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
    ) external requireMarketOffer(offer.kind) requireSoft(false, offer.soft) returns (uint256 netAmount) {
        lending.verifyLienIsCurrent(lienId, lien);
        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );

        _takeMarketOffer(lien.tokenId, offer, signature, proof);

        address lender = lending.currentLender(lienId);
        address buyer = offer.side == Side.BID ? offer.maker : msg.sender;

        uint256 marketFee = Math.mulDiv(offer.terms.amount, offer.fee.rate, _BASIS_POINTS);
        (uint256 debt, uint256 fee, uint256 interest) = lending.computeCurrentDebt(lien);

        if (offer.side == Side.ASK && offer.terms.amount - marketFee < debt) {
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

        // uint256 buyerIn = (buyer == lender)
        //     ? offer.terms.amount > (lien.principal + interest)
        //         ? offer.terms.amount - (lien.principal + interest)
        //         : 0
        //     : offer.terms.amount;

        // uint256 lenderOut = (buyer == lender)
        //     ? 0
        //     : lien.principal + interest;
        
        // uint256 borrowerIn = (debt > offer.terms.amount - marketFee)
        //     ? debt - (offer.terms.amount - marketFee)
        //     : 0;

        // uint256 borrowerOut = (debt < (offer.terms.amount - marketFee))
        //     ? (offer.terms.amount - marketFee) - debt
        //     : 0;

        // conduit.transferERC20From(
        //     offer.terms.currency, 
        //     buyer, 
        //     address(this), 
        //     buyerIn
        // );

        // conduit.transferERC20From(
        //     offer.terms.currency, 
        //     borrower, 
        //     address(this), 
        //     borrowerIn
        // );

        // if (borrowerOut > 0) {
        //     offer.terms.currency.transfer(
        //         borrower, 
        //         borrowerOut
        //     );
        // }

        // if (lenderOut > 0) {
        //     offer.terms.currency.transfer(
        //         lender,
        //         lenderOut
        //     );
        // }

        // offer.terms.currency.transfer(
        //     lien.recipient,
        //     fee
        // );

        // offer.terms.currency.transfer(
        //     offer.fee.recipient,
        //     marketFee
        // );

        lending.closeLien(lienId);

        // netAmount = _transferFees(
        //     offer.terms.currency, 
        //     offer.side == Side.BID ? offer.maker : msg.sender, 
        //     offer.fee.recipient, 
        //     offer.terms.amount, 
        //     offer.fee.rate
        // );

        // if (offer.side == Side.ASK) {
        //     (uint256 debt,,) = lending.computeCurrentDebt(lien);
        //     if (debt > netAmount) {
        //         revert InsufficientAskAmount();
        //     }
        // }

        // lending.closeLienWithPayments(
        //     netAmount, 
        //     lienId, 
        //     offer.side == Side.BID ? offer.maker : msg.sender, 
        //     offer.side == Side.BID ? msg.sender : offer.maker, 
        //     lien
        // );

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
    ) external requireLoanOffer(offer.kind) requireSoft(false, offer.soft) returns (uint256 newLienId) {
        lending.verifyLienIsCurrent(lienId, lien);
        _verifyBorrower(offer.side, lien.borrower, offer.maker);

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection
        );

        uint256 principal = offer.side == Side.BID ? amount : offer.terms.amount;
        _takeLoanOffer(lien.tokenId, principal, offer, signature, proof);

        (uint256 debt, uint256 fee, uint256 interest) = lending.computeCurrentDebt(lien);

        if (offer.side == Side.ASK && offer.terms.amount < debt) {
            revert InsufficientAskAmount();
        }

        address lender = lending.currentLender(lienId);
        address refinancer = offer.side == Side.BID ? offer.maker : msg.sender;
        address borrower = offer.side == Side.BID ? msg.sender : offer.maker;

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

        // uint256 refinancerIn = (refinancer == lender)
        //     ? offer.terms.amount > (lien.principal + interest)
        //         ? offer.terms.amount - (lien.principal + interest)
        //         : 0
        //     : offer.terms.amount;

        // uint256 lenderOut = (refinancer == lender)
        //     ? 0
        //     : lien.principal + interest;
        
        // uint256 borrowerIn = (debt > offer.terms.amount)
        //     ? debt - offer.terms.amount
        //     : 0;

        // uint256 borrowerOut = (debt < offer.terms.amount)
        //     ? offer.terms.amount - debt
        //     : 0;

        // conduit.transferERC20From(
        //     offer.terms.currency, 
        //     refinancer, 
        //     address(this), 
        //     refinancerIn
        // );

        // conduit.transferERC20From(
        //     offer.terms.currency, 
        //     borrower, 
        //     address(this), 
        //     borrowerIn
        // );

        // if (borrowerOut > 0) {
        //     offer.terms.currency.transfer(
        //         borrower, 
        //         borrowerOut
        //     );
        // }

        // if (lenderOut > 0) {
        //     offer.terms.currency.transfer(
        //         lender,
        //         lenderOut
        //     );
        // }

        // offer.terms.currency.transfer(
        //     lien.recipient,
        //     fee
        // );

        lending.closeLien(lienId);

        // lending.closeLienWithPayments(
        //     principal, 
        //     lienId, 
        //     offer.side == Side.BID ? offer.maker : msg.sender, 
        //     offer.side == Side.BID ? msg.sender : offer.maker, 
        //     lien
        // );

        newLienId = lending.openLien(
            lien.tokenId, 
            principal, 
            offer.side == Side.BID ? offer.maker : msg.sender, 
            lien.borrower, 
            offer
        );
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
        uint256 lenderOut = principal + interest;
        bool financerIsLender = financer == lender;

        uint256 financerIn = amount;
        if (financerIsLender) {
            lenderOut = 0;
            financerIn = amount > lenderOut
                ? amount - lenderOut
                : 0;
        }
        
        uint256 netProceeds = amount - marketFee;
        uint256 borrowerIn = (debt > netProceeds)
            ? debt - netProceeds
            : 0;

        uint256 borrowerOut = (debt < netProceeds)
            ? netProceeds - debt
            : 0;

        // Payment[6] memory payments = [
        //     Payment({ from: financer, to: address(this), amount: financerIn }),
        //     Payment({ from: borrower, to: address(this), amount: borrowerIn }),
        //     Payment({ from: address(this), to: borrower, amount: borrowerOut }),
        //     Payment({ from: address(this), to: lender, amount: lenderOut }),
        //     Payment({ from: address(this), to: lendingFeeRecipient, amount: lendingFee }),
        //     Payment({ from: address(this), to: marketFeeRecipient, amount: marketFee })
        // ];

        // for (uint256 i=0; i<6; i++) {
        //     Payment memory payment = payments[i];
        //     if (payment.to != address(0) && payment.amount > 0) {
        //         if (payment.from == address(this)) {
        //             currency.transfer(
        //                 payment.to,
        //                 payment.amount
        //             );
        //         } else {
        //             conduit.transferERC20From(
        //                 currency,
        //                 payment.from,
        //                 payment.to,
        //                 payment.amount
        //             );
        //         }
        //     }
        // }

        // if (financerIn > 0) {
            conduit.transferERC20From(
                currency, 
                financer, 
                address(this), 
                financerIn
            );
        // }

        // if (borrowerIn > 0) {
            conduit.transferERC20From(
                currency, 
                borrower, 
                address(this), 
                borrowerIn
            );
        // }

        // if (borrowerOut > 0) {
            currency.transfer(
                borrower, 
                borrowerOut
            );
        // }

        // if (lenderOut > 0) {
            currency.transfer(
                lender,
                lenderOut
            );
        // }

        // if (lendingFee > 0) {
            currency.transfer(
                lendingFeeRecipient,
                lendingFee
            );
        // }

        // if (marketFee > 0) {
            currency.transfer(
                marketFeeRecipient,
                marketFee
            );
        // }
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ERC1155Holder } from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import { LoanOffer, MarketOffer, Lien, Permit, Side } from "./Structs.sol";

import { Transfer } from "./Transfer.sol";
import { OfferController } from "./OfferController.sol";

import { Distributions } from "./lib/Distributions.sol";
import { CollateralVerifier } from "./lib/CollateralVerifier.sol";

import { ILenderReceipt } from "./LenderReceipt.sol";

import { Lending } from "./Lending.sol";

import { IKettle } from "./interfaces/IKettle.sol";

// import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title Kettle Lending and Marketplace Contract
 * @author diamondjim.eth
 * @notice Provides lending and marketplace functionality for ERC721 and ERC1155
 */
contract Kettle is IKettle, Initializable, OfferController, Lending, Transfer, ERC721Holder {

    function initialize(address receipt, address owner) public initializer {
        __Lending_init__(receipt);
        __OfferController_init(owner);
    }

    /**
     * @notice Takes an ASK market offer as a buyer
     * @param offer Market Offer (ASK)
     * @param signature Signature of the offer
     * @return netAmount The net amount given to the maker after fees
     */
    function buy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) public virtual requireAsk(offer.side) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);

        netAmount = _transferFees(
            offer.terms.currency, 
            msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        _transferCurrency(
            offer.terms.currency, 
            msg.sender, 
            offer.maker, 
            netAmount
        );

        _transferToken(
            offer.collateral.collection, 
            offer.maker, 
            msg.sender, 
            offer.collateral.identifier
        );
    }

    // /**
    //  * @notice Takes an ASK market offer as a buyer with a permit
    //  * @param offer Market Offer (ASK)
    //  * @param permit Permit for the buyer (taker)
    //  * @param signature Signature of the offer
    //  * @param permitSignature Signature of the permit
    //  * @return netAmount The net amount given to the maker after fees
    //  */
    // function buyWithPermit(
    //     MarketOffer calldata offer,
    //     Permit calldata permit,
    //     bytes calldata signature,
    //     bytes calldata permitSignature
    // ) public virtual requireAsk(offer.side) returns (uint256 netAmount) {

    //     bytes32 offerHash = _takeMarketOffer(offer, signature);
    //     _verifyPermit(permit, offerHash, permitSignature);

    //     netAmount = _transferFees(
    //         offer.terms.currency, 
    //         permit.taker, 
    //         offer.fee.recipient, 
    //         offer.terms.amount, 
    //         offer.fee.rate
    //     );

    //     _transferCurrency(
    //         offer.terms.currency, 
    //         permit.taker, 
    //         offer.maker, 
    //         netAmount
    //     );

    //     _transferToken(
    //         offer.collateral.collection, 
    //         offer.maker, 
    //         permit.taker, 
    //         offer.collateral.identifier
    //     );
    // }

    function sell(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public virtual requireNakedBid(offer.side, offer.terms.withLoan) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);
        
        CollateralVerifier._verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId,
            proof
        );

        netAmount = _transferFees(
            offer.terms.currency, 
            offer.maker, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        _transferCurrency(
            offer.terms.currency, 
            offer.maker, 
            msg.sender, 
            netAmount
        );

        _transferToken(
            offer.collateral.collection, 
            msg.sender,
            offer.maker, 
            tokenId
        );
    }

    function lend(
        LoanOffer calldata offer,
        bytes calldata signature
    ) public virtual requireAsk(offer.side) returns (uint256 lienId) {

        _takeLoanOffer(offer, 0, signature);

        _transferCurrency(
            offer.terms.currency,
            msg.sender,
            offer.maker,
            offer.terms.amount
        );

        _transferToken(
            offer.collateral.collection,
            offer.maker,
            address(this),
            offer.collateral.identifier
        );

        lienId = _openLien(
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

    // function lendWithPermit(
    //     LoanOffer calldata offer,
    //     Permit calldata permit,
    //     bytes calldata signature,
    //     bytes calldata permitSignature
    // ) public virtual requireAsk(offer.side) returns (uint256 lienId) {

    //     bytes32 offerHash = _takeLoanOffer(offer, 0, signature);
    //     _verifyPermit(permit, offerHash, permitSignature);

    //     _transferCurrency(
    //         offer.terms.currency,
    //         permit.taker,
    //         offer.maker,
    //         offer.terms.amount
    //     );

    //     _transferToken(
    //         offer.collateral.collection,
    //         offer.maker,
    //         address(this),
    //         offer.collateral.identifier
    //     );

    //     lienId = _openLien(
    //         permit.taker, 
    //         offer.maker, 
    //         offer.collateral.collection, 
    //         offer.collateral.identifier,
    //         offer.terms.currency, 
    //         offer.terms.amount, 
    //         offer.terms.rate, 
    //         offer.terms.defaultRate, 
    //         offer.terms.duration, 
    //         offer.terms.gracePeriod, 
    //         offer.fee.recipient, 
    //         offer.fee.rate
    //     );
    // }

    function borrow(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public virtual requireBid(offer.side) returns (uint256 lienId) {

        _takeLoanOffer(offer, amount, signature);
        
        CollateralVerifier._verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId, 
            proof
        );

        _transferCurrency(
            offer.terms.currency,
            offer.maker,
            msg.sender,
            amount
        );

        _transferToken(
            offer.collateral.collection,
            msg.sender,
            address(this),
            tokenId
        );

        lienId = _openLien(
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

    function refinance(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public virtual requireBid(offer.side) lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256 newLienId) {

        _takeLoanOffer(offer, amount, signature);

        CollateralVerifier._verifyCollateral(
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
            offer.maker, 
            lien.borrower
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

    function repay(
        uint256 lienId,
        Lien calldata lien
    ) public virtual lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256) {

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        _transferCurrency(
            lien.currency,
            msg.sender,
            _currentLender(lienId), 
            lien.principal + interest
        );

        _transferCurrency(
            lien.currency,
            msg.sender,
            lien.recipient,
            fee
        );

        _transferToken(
            lien.collection, 
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
    ) public virtual lienIsValid(lienId, lien) {
        if (!_lienIsDefaulted(lien)) {
            revert("LienIsCurrent");
        }

        _transferToken(
            lien.collection, 
            address(this), 
            _currentLender(lienId), 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function buyInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature
    ) public virtual requireAsk(offer.side) lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256 netAmount) {
            
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

        _transferToken(
            lien.collection, 
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
        public 
        virtual 
        requireNakedBid(offer.side, offer.terms.withLoan) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 netAmount) 
    {

        _takeMarketOffer(offer, signature);

        CollateralVerifier._verifyCollateral(
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

        _transferToken(
            lien.collection, 
            address(this), 
            offer.maker, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    // function escrowBuy(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) public virtual returns (uint256) {}

    // function escrowSell(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) public virtual returns (uint256) {}

    // function buyWithLoan(
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) public virtual returns (uint256) {}
    
    // function buyInLienWithLoan(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) public virtual returns (uint256) {}

    function _transferFees(
        address currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = amount * fee / 10_000;
        if (feeAmount > amount) {
            revert("InvalidMarketOfferAmount");
        }

        _transferCurrency(currency, payer, recipient, feeAmount);
        netAmount = amount - feeAmount;
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

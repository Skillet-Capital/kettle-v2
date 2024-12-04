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

import "./interfaces/IKettle.sol";
import "./OfferController.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Kettle is IKettle, Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, OfferController, ERC721Holder {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    uint256 public lockTime;

    address public tokenSupplier;
    address public redemptionAdmin;
    address public redemptionWallet;
    address public redemptionFeeCollector;

    uint256 private escrowIndex;
    mapping(uint256 => bytes32) public escrows;
    mapping(uint256 => bool) public escrowedTokens;

    mapping(address => bool) public whitelistedAskMakers;
    mapping(address => bool) public whitelistedBidTakers;

    uint256[50] private _gap;

    function __Kettle_init(address owner) external initializer {
        __Ownable_init(owner);
        __OfferController_init();

        lockTime = 30 days;
    }

    function whitelistAskMaker(address user, bool whitelisted) external onlyOwner() {
        whitelistedAskMakers[user] = whitelisted;
    }

    function whitelistBidTaker(address user, bool whitelisted) external onlyOwner() {
        whitelistedBidTakers[user] = whitelisted;
    }

    function setTokenSupplier(address _tokenSupplier) external onlyOwner {
        tokenSupplier = _tokenSupplier;
    }

    function setRedemptionAdmin(address _redemptionAdmin) external onlyOwner {
        redemptionAdmin = _redemptionAdmin;
    }

    function setRedemptionWallet(address _redemptionWallet) external onlyOwner {
        redemptionWallet = _redemptionWallet;
    }

    function setRedemptionFeeCollector(address _redemptionFeeCollector) external onlyOwner {
        redemptionFeeCollector = _redemptionFeeCollector;
    }

    function setLockTime(uint256 time) external onlyOwner {
        lockTime = time;
    }

    // ==================================================
    //               MARKETPLACE FUNCTIONS
    // ==================================================

    function redeem(
        address redeemer,
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) external nonReentrant {
        address _redeemer = (redeemer == address(0)) ? msg.sender : redeemer;

        bytes32 redemptionHash = _verifyRedemptionCharge(
            redemptionAdmin, 
            _redeemer, 
            charge.tokenId, 
            charge.collection, 
            charge, 
            signature
        );

        _redeemCollateral(
            redemptionHash,
            _redeemer,
            charge.collection,
            charge.tokenId,
            _redeemer,
            charge.currency,
            charge.amount,
            msg.sender
        );
    }

    function fulfillBid(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireMarketOffer(offer.kind) nonReentrant {
        if (offer.side != Side.BID) revert SideMustBeBid();
        if (offer.soft) revert BidMustBeHard();

        _takeMarketOffer(
            tokenId,
            msg.sender,
            offer,
            signature,
            proof
        );

        offer.collateral.collection.safeTransferFrom(
            msg.sender,
            offer.maker,
            tokenId
        );

        _settlePayments(
            offer.maker,
            msg.sender,
            offer
        );
    }
    
    function fulfillAsk(
        uint256 tokenId,
        address taker,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireMarketOffer(offer.kind) nonReentrant {
        if (offer.side != Side.ASK) revert SideMustBeAsk();

        address _taker = (taker == address(0)) ? msg.sender : taker;
        _takeMarketOffer(tokenId, _taker, offer, signature, proof);

        if (offer.soft) {
            _escrowPayments(_taker, offer.maker, bytes32(0), 0, offer);
        } else {
            _settlePayments(msg.sender, offer.maker, offer);
            offer.collateral.collection.safeTransferFrom(
                offer.maker,
                _taker,
                tokenId
            );
        }
    }

    function fulfillAskWithRedemption(
        uint256 tokenId,
        address taker,
        MarketOffer calldata offer,
        RedemptionCharge calldata redemption,
        bytes calldata signature,
        bytes calldata redemptionSignature,
        bytes32[] calldata proof
    ) external requireMarketOffer(offer.kind) nonReentrant {
        if (offer.side != Side.ASK) revert SideMustBeAsk();
        if (redemption.currency != offer.terms.currency) revert RedemptionCurrencyMismatch();

        address _taker = (taker == address(0)) ? msg.sender : taker;
        _takeMarketOffer(tokenId, _taker, offer, signature, proof);

        bytes32 redemptionHash = _verifyRedemptionCharge(
            redemptionAdmin,
            _taker,
            tokenId,
            offer.collateral.collection,
            redemption,
            redemptionSignature
        );

        if (offer.soft) {
            _escrowPayments(
                _taker,
                offer.maker,
                redemptionHash,
                redemption.amount,
                offer
            );

        } else {
            _settlePayments(
                msg.sender,     // msg.sender always funds the purchase
                offer.maker,    // maker always receives payment
                offer
            );

            _redeemCollateral(
                redemptionHash,
                _taker,
                offer.collateral.collection,
                tokenId,
                offer.maker,
                redemption.currency,
                redemption.amount,
                msg.sender
            );
        }
    }

    // ==================================================
    //               INTERNAL METHODS
    // ==================================================

    function _settlePayments(
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

    function _escrowPayments(
        address buyer,
        address seller,
        bytes32 redemptionHash,
        uint256 redemptionCharge,
        MarketOffer calldata offer
    ) internal {
        // if (offer.side == Side.BID && !whitelistedBidTakers[seller]) {
        //     revert SellerCannotEscrowBid();
        // }
        
        if (offer.side == Side.ASK && !whitelistedAskMakers[seller]) {
            revert SellerCannotEscrowAsk();
        }

        if (escrowedTokens[offer.collateral.identifier]) {
            revert TokenAlreadyEscrowed();
        }

        uint256 rebate;
        if (offer.terms.rebate > 0) {
            rebate = _calculateFee(offer.terms.amount, offer.terms.rebate);

            offer.terms.currency.safeTransferFrom(
                seller,
                address(this),
                rebate
            );
        }

        if (redemptionCharge > 0) {
            offer.terms.currency.safeTransferFrom(
                msg.sender,
                address(this),
                redemptionCharge
            );
        }

        offer.terms.currency.safeTransferFrom(
            msg.sender,
            address(this),
            offer.terms.amount
        );

        Escrow memory escrow = Escrow({
            side: offer.side,
            buyer: buyer,
            seller: seller,
            collection: offer.collateral.collection,
            placeholder: offer.collateral.identifier,
            currency: offer.terms.currency,
            amount: offer.terms.amount,
            rebate: rebate,
            recipient: offer.fee.recipient,
            fee: offer.fee.rate,
            redemptionHash: redemptionHash,
            redemptionCharge: redemptionCharge,
            timestamp: block.timestamp,
            lockTime: lockTime
        });

        uint256 _escrowIndex = escrowIndex++;

        escrows[_escrowIndex] = _hashEscrow(escrow);
        escrowedTokens[offer.collateral.identifier] = true;

        emit EscrowOpened({
            escrowId: _escrowIndex,
            escrow: escrow
        });
    }

    function _redeemCollateral(
        bytes32 redemptionHash,
        address redeemer,
        IERC721 collection,
        uint256 tokenId,
        address tokenSource,
        IERC20 currency,
        uint256 charge,
        address paymentSource
    ) internal {
        collection.safeTransferFrom(
            tokenSource,
            redemptionWallet,
            tokenId
        );

        _processCurrencyTransfer(
            currency,
            paymentSource,
            redemptionFeeCollector,
            charge
        );

        emit Redemption({
            redemptionHash: redemptionHash,
            redeemer: redeemer,
            collection: collection,
            tokenId: tokenId,
            currency: currency,
            amount: charge
        });
    }

    // ==================================================
    //                ESCROW FUNCTIONS
    // ==================================================

    function settleEscrow(
        uint256 tokenId,
        uint256 escrowId, 
        Escrow calldata escrow
    ) external validEscrow(escrowId, escrow) nonReentrant onlyOwner {
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

        if (escrow.redemptionHash != bytes32(0)) {
            _redeemCollateral(
                escrow.redemptionHash,
                escrow.buyer,
                escrow.collection,
                tokenId,
                tokenSupplier,
                escrow.currency,
                escrow.redemptionCharge,
                address(this)
            );
        } else {
            escrow.collection.safeTransferFrom(
                tokenSupplier,
                escrow.buyer,
                tokenId
            );
        }

        delete escrows[escrowId];

        emit EscrowSettled({
            escrowId: escrowId,
            tokenId: tokenId
        });
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external validEscrow(escrowId, escrow) nonReentrant {
        if (block.timestamp < escrow.timestamp + escrow.lockTime) {
            revert EscrowLocked();
        }

        escrow.currency.transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );
        
        // if redemption charge, return charge to buyer
        if (escrow.redemptionHash != bytes32(0)) {
            escrow.currency.transfer(
                escrow.buyer,
                escrow.redemptionCharge
            );
        }

        delete escrows[escrowId];

        emit EscrowClaimed({
            escrowId: escrowId
        });
    }

    function rejectEscrow(
        bool returnRebate,
        uint256 escrowId, 
        Escrow calldata escrow
    ) external validEscrow(escrowId, escrow) nonReentrant onlyOwner {
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
                escrow.amount + escrow.rebate + escrow.redemptionCharge
            );
        }

        delete escrows[escrowId];

        emit EscrowRejected({
            escrowId: escrowId,
            rebateReturned: returnRebate
        });
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

        _processCurrencyTransfer(
            currency,
            payer,
            recipient,
            feeAmount
        );

        netAmount = amount - feeAmount;
    }

    function _calculateFee(
        uint256 amount,
        uint256 rate
    ) internal pure returns (uint256 fee) {
        fee = Math.mulDiv(amount, rate, _BASIS_POINTS);
        if (fee >= amount) {
            revert InvalidFee();
        }
    }

    function _processCurrencyTransfer(
        IERC20 currency,
        address from,
        address to,
        uint256 amount
    ) internal {
        if (from == address(this)) {
            currency.transfer(
                to,
                amount
            );
        } else {
            currency.safeTransferFrom(
                from,
                to,
                amount
            );
        }
    }

    function _hashEscrow(
        Escrow memory escrow
    ) internal pure returns (bytes32 _hash) {
        _hash = keccak256(abi.encode(escrow));
    }

    // ==================================================
    //                    MODIFIERS
    // ==================================================

    modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
        if (!(escrows[escrowId] == _hashEscrow(escrow))) {
            revert InvalidEscrow();
        }
        _;
    }

    modifier requireMarketOffer(OfferKind kind) {
        if (kind != OfferKind.MARKET) {
            revert InvalidMarketOffer();
        }
        _;
    }
}

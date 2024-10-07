// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { IEscrowController } from "./interfaces/IEscrowController.sol";
import { IKettleAssetFactory } from "./interfaces/IKettleAssetFactory.sol";
import { IKettleAsset } from "./interfaces/IKettleAsset.sol";

import { MarketOffer, Escrow, Side } from "./Structs.sol";

import { InvalidEscrow, EscrowLocked, SellerNotAskWhitelisted, SellerNotBidWhitelisted, OnlyKettle, InvalidAssetFactory } from "./Errors.sol";

contract EscrowController is IEscrowController, Initializable, Ownable2StepUpgradeable {
    using SafeERC20 for IERC20;

    uint256 private constant _BASIS_POINTS = 10_000;

    address public kettle;
    uint256 public escrowIndex;
    uint256 public lockTime;
    bool public whitelistOnly;

    mapping(uint256 => bytes32) public escrows;

    mapping(uint256 => bool) public escrowedTokens;
    mapping(address => bool) public whitelistedAskMakers;
    mapping(address => bool) public whitelistedBidTakers;

    function __EscrowController_init(address owner) public initializer {
        __Ownable2Step_init();
        _transferOwnership(owner);

        escrowIndex = 1;
        lockTime = 14 days;
        whitelistOnly = true;
    }

    function setKettle(address _kettle) external onlyOwner() {
        kettle = _kettle;
    }

    // ===============================
    //             SETTERS
    // ===============================

    function setLockTime(uint256 time) external onlyOwner {
        lockTime = time;
    }

    function setWhitelistOnly(bool _whitelistOnly) external onlyOwner {
        whitelistOnly = _whitelistOnly;
    }

    function whitelistedAskMaker(address user, bool whitelisted) external onlyOwner {
        whitelistedAskMakers[user] = whitelisted;
    }

    function whitelistBidTaker(address user, bool whitelisted) external onlyOwner {
        whitelistedBidTakers[user] = whitelisted;
    }

    // ===============================
    //             EXTERNAL
    // ===============================

    function settleEscrow(
        uint256 escrowId, 
        uint256 tokenId, 
        Escrow calldata escrow,
        address assetFactory
    ) external onlyOwner validEscrow(escrowId, escrow) {

        if (address(assetFactory).code.length == 0) {
            revert InvalidAssetFactory();
        }

        if (IKettleAssetFactory(assetFactory).isKettleAsset(address(escrow.collection))) {
            IKettleAssetFactory(assetFactory).mint(address(escrow.collection), escrow.buyer, tokenId);
        } else {
            IKettleAsset(address(escrow.collection)).mint(escrow.buyer, tokenId);
        }

        uint256 netAmount = escrow.amount;
        if (escrow.fee > 0) {
            uint256 fee = Math.mulDiv(escrow.amount, escrow.fee, _BASIS_POINTS);
            netAmount -= fee;

            escrow.currency.transfer(
                escrow.recipient,
                fee
            );
        }

        escrow.currency.transfer(
            escrow.seller, 
            netAmount + escrow.rebate
        );

        delete escrows[escrowId];

        emit EscrowSettled({ escrowId: escrowId, tokenId: tokenId });
    }

    function rejectEscrow(
        bool returnRebate,
        uint256 escrowId, 
        Escrow calldata escrow
    ) external onlyOwner validEscrow(escrowId, escrow) {

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

        delete escrows[escrowId];

        emit EscrowRejected({ escrowId: escrowId, rebateReturned: returnRebate });
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external validEscrow(escrowId, escrow) escrowUnlocked(escrow) {

        IERC20(escrow.currency).transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );

        delete escrows[escrowId];

        emit EscrowClaimed({ escrowId: escrowId });
    }

    function setEscrowedToken(uint256 tokenId, bool escrowed) external onlyOwner {
        escrowedTokens[tokenId] = escrowed;
    }

    // ===============================
    //        ACCESS CONTROL
    // ===============================

    function openEscrow(
        uint256 placeholder,
        uint256 rebate,
        address buyer,
        address seller,
        MarketOffer calldata offer
    ) external onlyKettle returns (uint256 escrowId) {
        if (whitelistOnly) {
            if (offer.side == Side.ASK && !whitelistedAskMakers[seller]) revert SellerNotAskWhitelisted();
            if (offer.side == Side.BID && !whitelistedBidTakers[buyer]) revert SellerNotBidWhitelisted();
        }

        Escrow memory escrow = Escrow({
            side: offer.side,
            placeholder: placeholder,
            buyer: buyer,
            seller: seller,
            collection: offer.collateral.collection,
            identifier: offer.collateral.identifier,
            currency: offer.terms.currency,
            amount: offer.terms.amount,
            recipient: offer.fee.recipient,
            fee: offer.fee.rate,
            rebate: rebate,
            timestamp: block.timestamp,
            lockTime: lockTime
        });

        unchecked {
            escrowId = escrowIndex++;
        }

        escrows[escrowIndex] = _hashEscrow(escrow);
        escrowedTokens[placeholder] = true;

        emit EscrowOpened({
            escrowId: escrowIndex++,
            escrow: escrow
        });
    }

    // ===============================
    //             HELPERS
    // ===============================

    function hashEscrow(Escrow memory escrow) external pure returns (bytes32 _hash) {
        _hash = _hashEscrow(escrow);
    }

    function _hashEscrow(Escrow memory escrow) internal pure returns (bytes32 _hash) {
        _hash = keccak256(abi.encode(escrow));
    }

    // ===============================
    //             MODIFIERS
    // ===============================

    modifier onlyKettle() {
        if (msg.sender != kettle) {
            revert OnlyKettle();
        }
        _;
    }

    modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
        if (!(escrows[escrowId] == _hashEscrow(escrow))) revert InvalidEscrow();
        _;
    }

    modifier escrowUnlocked(Escrow memory escrow) {
        if(escrow.timestamp + escrow.lockTime > block.timestamp) revert EscrowLocked();
        _;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { KettleMath } from "./lib/KettleMath.sol";

import { IEscrowController } from "./interfaces/IEscrowController.sol";
import { IKettleAssetFactory } from "./interfaces/IKettleAssetFactory.sol";
import { IKettleAsset } from "./interfaces/IKettleAsset.sol";

import { InvalidEscrow, EscrowLocked, SellerNotWhitelisted } from "./Errors.sol";

import { Escrow, Side } from "./Structs.sol";

contract EscrowController is IEscrowController, Initializable, Ownable2StepUpgradeable {
    using SafeERC20 for IERC20;

    uint256 public escrowIndex;
    uint256 public lockTime;
    bool public whitelistOnly;

    mapping(uint256 => bytes32) public escrows;
    mapping(address => bool) public whitelistedAskMakers;
    mapping(address => bool) public whitelistedBidTakers;

    function __EscrowController_init() public initializer {
        escrowIndex = 0;
        lockTime = 14 days;
        whitelistOnly = false;
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
    //             ESCROW
    // ===============================

    function settleEscrow(
        uint256 escrowId, 
        uint256 tokenId, 
        Escrow calldata escrow,
        address assetFactory
    ) external onlyOwner validEscrow(escrowId, escrow) {

        if (address(assetFactory).code.length > 0 && IKettleAssetFactory(assetFactory).isKettleAsset(escrow.collection)) {
            IKettleAssetFactory(assetFactory).mint(escrow.collection, escrow.buyer, tokenId);
        } else {
            IKettleAsset(escrow.collection).mint(escrow.buyer, tokenId);
        }

        uint256 netAmount = escrow.amount;
        if (escrow.fee > 0) {
            uint256 fee = KettleMath.safeMulFee(escrow.amount, escrow.fee);
            netAmount -= fee;

            IERC20(escrow.currency).transfer(
                escrow.recipient, 
                fee
            );
        }

        IERC20(escrow.currency).transfer(
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
            IERC20(escrow.currency).transfer(
                escrow.seller,
                escrow.rebate
            );

            IERC20(escrow.currency).transfer(
                escrow.buyer,
                escrow.amount
            );
        } else {
            IERC20(escrow.currency).transfer(
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

    // ===============================
    //             INTERNAL
    // ===============================

    function _openEscrow(
        Side side,
        uint256 placeholder,
        address buyer,
        address seller,
        address collection,
        uint256 identifier,
        address currency,
        uint256 amount,
        address recipient,
        uint256 fee,
        uint256 rebate
    ) internal returns (uint256 escrowId) {
        if (whitelistOnly) {
            if (side == Side.ASK && !whitelistedAskMakers[seller]) revert SellerNotWhitelisted();
            if (side == Side.BID && !whitelistedBidTakers[buyer]) revert SellerNotWhitelisted();
        }

        Escrow memory escrow = Escrow({
            side: side,
            placeholder: placeholder,
            buyer: buyer,
            seller: seller,
            collection: collection,
            identifier: identifier,
            currency: currency,
            amount: amount,
            recipient: recipient,
            fee: fee,
            rebate: rebate,
            timestamp: block.timestamp,
            lockTime: lockTime
        });

        unchecked {
            escrowId = escrowIndex++;
        }

        escrows[escrowIndex] = _hashEscrow(escrow);

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

    modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
        if (!(escrows[escrowId] == _hashEscrow(escrow))) revert InvalidEscrow();
        _;
    }

    modifier escrowUnlocked(Escrow memory escrow) {
        if(escrow.timestamp + escrow.lockTime > block.timestamp) revert EscrowLocked();
        _;
    }
}

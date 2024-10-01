// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { IEscrowController } from "./interfaces/IEscrowController.sol";
import { IKettleAssetFactory } from "./interfaces/IKettleAssetFactory.sol";
import { IKettleAsset } from "./interfaces/IKettleAsset.sol";

import { Escrow } from "./Structs.sol";

contract EscrowController is IEscrowController, Initializable, Ownable2StepUpgradeable {
    uint256 public escrowIndex;
    uint256 public lockTime;
    bool public whitelistOnly;

    mapping(address => bool) public whitelist;
    mapping(uint256 => bytes32) public escrows;

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

    function setWhitelistSeller(address seller, bool whitelisted) external onlyOwner {
        whitelist[seller] = whitelisted;
        emit SellerWhitelisted(seller, whitelisted);
    }

    // ===============================
    //             ESCROW
    // ===============================

    function _openEscrow(
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
        if (whitelistOnly && !whitelist[seller]) {
            revert("SellerNotWhitelisted");
        }

        Escrow memory escrow = Escrow({
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

        // calculate the net amount received
        uint256 netAmount = escrow.amount;
        if (escrow.fee > 0) {
            uint256 fee = Math.mulDiv(escrow.amount, escrow.fee, 10_000);
            netAmount -= fee;

            // transfer fee to the fee recipient
            IERC20(escrow.currency).transfer(escrow.recipient, fee);
        }

        // transfer amount and rebate to the seller
        IERC20(escrow.currency).transfer(escrow.seller, netAmount + escrow.rebate);

        // delete the escrow
        delete escrows[escrowId];

        emit EscrowSettled({ escrowId: escrowId, tokenId: tokenId });
    }

    function rejectEscrow(
        uint256 escrowId, 
        Escrow calldata escrow
    ) external onlyOwner validEscrow(escrowId, escrow) {

        // transfer amount and rebate to the buyer
        IERC20(escrow.currency).transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );

        // delete the escrow
        delete escrows[escrowId];

        emit EscrowRejected({ escrowId: escrowId, rebateReturned: false });
    }

    function rejectEscrowReturnRebate(
        uint256 escrowId,
        Escrow calldata escrow
    ) external onlyOwner validEscrow(escrowId, escrow) {

        // transfer amount back to the buyer
        IERC20(escrow.currency).transfer(
            escrow.buyer,
            escrow.amount
        );

        IERC20(escrow.currency).transfer(
            escrow.seller,
            escrow.rebate
        );

        // delete the escrow
        delete escrows[escrowId];

        emit EscrowRejected({ escrowId: escrowId, rebateReturned: true });
    }

    function claimEscrow(
        uint256 escrowId,
        Escrow calldata escrow
    ) external validEscrow(escrowId, escrow) escrowUnlocked(escrow) {

        // transfer amount and rebate to the buyer
        IERC20(escrow.currency).transfer(
            escrow.buyer,
            escrow.amount + escrow.rebate
        );

        // delete the escrow
        delete escrows[escrowId];

        emit EscrowClaimed({ escrowId: escrowId });
    }

    // ===============================
    //             HELPERS
    // ===============================

    function _calculateRebate(
        uint256 amount,
        uint256 rebate
    ) internal pure returns (uint256){
        return Math.mulDiv(amount, rebate, 10_000);
    }

    function _hashEscrow(Escrow memory escrow) internal pure returns (bytes32 _hash) {
        _hash = keccak256(
            abi.encodePacked(
                escrow.placeholder,
                escrow.identifier,
                escrow.buyer,
                escrow.seller,
                escrow.collection,
                escrow.currency,
                escrow.recipient,
                escrow.amount,
                escrow.fee,
                escrow.rebate,
                escrow.timestamp,
                escrow.lockTime
            )
        );
    }

    // ===============================
    //             MODIFIERS
    // ===============================

    modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
        if (!(escrows[escrowId] == _hashEscrow(escrow))) revert("InvalidEscrow");
        _;
    }

    modifier escrowUnlocked(Escrow memory escrow) {
        if(escrow.timestamp + escrow.lockTime > block.timestamp) revert("EscrowLocked");
        _;
    }
}

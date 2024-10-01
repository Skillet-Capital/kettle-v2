// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Escrow } from "../Structs.sol";

interface IEscrowController {

    event SellerWhitelisted(
        address indexed maker,
        bool indexed whitelisted
    );

    event EscrowOpened(
        uint256 indexed escrowId,
        Escrow escrow
    );

    event EscrowSettled(
        uint256 indexed escrowId,
        uint256 indexed tokenId
    );

    event EscrowRejected(
        uint256 indexed escrowId,
        bool indexed rebateReturned
    );

    event EscrowClaimed(
        uint256 indexed escrowId
    );

    // // Setters
    // function setLockTime(uint256 time) external;
    // function setWhitelistOnly(bool _whitelistOnly) external;
    // function setWhitelistMaker(address maker, bool whitelisted) external;

    // // Escrow Management
    // function takeListing(Listing calldata listing, bytes calldata signature) external;
    // function settleEscrow(uint256 escrowId, uint256 tokenId, Escrow calldata escrow) external;
    // function rejectEscrow(uint256 escrowId, Escrow calldata escrow) external;
    // function rejectEscrowReturnRebate(uint256 escrowId, Escrow calldata escrow) external;
    // function claimEscrow(uint256 escrowId, Escrow calldata escrow) external;

    // // Getters
    // function hashEscrow(Escrow calldata escrow) external view returns (bytes32 _hash);
}

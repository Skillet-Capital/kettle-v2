// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IEscrowController {

    function TOKEN_SUPPLIER() external view returns (address);

    function openEscrow(
        uint256 placeholder,
        uint256 rebate,
        bool withRedemption,
        bytes32 redemptionHash,
        uint256 redemptionCharge,
        address buyer,
        address seller,
        MarketOffer calldata offer
    ) external returns (uint256);

    function settleEscrow(uint256 escrowId, Escrow calldata escrow, uint256 tokenId) external;
    function claimEscrow(uint256 escrowId, Escrow calldata escrow) external;
    function rejectEscrow(uint256 escrowId, Escrow calldata escrow, bool returnRebate) external;

    event EscrowOpened(uint256 indexed escrowId, Escrow escrow);
    event EscrowSettled(uint256 indexed escrowId, uint256 indexed tokenId);
    event EscrowClaimed(uint256 indexed escrowId);
    event EscrowRejected(uint256 indexed escrowId, bool indexed rebateReturned);

    event AskMakerWhitelisted(address indexed maker, bool indexed whitelisted);
    event BidTakerWhitelisted(address indexed taker, bool indexed whitelisted);
    event PlaceholderEscrowed(uint256 indexed placeholder, bool indexed escrowed);
}

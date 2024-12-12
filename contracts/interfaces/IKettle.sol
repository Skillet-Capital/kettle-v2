// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IKettle {

    event AskMakerWhitelisted(address indexed maker, bool indexed whitelisted);
    event BidTakerWhitelisted(address indexed taker, bool indexed whitelisted);
    
    event TokenSupplierUpdated(address indexed supplier);
    event RedemptionAdminUpdated(address indexed admin);
    event RedemptionWalletUpdated(address indexed wallet);
    event RedemptionFeeCollectorUpdated(address indexed collector);
    event EscrowLockTimeUpdated(uint256 indexed lockTime);
    event EscrowSettlerUpdated(address indexed settler);
    
    event EscrowOpened(uint256 indexed escrowId, Escrow escrow);
    event EscrowSettled(uint256 indexed escrowId, uint256 indexed tokenId);
    event EscrowClaimed(uint256 indexed escrowId);
    event EscrowRejected(uint256 indexed escrowId, bool indexed rebateReturned);

    event Redemption(
        bytes32 indexed redemptionHash,
        address indexed redeemer,
        IERC721 collection,
        uint256 tokenId,
        IERC20 currency,
        uint256 amount
    );
}

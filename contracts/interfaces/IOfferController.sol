// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOfferController {

    event OfferCancelled(
        address indexed operator,
        address indexed user,
        uint256 indexed salt
    );

    event NonceIncremented(
        address indexed user,
        uint256 indexed nonce
    );

    function incrementNonce() external;
    function cancelOffers(uint256[] calldata salts) external;
    function cancelOffersForUser(address user, uint256[] calldata salts) external;
}

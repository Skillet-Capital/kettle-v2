// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IOfferController {

    function incrementNonce() external;
    function cancelOffers(uint256[] calldata salts) external;
    function cancelOffersForUser(address user, uint256[] calldata salts) external;

    event OfferCancelled(
        address indexed operator,
        address indexed user,
        uint256 indexed salt
    );

    event NonceIncremented(
        address indexed user,
        uint256 indexed nonce
    );

    event MarketOfferTaken(
        uint256 tokenId,
        address taker,
        MarketOffer offer
    );

    event LoanOfferTaken(
        uint256 tokenId,
        address taker,
        LoanOffer offer
    );
}

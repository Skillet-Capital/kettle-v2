// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { OfferController } from "../OfferController.sol";
import { LoanOffer, MarketOffer } from "../Structs.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TestOfferController is Initializable, OwnableUpgradeable, OfferController {

    function initialize(address _offerManager) public initializer {
        __OfferController_init(_offerManager);
        __Signatures_init();

        __Ownable_init(msg.sender);
        // _transferOwnership(msg.sender);
    }

    function takeMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public returns (bytes32) {
        return _takeMarketOffer(false, tokenId, msg.sender, offer, signature, proof);
    }  
}

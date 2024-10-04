// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { OfferController } from "../OfferController.sol";
import { LoanOffer, MarketOffer } from "../Structs.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

contract TestOfferController is Initializable, Ownable2StepUpgradeable, OfferController {

    function initialize() public initializer {
        __OfferController_init();
        __Signatures_init();

        __Ownable2Step_init();
        _transferOwnership(msg.sender);
    }

    function takeLoanOffer(
        uint256 tokenId,
        LoanOffer calldata offer,
        uint256 amount,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public returns (bytes32) {
        return _takeLoanOffer(tokenId, amount, offer, signature, proof);
    }

    function takeMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) public returns (bytes32) {
        return _takeMarketOffer(tokenId, offer, signature, proof);
    }  
}

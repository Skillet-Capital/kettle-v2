//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import { OfferController } from "../OfferController.sol";
import { LoanOffer, MarketOffer } from "../Structs.sol";

contract TestOfferController is OfferController {

    constructor() {
        __OfferController_init(msg.sender);
        __Signatures_init();
    }

    function takeLoanOffer(
        LoanOffer calldata offer,
        uint256 amount,
        bytes calldata signature
    ) public returns (bytes32) {
        return _takeLoanOffer(offer, amount, signature);
    }

    function takeMarketOffer(
        MarketOffer calldata offer,
        bytes calldata signature
    ) public returns (bytes32) {
        return _takeMarketOffer(offer, signature);
    }  
}

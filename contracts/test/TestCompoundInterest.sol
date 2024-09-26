// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { CompoundInterest } from "../lib/CompoundInterest.sol";

contract TestCompoundInterest {

    function computeDebt(
      uint256 timestamp,
      uint256 principal,
      uint256 startTime,
      uint256 duration,
      uint256 feeRate,
      uint256 rate,
      uint256 defaultRate
    ) public pure returns (uint256 debt, uint256 fee, uint256 interest) {
        (debt, fee, interest) = CompoundInterest.currentDebtAmount(
            timestamp,
            principal,
            startTime,
            duration,
            feeRate,
            rate,
            defaultRate
        );
    }
}

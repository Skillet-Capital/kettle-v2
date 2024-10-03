// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

library KettleMath {
    uint256 private constant _BASIS_POINTS = 10_000;

    function safeMulFee(uint256 gross, uint256 fee) external pure returns (uint256 net) {
        net = Math.mulDiv(gross, fee, _BASIS_POINTS);
    }
}

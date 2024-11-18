// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IRedemptionManager {
  event Redemption(
    address indexed redeemer,
    address indexed redemptionWallet,
    RedemptionCharge charge
  );
}

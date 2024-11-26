// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IRedemptionController {
  function admin() external view returns (address);
  function redemptionWallet() external view returns (address);
}

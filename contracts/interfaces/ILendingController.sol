// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Lien } from "../Structs.sol";

interface ILendingController {

    event LienOpened(uint256 lienId, Lien lien);
    event LienClosed(uint256 lienId);
}

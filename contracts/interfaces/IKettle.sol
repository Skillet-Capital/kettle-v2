// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IKettle {
    
    event Refinance(
        uint256 indexed oldLienId,
        uint256 indexed newLienId
    );
}

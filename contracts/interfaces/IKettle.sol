// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface IKettle {
    
    event Refinance(
        uint256 indexed oldLienId,
        uint256 indexed newLienId
    );

    event Redemption(
        bytes32 indexed hash,
        address indexed redeemer,
        IERC721 collection,
        uint256 tokenId,
        IERC20 currency,
        uint256 amount
    );
}

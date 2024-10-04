// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITransferConduit {
    function transferERC20From(IERC20 token, address from, address to, uint256 amount) external;
    function transferERC721From(IERC721 token, address from ,address to, uint256 tokenId) external;
}

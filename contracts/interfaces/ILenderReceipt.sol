// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILenderReceipt {
    function ownerOf(uint256 tokenId) external view returns (address);
    function mint(address to, uint256 tokenId) external;
    function burn(uint256 tokenId) external;
}

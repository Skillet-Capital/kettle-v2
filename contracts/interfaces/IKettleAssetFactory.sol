// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IKettleAssetFactory {
    function mint(address asset, address to, uint256 tokenId) external;
    function isKettleAsset(address asset) external view returns (bool);
}

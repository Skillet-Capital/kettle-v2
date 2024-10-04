// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TransferConduit is Ownable2Step {
    using SafeERC20 for IERC20;

    error ChannelIsNotOpen(address channel);

    mapping(address => bool) private _channels;

    constructor() Ownable(msg.sender) {}

    function channelOpen(address channel) external view returns (bool) {
        return _channels[channel];
    }

    function updateChannel(address channel, bool open) external onlyOwner {
        _channels[channel] = open;
    }

    function transferERC20From(IERC20 token, address from, address to, uint256 amount) external onlyOpenChannel {
        require(_channels[msg.sender], "TransferConduit: channel not open");
        if (from == to || amount == 0) return;
        token.safeTransferFrom(from, to, amount);
    }

    function transferERC721From(IERC721 token, address from ,address to, uint256 tokenId) external onlyOpenChannel {
        if (from == to) return;
        token.safeTransferFrom(from, to, tokenId);
    }

    modifier onlyOpenChannel() {
        if (!_channels[msg.sender]) revert ChannelIsNotOpen(msg.sender);
        _;
    }
}

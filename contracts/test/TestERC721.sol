//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import { ERC721 } from "solmate/src/tokens/ERC721.sol";

// Used for minting test ERC721s in our tests
contract TestERC721 is ERC721("Test721", "TST721") {
    function mint(address to, uint256 tokenId) public returns (bool) {
        _mint(to, tokenId);
        return true;
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return "tokenURI";
    }

    function totalSupply() public pure returns (uint256) {
        return 1e4;
    }
}

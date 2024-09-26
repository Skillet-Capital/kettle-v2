//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import { ERC20 } from "solmate/src/tokens/ERC20.sol";

// Used for minting test ERC20s in our tests
contract TestERC20 is ERC20 {
    constructor(uint8 decimals) ERC20("Test20", "TST20", decimals) {}

    function mint(address to, uint256 amount) external returns (bool) {
        _mint(to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool ok) {
        super.transferFrom(from, to, amount);

        ok = true;
    }
}

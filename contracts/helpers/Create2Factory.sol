// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Create2Factory {
    function deploy(uint256 salt, bytes memory bytecode) public returns (address) {
        address addr;
        assembly {
            addr := create2(
                0, // no value
                add(bytecode, 0x20), // skip the length prefix
                mload(bytecode),     // size of the bytecode
                salt                // salt from function arguments
            )
            if iszero(extcodesize(addr)) { revert(0, 0) }
        }
        return addr;
    }

    function getAddress(uint256 salt, bytes memory bytecode) public view returns (address) {
        bytes32 _hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );

        return address(uint160(uint256(_hash)));
    }
}

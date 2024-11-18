// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "./Errors.sol";

contract KettleAccess is Ownable2StepUpgradeable {

    address public kettle;

    function setKettle(address _kettle) onlyOwner external {
        kettle = _kettle;
    }

    modifier onlyKettle() {
        if (msg.sender != kettle) {
            revert OnlyKettle();
        }
        _;
    }
}

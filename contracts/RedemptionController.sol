// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import "./interfaces/IRedemptionController.sol";
import "./Structs.sol";
import "./Errors.sol";

contract RedemptionController is 
    IRedemptionController, 
    Initializable, 
    Ownable2StepUpgradeable, 
    ReentrancyGuardUpgradeable
{
    address public admin;
    address public redemptionWallet;

    function __RedemptionController_init(
        address owner,
        address _admin, 
        address _redemptionWallet
    ) public initializer {
        __Ownable2Step_init();

        admin = _admin;
        redemptionWallet = _redemptionWallet;

        _transferOwnership(owner);
    }

    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
    }

    function setRedemptionWallet(address _redemptionWallet) external onlyOwner {
        redemptionWallet = _redemptionWallet;
    }
}

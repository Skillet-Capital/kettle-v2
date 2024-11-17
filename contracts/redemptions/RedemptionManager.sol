// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import "../interfaces/IRedemptionManager.sol";
// import "../KettleAccess.sol";
import "../Structs.sol";
import "../Errors.sol";

import "./Signatures.sol";

contract RedemptionManager is 
    IRedemptionManager, 
    Initializable, 
    Ownable2StepUpgradeable, 
    ReentrancyGuardUpgradeable, 
    Signatures
    // KettleAccess
    // IERC721Receiver
{
    address public admin;
    address public redemptionWallet;
    mapping(bytes32 => bool) public redeemed;

    function initialize(
        address owner,
        address _admin, 
        address _redemptionWallet
    ) public initializer {
        __Ownable2Step_init();
        __Signatures_init();

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

    function cancelRedemptions(bytes32[] calldata hashes) external onlyOwner {
        for (uint256 i = 0; i < hashes.length; i++) {
            redeemed[hashes[i]] = true;
        }
    }

    function cancelAllRedemptions() external onlyOwner {
        ++nonce;
    }

    function redeem(
        RedemptionCharge calldata charge, 
        bytes calldata signature
    ) external nonReentrant {
        _verifyRedemptionCharge(msg.sender, charge, signature);

        for (uint256 i = 0; i < charge.assets.length; i++) {
            Asset memory asset = charge.assets[i];
            asset.collection.safeTransferFrom(msg.sender, redemptionWallet, asset.tokenId);
        }

        charge.currency.transferFrom(msg.sender, redemptionWallet, charge.amount);

        emit Redemption(msg.sender, redemptionWallet, charge);
    }

    function _verifyRedemptionCharge(
        address redeemer,
        RedemptionCharge calldata charge, 
        bytes calldata signature
    ) internal {
        if (charge.admin != admin) revert InvalidAdmin();
        if (charge.redeemer != redeemer) revert InvalidTaker();

        bytes32 _hash = _hashRedemptionCharge(charge);
        _verifyRedemptionAuthorization(_hash, admin, signature);

        if (charge.expiration < block.timestamp) revert OfferExpired();
        if (redeemed[_hash]) revert OfferUnavailable();

        redeemed[_hash] = true;
    }

    // function _redeemWithPurchase(
    //     address redeemer,
    //     RedemptionCharge memory charge, 
    //     bytes memory signature
    // ) internal nonReentrant {
    //     _verifyRedemptionCharge(redeemer, charge, signature);

    //     for (uint256 i = 0; i < charge.assets.length; i++) {
    //         Asset memory asset = charge.assets[i];
    //         asset.collection.safeTransferFrom(address(this), redemptionWallet, asset.tokenId);
    //     }

    //     charge.currency.transferFrom(redeemer, redemptionWallet, charge.amount);

    //     emit Redemption(redeemer, redemptionWallet, charge);
    // }

    // function onERC721Received(
    //     address operator, 
    //     address from, 
    //     uint256 tokenId, 
    //     bytes calldata data
    // ) external override returns (bytes4) {
    //     if (operator != kettle) revert OnlyKettle();

    //     (
    //         address redeemer,
    //         RedemptionCharge memory charge, 
    //         bytes memory signature
    //     ) = abi.decode(data, (address, RedemptionCharge, bytes));

    //     // extract single asset
    //     Asset memory asset = charge.assets[0];

    //     if (address(asset.collection) != msg.sender) revert InvalidCollection();
    //     if (asset.tokenId != tokenId) revert InvalidToken();

    //     _redeemWithPurchase(redeemer, charge, signature);

    //     return IERC721Receiver.onERC721Received.selector;
    // }
}

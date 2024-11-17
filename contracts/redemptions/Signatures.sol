// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import { ERC6492DeployFailed, InvalidSignature, InvalidVParameter } from "../Errors.sol";
import { Asset, RedemptionCharge } from "../Structs.sol";

contract Signatures {
    bytes32 private constant _ERC6492_DETECTION_SUFFIX = 0x6492649264926492649264926492649264926492649264926492649264926492;

    bytes32 private _EIP_712_DOMAIN_TYPEHASH;
    
    bytes32 private _ASSET_TYPEHASH;
    bytes32 private _REDEMPTION_CHARGE_TYPEHASH;

    string private constant _NAME = "RedemptionManager";
    string private constant _VERSION = "1";

    uint256 public nonce;
    uint256[50] private _gap;

    function __Signatures_init() internal {
        nonce = 1;
        (
            _EIP_712_DOMAIN_TYPEHASH,
            _ASSET_TYPEHASH,
            _REDEMPTION_CHARGE_TYPEHASH
        ) = _createTypeHashes();
    }

    function hashRedemptionCharge(RedemptionCharge calldata charge) external view returns (bytes32) {
        return _hashRedemptionCharge(charge);
    }

    function _createTypeHashes()
        internal
        pure
        returns (
            bytes32 eip712DomainTypehash,
            bytes32 assetTypehash,
            bytes32 redemptionChargeTypehash
        ) 
    {
        eip712DomainTypehash = keccak256(
            bytes.concat(
                "EIP712Domain(",
                "string name,",
                "string version,",
                "uint256 chainId,",
                "address verifyingContract",
                ")"
            )
        );

        bytes memory assetTypestring = bytes.concat(
            "Asset(",
            "address collection,",
            "uint256 tokenId",
            ")"
        );

        assetTypehash = keccak256(assetTypestring);

        bytes memory redemptionChargeTypestring = bytes.concat(
            "RedemptionCharge(",
            "address admin,",
            "address redeemer,",
            "Asset[] assets,",
            "address currency,",
            "uint256 amount,",
            "uint256 expiration,",
            "uint256 salt,",
            "uint256 nonce",
            ")",
            assetTypestring
        );

        redemptionChargeTypehash = keccak256(redemptionChargeTypestring);
    }

    function _hashDomain(
        bytes32 eip712DomainTypehash,
        bytes32 nameHash,
        bytes32 versionHash
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    eip712DomainTypehash,
                    nameHash,
                    versionHash,
                    block.chainid,
                    address(this)
                )
            );
    }


    function _hashRedemptionCharge(
        RedemptionCharge calldata charge
    ) internal view returns (bytes32) {

        bytes32[] memory assetHashes = new bytes32[](charge.assets.length);

        for (uint256 i = 0; i < charge.assets.length; i++) {
            assetHashes[i] = keccak256(
                abi.encode(
                    _ASSET_TYPEHASH,
                    charge.assets[i].collection,
                    charge.assets[i].tokenId
                )
            );
        }

        bytes32 assetsArrayHash = keccak256(abi.encodePacked(assetHashes));

        return
            keccak256(
                abi.encode(
                    _REDEMPTION_CHARGE_TYPEHASH,
                    charge.admin,
                    charge.redeemer,
                    assetsArrayHash,
                    charge.currency,
                    charge.amount,
                    charge.expiration,
                    charge.salt,
                    nonce
                )
            );
    }

    function _hashToSign(bytes32 hash) internal view returns (bytes32) {
        bytes32 domain = _hashDomain(
            _EIP_712_DOMAIN_TYPEHASH,
            keccak256(bytes(_NAME)),
            keccak256(bytes(_VERSION))
        );

        return keccak256(abi.encodePacked(bytes2(0x1901), domain, hash));
    }

    function _verifyRedemptionAuthorization(
        bytes32 redemptionHash,
        address signer,
        bytes calldata signature
    ) internal {
        bytes32 r;
        bytes32 s;
        uint8 v;
        bytes memory sigToValidate;
        bytes32 hashToSign = _hashToSign(redemptionHash);

        // solhint-disable-next-line
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 0x20))
            v := shr(248, calldataload(add(signature.offset, 0x40)))
        }

        _verify(signer, hashToSign, v, r, s);
    }

    /**
     * @notice Verify signature of digest
     * @param signer Address of expected signer
     * @param digest Signature digest
     * @param v v parameter
     * @param r r parameter
     * @param s s parameter
     */
    function _verify(
        address signer,
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view {

        if (v != 27 && v != 28) {
            revert InvalidVParameter();
        }

        address recoveredSigner = ecrecover(digest, v, r, s);
        if (recoveredSigner == address(0) || signer != recoveredSigner) {
            revert InvalidSignature();
        }
    }
}

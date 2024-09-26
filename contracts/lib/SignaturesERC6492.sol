// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";

error InvalidSignature();
error InvalidVParameter();
error ERC6492DeployFailed(bytes err);

library SignaturesERC6492 {
    // solhint-disable-next-line max-line-length
    bytes32 private constant _ERC6492_DETECTION_SUFFIX = 0x6492649264926492649264926492649264926492649264926492649264926492;

    /**
     * @notice Verify authorization of offer
     * @param hashToSign Hash to sign
     * @param signer signer address
     * @param signature Packed offer signature
     */
    function verifyAuthorization(
        bytes32 hashToSign,
        address signer,
        bytes calldata signature
    ) internal {
        bytes32 r;
        bytes32 s;
        uint8 v;
        bytes memory sigToValidate;

        // The order here is strictly defined in https://eips.ethereum.org/EIPS/eip-6492
        // - ERC-6492 suffix check and verification first, while being permissive in case 
        //   the contract is already deployed; if the contract is deployed we will check 
        //   the sig against the deployed version, this allows 6492 signatures to still 
        //   be validated while taking into account potential key rotation
        // - ERC-1271 verification if there's contract code
        // - finally, ecrecover

        bool isCounterfactual = bytes32(signature[signature.length-32:signature.length]) == _ERC6492_DETECTION_SUFFIX;

        if (isCounterfactual) {
            address create2Factory;
            bytes memory factoryCalldata;

            // solhint-disable-next-line max-line-length
            (create2Factory, factoryCalldata, sigToValidate) = abi.decode(signature[0:signature.length-32], (address, bytes, bytes));

            // solhint-disable-next-line explicit-types
            uint contractCodeLen = address(signer).code.length;
            if (contractCodeLen == 0) {

                // solhint-disable-next-line avoid-low-level-calls
                (bool success, bytes memory err) = create2Factory.call(factoryCalldata);
                if (!success) {
                    revert ERC6492DeployFailed(err);
                }
            }
        } else {
            sigToValidate = signature;
        }

        if (address(signer).code.length > 0) {
            
            bytes4 magicValue = IERC1271(signer).isValidSignature(
                hashToSign,
                sigToValidate
            );

            if (magicValue != IERC1271(signer).isValidSignature.selector) {
                revert InvalidSignature();
            }

            return;
        }

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
    ) internal pure {

        if (v != 27 && v != 28) {
            revert InvalidVParameter();
        }

        address recoveredSigner = ecrecover(digest, v, r, s);
        if (recoveredSigner == address(0) || signer != recoveredSigner) {
            revert InvalidSignature();
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Lien, Side } from "./Structs.sol";
import { ILending } from "./interfaces/ILending.sol";
import { ILenderReceipt } from "./interfaces/ILenderReceipt.sol";

import { CompoundInterest } from "./lib/CompoundInterest.sol";
import { Distributions } from "./lib/Distributions.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Lending is ILending, Initializable {    
    ILenderReceipt public LENDER_RECEIPT;

    function __Lending_init__(address receipt) public initializer {
        LENDER_RECEIPT = ILenderReceipt(receipt);
    }

    uint256 public nextLienId;
    mapping(uint256 => bytes32) public liens;

    function _openLien(
        address lender,
        address borrower,
        address collection,
        uint256 tokenId,
        address currency,
        uint256 principal,
        uint256 rate,
        uint256 defaultRate,
        uint256 duration,
        uint256 gracePeriod,
        address recipient,
        uint256 fee
    ) internal returns (uint256 lienId) {

        Lien memory lien = Lien({
            borrower: borrower,
            collection: collection,
            tokenId: tokenId,
            currency: currency,
            principal: principal,
            rate: rate,
            defaultRate: defaultRate,
            duration: duration,
            gracePeriod: gracePeriod,
            recipient: recipient,
            fee: fee,
            startTime: block.timestamp
        });

        unchecked {
            lienId = nextLienId++;
        }

        liens[lienId] = _hashLien(lien);
        LENDER_RECEIPT.mint(lender, lienId);

        emit LienOpened(lienId, lien);
    }

    function _closeLien(uint256 lienId) internal {
        LENDER_RECEIPT.burn(lienId);
        delete liens[lienId];

        emit LienClosed(lienId);
    }

    function _transferPayments(
        address currency,
        uint256 amount,
        uint256 debt,
        uint256 lenderDebt,
        uint256 feeDebt,
        address lender,
        address feeRecipient,
        address primaryPayer,
        address residualPayer,
        address residualRecipient
    ) internal {
        Distributions.distributeLoanPayments(
            currency,
            amount,
            debt,
            lenderDebt,
            feeDebt,
            lender,
            feeRecipient,
            primaryPayer,
            residualPayer,
            residualRecipient
        );
    }

    function hashLien(Lien calldata lien) external pure returns (bytes32) {
        return _hashLien(lien);
    }

    function _hashLien(Lien memory lien) internal pure returns (bytes32) {
        return keccak256(abi.encode(lien));
    }

    function currentLender(uint256 lienId) public view returns (address) {
        return _currentLender(lienId);
    }

    function _currentLender(uint256 lienId) internal view returns (address) {
        return LENDER_RECEIPT.ownerOf(lienId);
    }

    function computeDebt(Lien memory lien) public view returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien);
    }

    function computeDebt(Lien memory lien, uint256 timestamp) public pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, timestamp);
    }

    function _computeDebt(Lien memory lien) internal view returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, block.timestamp);
    }

    function _computeDebt(Lien memory lien, uint256 timestamp) internal pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return CompoundInterest.currentDebtAmount(
            timestamp, 
            lien.principal, 
            lien.startTime, 
            lien.duration, 
            lien.fee, 
            lien.rate, 
            lien.defaultRate
        );
    }

    modifier lienIsValid(uint256 lienId, Lien calldata lien) {
        if (!_validateLien(lienId, lien)) {
            revert("InvalidLien");
        }
        _;
    }

    modifier lienIsCurrent(Lien calldata lien) {
        if (_lienIsDefaulted(lien)) {
            revert("LienIsDefaulted");
        }
        _;
    }

    function _validateLien(
        uint256 lienId,
        Lien calldata lien
    ) internal view returns (bool) {
        return liens[lienId] == _hashLien(lien);
    }

    function _lienIsDefaulted(
        Lien calldata lien
    ) internal view returns (bool) {
        return (lien.startTime + lien.duration + lien.gracePeriod) < block.timestamp;
    }
}

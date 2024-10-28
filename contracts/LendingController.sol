// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import "./interfaces/ILenderReceipt.sol";
import "./interfaces/ILendingController.sol";

import "./KettleAccess.sol";
import "./lib/CompoundInterest.sol";

import "./Structs.sol";
import "./Errors.sol";

contract LendingController is ILendingController, Initializable, Ownable2StepUpgradeable, KettleAccess {   
    ILenderReceipt public LENDER_RECEIPT;

    uint256 public lienIndex;
    
    mapping(uint256 => bytes32) public liens;

    uint256[50] private _gap;

    function __LendingController_init(address owner, address receipt) public initializer {
        __Ownable2Step_init();
        _transferOwnership(owner);

        LENDER_RECEIPT = ILenderReceipt(receipt);
        lienIndex = 1;
    }

    // ===============================
    //        EXTERNAL METHODS
    // ===============================

    function openLien(
        uint256 tokenId,
        uint256 principal,
        address lender,
        address borrower,
        LoanOffer calldata offer
    ) external onlyKettle() returns (uint256 lienId) {

        Lien memory lien = Lien({
            borrower: borrower,
            collection: offer.collateral.collection,
            tokenId: tokenId,
            currency: offer.terms.currency,
            principal: principal,
            rate: offer.terms.rate,
            defaultRate: offer.terms.defaultRate,
            duration: offer.terms.duration,
            gracePeriod: offer.terms.gracePeriod,
            recipient: offer.fee.recipient,
            fee: offer.fee.rate,
            startTime: block.timestamp
        });

        unchecked {
            lienId = lienIndex++;
        }

        liens[lienId] = _hashLien(lien);
        LENDER_RECEIPT.mint(lender, lienId);

        emit LienOpened({
            lienId: lienId, 
            lien: lien 
        });
    }

    function repayLien(
        uint256 lienId,
        Lien calldata lien
    ) external 
      onlyKettle 
      lienIsValid(lienId, lien) 
      returns (
        address lender,
        uint256 debt, 
        uint256 fee, 
        uint256 interest
    ) {
        if (_lienIsDefaulted(lien)) {
            revert LienIsDefaulted();
        }

        (debt, fee, interest) = _computeDebt(lien, block.timestamp);
        lender = _currentLender(lienId);

        _closeLien(lienId);

        emit LienRepaid({ lienId: lienId });   
    }

    function claimLien(
        uint256 lienId,
        Lien calldata lien
    ) external 
      onlyKettle
      lienIsValid(lienId, lien)
      returns (address lender)
    {
        if (!_lienIsDefaulted(lien)) {
            revert LienIsCurrent();
        }

        lender = _currentLender(lienId);

        _closeLien(lienId);

        emit LienDefaulted({ lienId: lienId });
    }

    // ===============================
    //       INTERNAL METHODS
    // ===============================

    function _closeLien(uint256 lienId) internal {
        LENDER_RECEIPT.burn(lienId);
        delete liens[lienId];
    }

    function _hashLien(Lien memory lien) internal pure returns (bytes32) {
        return keccak256(abi.encode(lien));
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

    function _currentLender(uint256 lienId) internal view returns (address) {
        return LENDER_RECEIPT.ownerOf(lienId);
    }

    // ===============================
    //           HELPERS
    // ===============================

    function hashLien(Lien calldata lien) external pure returns (bytes32) {
        return _hashLien(lien);
    }

    function currentLender(uint256 lienId) public view returns (address) {
        return _currentLender(lienId);
    }

    function computeCurrentDebt(Lien memory lien) external view returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, block.timestamp);
    }

    function computeDebtAt(Lien memory lien, uint256 timestamp) external pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, timestamp);
    }

    // ===============================
    //          MODIFIERS
    // ===============================

    modifier lienIsValid(uint256 lienId, Lien calldata lien) {
        if (!_validateLien(lienId, lien)) {
            revert InvalidLien();
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

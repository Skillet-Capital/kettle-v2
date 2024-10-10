// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import { wadExp, wadMul, wadDiv } from "solmate/src/utils/SignedWadMath.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import { Lien, Side, Collateral, LoanOfferTerms, LoanOffer } from "./Structs.sol";
import { LienIsCurrent, InvalidLien, LienIsDefaulted, OnlyKettle } from "./Errors.sol";

import { ILenderReceipt } from "./interfaces/ILenderReceipt.sol";
import { ITransferConduit } from "./interfaces/ITransferConduit.sol";
import { ILendingController } from "./interfaces/ILendingController.sol";

contract LendingController is ILendingController, Initializable, Ownable2StepUpgradeable, ERC721Holder {   
    using SafeERC20 for IERC20;

    int256 private constant _YEAR_WAD = 365 days * 1e18;
    uint256 private constant _BASIS_POINTS = 10_000;

    ITransferConduit public conduit;
    ILenderReceipt public LENDER_RECEIPT;

    address public kettle;
    uint256 public lienIndex;
    
    mapping(uint256 => bytes32) public liens;

    function __LendingController_init(
        address conduitController, 
        address receipt, 
        address owner
    ) public initializer {
        __Ownable2Step_init();
        _transferOwnership(owner);

        conduit = ITransferConduit(conduitController);
        LENDER_RECEIPT = ILenderReceipt(receipt);

        lienIndex = 1;
    }

    function setKettle(address _kettle) external onlyOwner() {
        kettle = _kettle;
    }

    // ===============================
    //          EXTERNAL
    // ===============================

    function repay(
        uint256 lienId,
        Lien calldata lien
    ) external lienIsValid(lienId, lien) lienIsCurrent(lien) returns (uint256) {
        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien, block.timestamp);

        conduit.transferERC20From(
            lien.currency, 
            msg.sender, 
            _currentLender(lienId), 
            lien.principal + interest
        );

        conduit.transferERC20From(
            lien.currency, 
            msg.sender, 
            lien.recipient, 
            fee
        );

        lien.collection.safeTransferFrom(
            address(this),
            lien.borrower,
            lien.tokenId
        );

        _closeLien(lienId);

        return debt;
    }

    function claim(
        uint256 lienId,
        Lien calldata lien
    ) external lienIsValid(lienId, lien) {
        if (!_lienIsDefaulted(lien)) {
            revert LienIsCurrent();
        }

        lien.collection.safeTransferFrom(
            address(this),
            _currentLender(lienId),
            lien.tokenId
        );

        _closeLien(lienId);
    }

    // ===============================
    //        ACCESS CONTROL
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

    function closeLien(
        uint256 lienId
    ) external onlyKettle() {
        _closeLien(lienId);
    }

    function closeLienWithPayments(
        uint256 amount,
        uint256 lienId,
        address primaryPayer,
        address residualPayerOrRecipient,
        Lien calldata lien
    ) external onlyKettle() {
        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien, block.timestamp);

        address lender = _currentLender(lienId);
        uint256 lenderDebt = lien.principal + interest;

        if (amount < debt) {
            if (amount > lenderDebt) {
                conduit.transferERC20From(lien.currency, primaryPayer, lender, lenderDebt);

                uint256 feePayoff = amount - lenderDebt;
                conduit.transferERC20From(lien.currency, primaryPayer, lien.recipient, amount - lenderDebt);

                uint256 residualFeePayoff = fee - feePayoff;
                conduit.transferERC20From(lien.currency, residualPayerOrRecipient, lien.recipient, residualFeePayoff);
            } else {
                conduit.transferERC20From(lien.currency, primaryPayer, lender, amount);

                uint256 residualPayoff = lenderDebt - amount;
                conduit.transferERC20From(lien.currency, residualPayerOrRecipient, lender, residualPayoff);
                conduit.transferERC20From(lien.currency, residualPayerOrRecipient, lien.recipient, fee);
            } 
        } else {
            conduit.transferERC20From(lien.currency, primaryPayer, lender, lenderDebt);
            conduit.transferERC20From(lien.currency, primaryPayer, lien.recipient, fee);
            conduit.transferERC20From(lien.currency, primaryPayer, residualPayerOrRecipient, amount - debt);
        }

        _closeLien(lienId);
    }

    function releaseCollateral(
        IERC721 collection,
        uint256 tokenId,
        address recipient
    ) external onlyKettle() {
        collection.safeTransferFrom(
            address(this),
            recipient,
            tokenId
        );
    }

    // ===============================
    //          INTERNAL
    // ===============================

    function _closeLien(uint256 lienId) internal {
        LENDER_RECEIPT.burn(lienId);
        delete liens[lienId];

        emit LienClosed(lienId);
    }

    function _hashLien(Lien memory lien) internal pure returns (bytes32) {
        return keccak256(abi.encode(lien));
    }

    function _computeDebt(Lien memory lien, uint256 timestamp) internal pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeCurrentDebtAmount(
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

    modifier onlyKettle() {
        if (msg.sender != kettle) {
            revert OnlyKettle();
        }
        _;
    }

    modifier lienIsValid(uint256 lienId, Lien calldata lien) {
        if (!_validateLien(lienId, lien)) {
            revert InvalidLien();
        }
        _;
    }

    modifier lienIsCurrent(Lien calldata lien) {
        if (_lienIsDefaulted(lien)) {
            revert LienIsDefaulted();
        }
        _;
    }

    function verifyLienIsCurrent(uint256 lienId, Lien calldata lien) external view {
        if (!_validateLien(lienId, lien)) {
            revert InvalidLien();
        }

        if (_lienIsDefaulted(lien)) {
            revert LienIsDefaulted();
        }
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

    // ===============================
    //            CALCULATIONS
    // ===============================

    function _computeCurrentDebtAmount(
        uint256 timestamp,
        uint256 principal,
        uint256 startTime,
        uint256 duration,
        uint256 fee,
        uint256 rate,
        uint256 defaultRate
    ) internal pure returns (
        uint256 debt,
        uint256 feeInterest,
        uint256 lenderInterest
    ) {
        // compute debtWithFee
        uint256 debtWithFee = _computeCompoundedDebt(
            principal, 
            fee,
            startTime, 
            timestamp
        );

        // lien is past tenor
        uint256 debtWithRate;
        if (timestamp > startTime + duration) {
            debtWithRate = _computeCompoundedDebt(
                principal, 
                rate,
                startTime, 
                startTime + duration
            );

            debtWithRate = _computeCompoundedDebt(
                debtWithRate, 
                defaultRate, 
                startTime + duration, 
                timestamp
            );
        } else {
            debtWithRate = _computeCompoundedDebt(
                principal, 
                rate, 
                startTime, 
                timestamp
            );
        }

        feeInterest = debtWithFee - principal;
        lenderInterest = debtWithRate - principal;
        debt = principal + feeInterest + lenderInterest;
    }

    /**
     * @dev Computes the current debt of a borrow given the last time it was touched and the last computed debt.
     * @param amount Principal in ETH
     * @param startTime Start time of the loan
     * @param rate Interest rate (in bips)
     * @dev Formula: https://www.desmos.com/calculator/l6omp0rwnh
     */
    function _computeCompoundedDebt(
        uint256 amount,
        uint256 rate,
        uint256 startTime,
        uint256 endTime
    ) internal pure returns (uint256) {
        uint256 loanTime = endTime - startTime;
        int256 yearsWad = wadDiv(int256(loanTime) * 1e18, _YEAR_WAD);
        return uint256(wadMul(int256(amount), wadExp(wadMul(yearsWad, _bipsToSignedWads(rate)))));
    }

    function _bipsToSignedWads(uint256 bips) internal pure returns (int256) {
        return int256((bips * 1e18) / _BASIS_POINTS);
    }
}

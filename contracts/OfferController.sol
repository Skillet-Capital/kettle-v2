// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import { Signatures } from "./Signatures.sol";
import { IOfferController } from "./interfaces/IOfferController.sol";

import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { BidCannotBorrow, InvalidRate, InvalidLoanAmount, InsufficientOffer, InvalidPermitOfferHash, OfferExpired, OfferUnavailable, InvalidCriteria, InvalidToken } from "./Errors.sol";

import { MarketOffer, LoanOffer, Permit, Lien, Side, Criteria } from "./Structs.sol";

contract OfferController is IOfferController, Initializable, Ownable2StepUpgradeable, Signatures {
    uint256 private constant _MAX_RATE = 100_000;

    mapping(address => mapping(uint256 => uint256)) public cancelledOrFulfilled;
    mapping(bytes32 => uint256) private _amountTaken;
   
    uint256[50] private _gap;

    function __OfferController_init() public initializer {
        __Signatures_init();
    }

    function amountTaken(bytes32 offerHash) external view returns (uint256) {
        return _amountTaken[offerHash];
    }

    function _takeMarketOffer(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) internal returns (bytes32 _hash) {

        if (!offer.soft) {
             _verifyCollateral(
                offer.collateral.criteria,
                offer.collateral.identifier,
                tokenId,
                proof
            );
        }

        if (offer.terms.withLoan) {
            if (offer.terms.amount < offer.terms.borrowAmount) {
                revert BidCannotBorrow();
            }
        }

        _hash = _hashMarketOffer(offer);
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);

        cancelledOrFulfilled[offer.maker][offer.salt] = 1;
    }

    function _takeLoanOffer(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) internal returns (bytes32 _hash) {
        _verifyCollateral(
            offer.collateral.criteria,
            offer.collateral.identifier,
            tokenId,
            proof
        );

        if (offer.terms.rate > _MAX_RATE || offer.terms.defaultRate > _MAX_RATE) {
            revert InvalidRate();
        }

        _hash = _hashLoanOffer(offer);
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);

        // check if borrowing from bid
        if (offer.side == Side.BID) {
            if (
                amount > offer.terms.maxAmount ||
                amount < offer.terms.minAmount
            ) {
                revert InvalidLoanAmount();
            }

            uint256 __amountTaken = _amountTaken[_hash];
            if (offer.terms.amount - __amountTaken < amount) {
                revert InsufficientOffer();
            }

            unchecked {
                _amountTaken[_hash] = __amountTaken + amount;
            }
        } else {
            cancelledOrFulfilled[offer.maker][offer.salt] = 1;
        }
    }

    function _validateOffer(
        bytes32 offerHash,
        address signer,
        uint256 expiration,
        uint256 salt,
        bytes calldata signature
    ) internal {
        _verifyOfferAuthorization(offerHash, signer, signature);

        if (expiration < block.timestamp) {
            revert OfferExpired();
        }
        if (cancelledOrFulfilled[signer][salt] == 1) {
            revert OfferUnavailable();
        }
    }

    function _verifyCollateral(
        Criteria criteria,
        uint256 identifier,
        uint256 tokenId,
        bytes32[] calldata proof
    ) internal pure {
        if (criteria == Criteria.PROOF) {
            if (
                !MerkleProof.verifyCalldata(
                    proof, 
                    bytes32(identifier), 
                    keccak256(abi.encode(bytes32(tokenId)))
                )
            ) {
                revert InvalidCriteria();
            }
        } else {
            if (!(tokenId == identifier)) {
                revert InvalidToken();
            }
        }
    }

    /**
     * @notice Cancels offers in bulk for caller
     * @param salts List of offer salts
     */
    function cancelOffers(uint256[] calldata salts) external override {
        uint256 saltsLength = salts.length;
        for (uint256 i; i < saltsLength; ) {
            _cancelOffer(msg.sender, msg.sender, salts[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Cancels offers in bulk for caller
     * @param salts List of offer salts
     */
    function cancelOffersForUser(address user, uint256[] calldata salts) external override onlyOwner {
        uint256 saltsLength = salts.length;
        for (uint256 i; i < saltsLength; ) {
            _cancelOffer(msg.sender, user, salts[i]);
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Cancels all offers by incrementing caller nonce
    function incrementNonce() external override {
        _incrementNonce(msg.sender);
    }

    /**
     * @dev Cancel offer by user and salt
     * @param user Address of user
     * @param salt Unique offer salt
     */
    function _cancelOffer(address operator, address user, uint256 salt) private {
        cancelledOrFulfilled[user][salt] = 1;
        emit OfferCancelled(operator, user, salt);
    }

    /**
     * @dev Cancel all orders by incrementing the user nonce
     * @param user Address of user
     */
    function _incrementNonce(address user) internal {
        emit NonceIncremented(user, ++nonces[user]);
    }
}

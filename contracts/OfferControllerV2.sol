// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./interfaces/IOfferControllerV2.sol";
import "./Signatures.sol";
import "./Errors.sol";
import "./Structs.sol";

contract OfferController is IOfferController, OwnableUpgradeable, Signatures {
    uint256 private constant _MAX_RATE = 100_000;

    address public offerManager;
    mapping(address => mapping(uint256 => uint256)) public cancelledOrFulfilled;
   
    uint256[50] private _gap;

    function __OfferController_init(address _offerManager) internal {
        __Signatures_init();

        _setOfferManager(_offerManager);
    }

    function setOfferManager(address _offerManager) external onlyOwner {
        _setOfferManager(_offerManager);
    }

    function _setOfferManager(address _offerManager) internal {
        offerManager = _offerManager;
        emit OfferManagerUpdated(_offerManager);
    }

    function _takeMarketOffer(
        bool takingBidWithSoftItem,
        uint256 tokenId,
        address taker,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) internal returns (bytes32 _hash) {
        if (offer.taker != address(0) && offer.taker != taker) {
            revert InvalidTaker();
        }

        if (!(offer.soft || takingBidWithSoftItem)) {
             _verifyCollateral(
                offer.collateral.criteria,
                offer.collateral.identifier,
                tokenId,
                proof
            );
        }

        _hash = _hashMarketOffer(offer);
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);

        cancelledOrFulfilled[offer.maker][offer.salt] = 1;

        emit MarketOfferTaken({
            tokenId: tokenId,
            taker: taker,
            offer: offer
        });

        emit MarketOfferTaken2({
            tokenId: tokenId,
            taker: taker,
            offer: offer,
            soft: offer.soft || takingBidWithSoftItem
        });
    }

    function _verifyRedemptionCharge(
        address admin,
        address redeemer,
        uint256 tokenId,
        IERC721 collection,
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) internal returns (bytes32 _hash) {
        if (redeemer != charge.redeemer) {
            revert InvalidTaker();
        }

        if (tokenId != charge.tokenId) {
            revert InvalidTokenId();
        }

        if (collection != charge.collection) {
            revert InvalidCollection();
        }

        _hash = _hashRedemptionCharge(admin, charge);
        _validateOffer(_hash, admin, charge.expiration, charge.salt, signature);

        cancelledOrFulfilled[admin][charge.salt] = 1;
    }

    function _validateOffer(
        bytes32 offerHash,
        address signer,
        uint256 expiration,
        uint256 salt,
        bytes calldata signature
    ) internal {
        if (expiration < block.timestamp) {
            revert OfferExpired();
        }

        if (cancelledOrFulfilled[signer][salt] == 1) {
            revert OfferUnavailable();
        }

        _verifyOfferAuthorization(offerHash, signer, signature);
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
    function cancelOffersForUser(address user, uint256[] calldata salts) external override onlyOwnerOrOfferManager {
        uint256 saltsLength = salts.length;
        for (uint256 i; i < saltsLength; ) {
            _cancelOffer(msg.sender, user, salts[i]);
            unchecked {
                ++i;
            }
        }
    }

    function reserveOffer(address user, uint256 salt, uint256 reserved) external onlyOwnerOrOfferManager {
        cancelledOrFulfilled[user][salt] = reserved;
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

    modifier onlyOwnerOrOfferManager() {
        if (msg.sender != owner() && msg.sender != offerManager) {
            revert OnlyOfferManagerOrOwner();
        }
        _;
    }
}

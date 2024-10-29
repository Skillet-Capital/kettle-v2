// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import "./interfaces/IEscrowController.sol";

import "./KettleAccess.sol";

import "./Structs.sol";
import "./Errors.sol";

contract EscrowController is IEscrowController, Initializable, Ownable2StepUpgradeable, KettleAccess {
    address public TOKEN_SUPPLIER;

    uint256 public escrowIndex;
    uint256 public lockTime;
    bool public whitelistOnly;

    mapping(uint256 => bytes32) public escrows;
    mapping(uint256 => bool) public escrowedTokens;
    mapping(address => bool) public whitelistedAskMakers;
    mapping(address => bool) public whitelistedBidTakers;

    uint256[50] private _gap;

    function __EscrowController_init(address owner) public initializer {
        __Ownable2Step_init();
        _transferOwnership(owner);

        escrowIndex = 1;
        lockTime = 14 days;
        whitelistOnly = true;
    }

    // ===============================
    //             SETTERS
    // ===============================

    function setTokenSupplier(address _tokenSupplier) external onlyOwner {
        TOKEN_SUPPLIER = _tokenSupplier;
    }

    function setLockTime(uint256 time) external onlyOwner {
        lockTime = time;
    }

    function setWhitelistOnly(bool _whitelistOnly) external onlyOwner {
        whitelistOnly = _whitelistOnly;
    }

    function whitelistedAskMaker(address user, bool whitelisted) external onlyOwner {
        whitelistedAskMakers[user] = whitelisted;
        emit AskMakerWhitelisted(user, whitelisted);
    }

    function whitelistBidTaker(address user, bool whitelisted) external onlyOwner {
        whitelistedBidTakers[user] = whitelisted;
        emit BidTakerWhitelisted(user, whitelisted);
    }

    function setEscrowedToken(uint256 placeholder, bool escrowed) external onlyOwner {
        escrowedTokens[placeholder] = escrowed;
        emit PlaceholderEscrowed(placeholder, escrowed);
    }

    // ===============================
    //        EXTERNAL METHODS
    // ===============================

    function openEscrow(
        uint256 placeholder,
        uint256 rebate,
        address buyer,
        address seller,
        MarketOffer calldata offer
    ) external onlyKettle returns (uint256 escrowId) {
        if (escrowedTokens[placeholder]) revert PlaceholderAlreadyEscrowed();

        if (whitelistOnly) {
            if (offer.side == Side.ASK && !whitelistedAskMakers[seller]) revert SellerNotAskWhitelisted();
            if (offer.side == Side.BID && !whitelistedBidTakers[buyer]) revert SellerNotBidWhitelisted();
        }

        Escrow memory escrow = Escrow({
            side: offer.side,
            placeholder: placeholder,
            buyer: buyer,
            seller: seller,
            collection: offer.collateral.collection,
            identifier: offer.collateral.identifier,
            currency: offer.terms.currency,
            amount: offer.terms.amount,
            recipient: offer.fee.recipient,
            fee: offer.fee.rate,
            rebate: rebate,
            timestamp: block.timestamp,
            lockTime: lockTime
        });

        unchecked {
            escrowId = escrowIndex++;
        }

        escrows[escrowIndex] = _hashEscrow(escrow);
        escrowedTokens[placeholder] = true;

        emit EscrowOpened({
            escrowId: escrowIndex++,
            escrow: escrow
        });
    }

    function settleEscrow(uint256 escrowId, Escrow calldata escrow, uint256 tokenId) external onlyKettle validEscrow(escrowId, escrow) {
        delete escrows[escrowId];
        emit EscrowSettled({ escrowId: escrowId, tokenId: tokenId });
    }

    function claimEscrow(uint256 escrowId, Escrow calldata escrow) external onlyKettle validEscrow(escrowId, escrow) escrowUnlocked(escrow) {
        delete escrows[escrowId];
        emit EscrowClaimed({ escrowId: escrowId });
    }

    function rejectEscrow(uint256 escrowId, Escrow calldata escrow, bool returnRebate) external onlyKettle validEscrow(escrowId, escrow) {
        delete escrows[escrowId];
        emit EscrowRejected({ escrowId: escrowId, rebateReturned: returnRebate });
    }

    function hashEscrow(Escrow memory escrow) external pure returns (bytes32 _hash) {
        _hash = _hashEscrow(escrow);
    }

    // ===============================
    //             HELPERS
    // ===============================

    function _hashEscrow(Escrow memory escrow) internal pure returns (bytes32 _hash) {
        _hash = keccak256(abi.encode(escrow));
    }

    // ===============================
    //             MODIFIERS
    // ===============================

    modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
        if (!(escrows[escrowId] == _hashEscrow(escrow))) revert InvalidEscrow();
        _;
    }

    modifier escrowUnlocked(Escrow memory escrow) {
        if(escrow.timestamp + escrow.lockTime > block.timestamp) revert EscrowLocked();
        _;
    }
}

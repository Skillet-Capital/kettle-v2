// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// import { OfferController } from "./OfferController.sol";
// import { Transfer } from "./Transfer.sol";
// import { Utils } from "./Utils.sol";

// import { IKettleAsset } from "./interfaces/IKettleAsset.sol";
// import { IKettleEscrow } from "./interfaces/IKettleEscrow.sol";

// import { Listing, Escrow } from "./Structs.sol";
// import { MakerNotWhitelisted, EscrowLocked, InvalidEscrow } from "./Errors.sol";

// contract KettleEscrow is IKettleEscrow, OfferController, Transfer {

//     uint256 public escrowIndex = 1;
//     uint256 public lockTime = 7 days;
//     bool public whitelistOnly = false;

//     mapping(address => bool) public whitelist;
//     mapping(uint256 => bytes32) public escrows;

//     constructor () OfferController() {}

//     // ===============================
//     //             SETTERS
//     // ===============================

//     function setLockTime(uint256 time) external override onlyOwner {
//         lockTime = time;
//     }

//     function setWhitelistOnly(bool _whitelistOnly) external override onlyOwner {
//         whitelistOnly = _whitelistOnly;
//     }

//     function setWhitelistMaker(address maker, bool whitelisted) external override onlyOwner {
//         whitelist[maker] = whitelisted;
//         emit MakerWhitelisted(maker, whitelisted);
//     }

//     // ===============================
//     //             ESCROW
//     // ===============================

//     function _openEscrow(
//         address maker,
//         address taker,
//         address collection,
//         uint256 tokenId,
//         address currency,
//         uint256 amount,
//         uint256 fee,
//         uint256 rebate,
//         uint256 lockTime
//     ) internal returns (uint256 escrowId) {

//         Escrow memory escrow = Escrow({
//             maker: maker,
//             taker: taker,
//             collection: collection,
//             tokenId: tokenId,
//             currency: currency,
//             recipient: maker,
//             amount: amount,
//             fee: fee,
//             rebate: rebate,
//             timestamp: block.timestamp,
//             lockTime: lockTime
//         });

//         unchecked {
//             escrowId = escrowIndex++;
//         }

//         escrows[escrowIndex] = _hashEscrow(escrow);

//         emit EscrowCreated({
//             escrowId: escrowIndex++,
//             escrow: escrow
//         });

//         return escrowIndex - 1;
//     }
    
//     function takeListing(
//         Listing calldata listing,
//         bytes calldata signature
//     ) external override {
//         if (whitelistOnly && !whitelist[listing.maker]) {
//             revert MakerNotWhitelisted();
//         }

//         _takeListing(msg.sender, listing, signature);
        
//         // transfer the amount to the contract
//         _transfer(
//             listing.terms.currency,
//             msg.sender,
//             address(this),
//             listing.terms.amount
//         );

//         uint256 rebate = 0;
//         if (listing.terms.rebate > 0) {
//             rebate = Utils.mulFee(listing.terms.rebate, listing.terms.amount);
            
//             // transfer rebate from maker to the contract
//             _transfer(
//                 listing.terms.currency,
//                 listing.maker,
//                 address(this),
//                 rebate
//             );
//         }

//         // hash escrow
//         Escrow memory escrow = Escrow({
//             identifier: listing.collateral.identifier,
//             maker: listing.maker,
//             taker: msg.sender,
//             collection: listing.collateral.collection,
//             currency: listing.terms.currency,
//             recipient: listing.fee.recipient,
//             amount: listing.terms.amount,
//             fee: listing.fee.rate,
//             rebate: rebate,
//             timestamp: block.timestamp,
//             lockTime: lockTime
//         });

//         escrows[escrowIndex] = _hashEscrow(escrow);

//         emit EscrowCreated({
//             escrowId: escrowIndex++,
//             escrow: escrow
//         });
//     }

//     function settleEscrow(
//         uint256 escrowId, 
//         uint256 tokenId, 
//         Escrow calldata escrow
//     ) external override onlyOwner validEscrow(escrowId, escrow) {
//         // mint token to the taker
//         IKettleAsset(escrow.collection).mint(escrow.taker, tokenId);

//         // calculate the net amount received
//         uint256 netAmount = escrow.amount;
//         if (escrow.fee > 0) {
//             uint256 fee = Utils.mulFee(escrow.fee, escrow.amount);
//             netAmount -= fee;

//             // transfer fee to the fee recipient
//             _transfer(
//                 escrow.currency, 
//                 address(this), 
//                 escrow.recipient, 
//                 fee
//             );
//         }

//         // transfer amount and rebate to the maker
//         _transfer(
//             escrow.currency,
//             address(this),
//             escrow.maker, 
//             netAmount + escrow.rebate
//         );

//         // delete the escrow
//         delete escrows[escrowId];

//         emit EscrowSettled({ escrowId: escrowId, tokenId: tokenId });
//     }

//     function rejectEscrow(
//         uint256 escrowId, 
//         Escrow calldata escrow
//     ) external override onlyOwner validEscrow(escrowId, escrow) {

//         // transfer amount and rebate back to the taker
//         _transfer(
//             escrow.currency,
//             address(this),
//             escrow.taker,
//             escrow.amount + escrow.rebate
//         );

//         // delete the escrow
//         delete escrows[escrowId];

//         emit EscrowRejected({ escrowId: escrowId, rebateReturned: false });
//     }

//     function rejectEscrowReturnRebate(
//         uint256 escrowId,
//         Escrow calldata escrow
//     ) external override onlyOwner validEscrow(escrowId, escrow) {

//         // transfer amount back to the taker
//         _transfer(
//             escrow.currency,
//             address(this),
//             escrow.taker,
//             escrow.amount
//         );

//         // transfer rebate back to the maker
//         _transfer(
//             escrow.currency,
//             address(this),
//             escrow.maker,
//             escrow.rebate
//         );

//         // delete the escrow
//         delete escrows[escrowId];

//         emit EscrowRejected({ escrowId: escrowId, rebateReturned: true });
//     }

//     function claimEscrow(
//         uint256 escrowId,
//         Escrow calldata escrow
//     ) external override validEscrow(escrowId, escrow) escrowUnlocked(escrow) {

//         // transfer amount and rebate back to the taker
//         _transfer(
//             escrow.currency,
//             address(this),
//             escrow.taker,
//             escrow.amount + escrow.rebate
//         );

//         // delete the escrow
//         delete escrows[escrowId];

//         emit EscrowClaimed({ escrowId: escrowId });
//     }

//     // ===============================
//     //             HELPERS
//     // ===============================

//     function hashEscrow(Escrow calldata escrow) external pure override returns (bytes32 _hash) {
//         _hash = _hashEscrow(escrow);
//     }

//     function _hashEscrow(Escrow memory escrow) internal pure returns (bytes32 _hash) {
//         _hash = keccak256(
//             abi.encodePacked(
//                 escrow.identifier,
//                 escrow.maker,
//                 escrow.taker,
//                 escrow.collection,
//                 escrow.currency,
//                 escrow.recipient,
//                 escrow.amount,
//                 escrow.fee,
//                 escrow.rebate,
//                 escrow.timestamp,
//                 escrow.lockTime
//             )
//         );
//     }

//     // ===============================
//     //             MODIFIERS
//     // ===============================

//     modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
//         if (!(escrows[escrowId] == _hashEscrow(escrow))) revert InvalidEscrow();
//         _;
//     }

//     modifier escrowUnlocked(Escrow memory escrow) {
//         if(escrow.timestamp + escrow.lockTime > block.timestamp) revert EscrowLocked();
//         _;
//     }
// }

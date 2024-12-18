import {
  MarketOfferTaken as MarketOfferTakenEvent,
  // LoanOfferTaken as LoanOfferTakenEvent,
} from "../generated/Kettle/Kettle";

// import {
//   LienRepaid as LienRepaidEvent,
//   LienDefaulted as LienDefaultedEvent
// } from "../generated/LendingController/LendingController";

import {
  Activity,
  FeeCollection
} from "../generated/schema";

import {
  Side
} from "./constants";

import {
  formatCollateralId,
  formatPlaceholderId,
} from "./helpers";

import {
  ActivityType
} from "./types";

export function handleMarketOfferTaken(event: MarketOfferTakenEvent): void {
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = event.params.offer.side == Side.BID 
    ? ActivityType.BID_TAKEN 
    : event.params.offer.soft
      ? ActivityType.ESCROW_ASK
      : ActivityType.ASK_TAKEN;
  activity.maker = event.params.offer.maker;
  activity.taker = event.params.taker;
  activity.collateralId = event.params.offer.soft
    ? formatPlaceholderId(event.params.offer.collateral.collection, event.params.tokenId)
    : formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
  activity.currency = event.params.offer.terms.currency;
  activity.amount = event.params.offer.terms.amount;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();

  // if it is a hard offer, fee is collected on market offer taken
  if (!event.params.offer.soft) {
    const feeCollected = new FeeCollection(event.transaction.hash.concatI32(event.logIndex.toI32()));
    feeCollected.amount = event.params.offer.terms.amount;
    feeCollected.fee = event.params.offer.fee.rate;
    feeCollected.currency = event.params.offer.terms.currency;
    feeCollected.buyer = (event.params.offer.side == Side.BID) ? event.params.offer.maker : event.params.taker;
    feeCollected.seller = (event.params.offer.side == Side.BID) ? event.params.taker : event.params.offer.maker;
    feeCollected.collateralId = formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
    feeCollected.fromEscrow = false;
    feeCollected.timestamp = event.block.timestamp;
    feeCollected.save();
  }
}

// export function handleLoanOfferTaken(event: LoanOfferTakenEvent): void {
//   const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
//   activity.type = event.params.offer.side == Side.BID ? ActivityType.LOAN_OFFER_TAKEN : ActivityType.BORROW_OFFER_TAKEN;
//   activity.maker = event.params.offer.maker;
//   activity.taker = event.params.taker;
//   activity.collateralId = formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
//   activity.collection = event.params.offer.collateral.collection;
//   activity.tokenId = event.params.tokenId;
//   activity.currency = event.params.offer.terms.currency;
//   activity.amount = event.params.principal;
//   activity.duration = event.params.offer.terms.duration;
//   activity.rate = event.params.offer.terms.rate;
//   activity.timestamp = event.block.timestamp;
//   activity.txn = event.transaction.hash;
//   activity.save();
// }

// export function storeRepay(event: LienRepaidEvent): void {
//   const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;

//   const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
//   activity.type = ActivityType.LOAN_REPAID;
//   activity.maker = lien.borrower;
//   activity.taker = lien.lender;
//   activity.collateralId = lien.collateralId;
//   activity.collection = lien.collection;
//   activity.tokenId = lien.tokenId;
//   activity.currency = lien.currency;
//   activity.amount = event.params.debt;
//   activity.duration = lien.duration;
//   activity.rate = lien.rate;
//   activity.timestamp = event.block.timestamp;
//   activity.txn = event.transaction.hash;
//   activity.save();
// }

// export function storeDefault(event: LienDefaultedEvent): void {
//   const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;

//   const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
//   activity.type = ActivityType.LOAN_CLAIMED;
//   activity.maker = lien.borrower;
//   activity.taker = lien.lender;
//   activity.collateralId = lien.collateralId;
//   activity.collection = lien.collection;
//   activity.tokenId = lien.tokenId;
//   activity.currency = lien.currency;
//   activity.amount = lien.principal;
//   activity.duration = lien.duration;
//   activity.rate = lien.rate;
//   activity.timestamp = event.block.timestamp;
//   activity.txn = event.transaction.hash;
//   activity.save();
// }

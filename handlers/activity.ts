import {
  MarketOfferTaken as MarketOfferTakenEvent,
  LoanOfferTaken as LoanOfferTakenEvent,
} from "../generated/Kettle/Kettle";

import {
  LienRepaid as LienRepaidEvent,
  LienDefaulted as LienDefaultedEvent
} from "../generated/LendingController/LendingController";

import {
  Activity,
  Lien
} from "../generated/schema";

import {
  Side
} from "./constants";

import {
  formatLienId,
  formatCollateralId,
} from "./helpers";

import {
  ActivityType
} from "./types";

export function handleMarketOfferTaken(event: MarketOfferTakenEvent): void {
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = event.params.offer.side == Side.BID ? ActivityType.BID_TAKEN : ActivityType.ASK_TAKEN;
  activity.maker = event.params.offer.maker;
  activity.taker = event.params.taker;
  activity.collateralId = formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
  activity.collection = event.params.offer.collateral.collection;
  activity.tokenId = event.params.tokenId;
  activity.currency = event.params.offer.terms.currency;
  activity.amount = event.params.offer.terms.amount;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

export function handleLoanOfferTaken(event: LoanOfferTakenEvent): void {
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = event.params.offer.side == Side.BID ? ActivityType.LOAN_OFFER_TAKEN : ActivityType.BORROW_OFFER_TAKEN;
  activity.maker = event.params.offer.maker;
  activity.taker = event.params.taker;
  activity.collateralId = formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
  activity.collection = event.params.offer.collateral.collection;
  activity.tokenId = event.params.tokenId;
  activity.currency = event.params.offer.terms.currency;
  activity.amount = event.params.principal;
  activity.duration = event.params.offer.terms.duration;
  activity.rate = event.params.offer.terms.rate;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

export function storeRepay(event: LienRepaidEvent): void {
  const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;

  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = ActivityType.LOAN_REPAID;
  activity.maker = lien.borrower;
  activity.taker = lien.lender;
  activity.collateralId = lien.collateralId;
  activity.collection = lien.collection;
  activity.tokenId = lien.tokenId;
  activity.currency = lien.currency;
  activity.amount = event.params.debt;
  activity.duration = lien.duration;
  activity.rate = lien.rate;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

export function storeDefault(event: LienDefaultedEvent): void {
  const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;

  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = ActivityType.LOAN_CLAIMED;
  activity.maker = lien.borrower;
  activity.taker = lien.lender;
  activity.collateralId = lien.collateralId;
  activity.collection = lien.collection;
  activity.tokenId = lien.tokenId;
  activity.currency = lien.currency;
  activity.amount = lien.principal;
  activity.duration = lien.duration;
  activity.rate = lien.rate;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

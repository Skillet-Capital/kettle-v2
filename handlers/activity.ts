import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

import {
  MarketOfferTaken as MarketOfferTakenEvent,
  LoanOfferTaken as LoanOfferTakenEvent,
} from "../generated/Kettle/Kettle";

import {
  Activity
} from "../generated/schema";

import {
  Side
} from "./constants";

import {
  formatCollateralId
} from "./helpers";

export function handleMarketOfferTaken(event: MarketOfferTakenEvent): void {
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = event.params.offer.side == Side.BID ? "bid" : "ask";
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
  activity.type = event.params.offer.side == Side.BID ? "loan-offer" : "borrow-offer";
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

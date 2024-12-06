import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import {
  EscrowOpened as EscrowOpenedEvent,
  EscrowSettled as EscrowSettledEvent,
  EscrowRejected as EscrowRejectedEvent,
  EscrowClaimed as EscrowClaimedEvent,
} from "../generated/Kettle/Kettle";

import {
  Escrow
} from "../generated/schema";

import {
  formatEscrowId,
  formatPlaceholderId
} from "./helpers";

export function handleEscrowOpened(event: EscrowOpenedEvent): void {
  log.info("buyer: {}", [event.params.escrow.buyer.toHexString()]);
  log.info("seller: {}", [event.params.escrow.seller.toHexString()]);
  log.info("collection: {}", [event.params.escrow.collection.toHexString()]);
  log.info("currency: {}", [event.params.escrow.currency.toHexString()]);
  log.info("recipient: {}", [event.params.escrow.recipient.toHexString()]);

  const escrow = new Escrow(formatEscrowId(event.address, event.params.escrowId));
  escrow.escrowId = event.params.escrowId;
  escrow.side = BigInt.fromI32(event.params.escrow.side);
  escrow.buyer = event.params.escrow.buyer;
  escrow.seller = event.params.escrow.seller;
  
  escrow.collateralId = formatPlaceholderId(event.params.escrow.collection, event.params.escrow.placeholder);
  escrow.collection = event.params.escrow.collection;
  escrow.placeholder = Bytes.fromHexString(event.params.escrow.placeholder.toHexString());

  escrow.currency = event.params.escrow.currency;
  escrow.amount = event.params.escrow.amount;
  escrow.recipient = event.params.escrow.recipient;
  escrow.fee = event.params.escrow.fee;
  escrow.rebate = event.params.escrow.rebate;

  escrow.redemptionHash = event.params.escrow.redemptionHash; //Bytes.fromHexString(event.params.escrow.redemptionHash.toHexString());
  escrow.redemptionCharge = event.params.escrow.redemptionCharge;

  escrow.lockTime = event.params.escrow.lockTime;
  escrow.timestamp = event.params.escrow.timestamp;

  escrow.status = "open";
  escrow.save();
}

export function handleEscrowSettled(event: EscrowSettledEvent): void {
  const escrow = Escrow.load(formatEscrowId(event.address, event.params.escrowId)) as Escrow;
  escrow.status = "settled";
  escrow.tokenId = event.params.tokenId;
  escrow.save();
}

export function handleEscrowClaimed(event: EscrowClaimedEvent): void {
  const escrow = Escrow.load(formatEscrowId(event.address, event.params.escrowId)) as Escrow;
  escrow.status = "claimed";
  escrow.save();
}

export function handleEscrowRejected(event: EscrowRejectedEvent): void {
  const escrow = Escrow.load(formatEscrowId(event.address, event.params.escrowId)) as Escrow;
  escrow.status = "rejected";
  escrow.save();
}

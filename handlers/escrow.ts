import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import {
  EscrowOpened as EscrowOpenedEvent,
  EscrowSettled as EscrowSettledEvent,
  EscrowRejected as EscrowRejectedEvent,
  EscrowClaimed as EscrowClaimedEvent,
} from "../generated/Kettle/Kettle";

import {
  Escrow,
  FeeCollection
} from "../generated/schema";

import {
  formatCollateralId,
  formatEscrowId,
  formatPlaceholder,
  formatPlaceholderId
} from "./helpers";

export function handleEscrowOpened(event: EscrowOpenedEvent): void {
  const escrow = new Escrow(formatEscrowId(event.address, event.params.escrowId));
  escrow.escrowId = event.params.escrowId;
  escrow.side = BigInt.fromI32(event.params.escrow.side);
  escrow.buyer = event.params.escrow.buyer;
  escrow.seller = event.params.escrow.seller;
  
  escrow.collateralId = formatPlaceholderId(event.params.escrow.collection, event.params.escrow.placeholder);
  escrow.collection = event.params.escrow.collection;
  escrow.placeholder = formatPlaceholder(event.params.escrow.placeholder);

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
  escrow.settlementCollateralId = formatCollateralId(Address.fromBytes(escrow.collection), event.params.tokenId);
  escrow.settlementTimestamp = event.block.timestamp;
  escrow.save();

  // collect fee here
  const feeCollected = new FeeCollection(event.transaction.hash.concatI32(event.logIndex.toI32()));
  feeCollected.currency = escrow.currency;
  feeCollected.amount = escrow.amount;
  feeCollected.fee = escrow.fee;
  feeCollected.buyer = escrow.buyer;
  feeCollected.seller = escrow.seller;
  feeCollected.collateralId = escrow.collateralId;
  feeCollected.timestamp = event.block.timestamp;
  feeCollected.fromEscrow = true;
  feeCollected.save();
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

import {
  AskMakerWhitelisted,
  BidTakerWhitelisted,
  TokenSupplierUpdated,
  RedemptionAdminUpdated,
  RedemptionWalletUpdated,
  RedemptionFeeCollectorUpdated,
  EscrowLockTimeUpdated,
  EscrowSettlerUpdated,
  OfferManagerUpdated
} from "../generated/Kettle/Kettle";

import {
  AskMakerWhitelist,
  BidTakerWhitelist,
  TokenSupplierUpdate,
  RedemptionAdminUpdate,
  RedemptionWalletUpdate,
  RedemptionFeeCollectorUpdate,
  EscrowLockTimeUpdate,
  EscrowSettlerUpdate,
  OfferManagerUpdate
} from "../generated/schema";

export function handleAskMakerWhitelisted(event: AskMakerWhitelisted): void {
  let whitelist = AskMakerWhitelist.load(event.params.maker);
  if (whitelist == null) {
    whitelist = new AskMakerWhitelist(event.params.maker);
  }

  whitelist.address = event.params.maker;
  whitelist.whitelisted = event.params.whitelisted;
  whitelist.save();
}

export function handleBidTakerWhitelisted(event: BidTakerWhitelisted): void {
  let whitelist = BidTakerWhitelist.load(event.params.taker);
  if (whitelist == null) {
    whitelist = new BidTakerWhitelist(event.params.taker);
  }

  whitelist.address = event.params.taker;
  whitelist.whitelisted = event.params.whitelisted;
  whitelist.save();
}

export function handleTokenSupplierUpdated(event: TokenSupplierUpdated): void {
  const update = new TokenSupplierUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.supplier;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleRedemptionAdminUpdated(event: RedemptionAdminUpdated): void {
  const update = new RedemptionAdminUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.admin;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleRedemptionWalletUpdated(event: RedemptionWalletUpdated): void {
  const update = new RedemptionWalletUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.wallet;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleRedemptionFeeCollectorUpdated(event: RedemptionFeeCollectorUpdated): void {
  const update = new RedemptionFeeCollectorUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.collector;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleEscrowLockTimeUpdated(event: EscrowLockTimeUpdated): void {
  const update = new EscrowLockTimeUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.lockTime = event.params.lockTime;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleEscrowSettlerUpdated(event: EscrowSettlerUpdated): void {
  const update = new EscrowSettlerUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.settler;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleOfferManagerUpdated(event: OfferManagerUpdated): void {
  const update = new OfferManagerUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.offerManager;
  update.timestamp = event.block.timestamp;
  update.save();
}

import {
  Initialized as InitializedEvent,
  LoanOfferTaken as LoanOfferTakenEvent,
  MarketOfferTaken as MarketOfferTakenEvent,
  NonceIncremented as NonceIncrementedEvent,
  OfferCancelled as OfferCancelledEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Refinance as RefinanceEvent
} from "../generated/Kettle/Kettle"
import {
  Initialized,
  LoanOfferTaken,
  MarketOfferTaken,
  NonceIncremented,
  OfferCancelled,
  OwnershipTransferred,
  Refinance
} from "../generated/schema"

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLoanOfferTaken(event: LoanOfferTakenEvent): void {
  let entity = new LoanOfferTaken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.taker = event.params.taker
  entity.offer_kind = event.params.offer.kind
  entity.offer_soft = event.params.offer.soft
  entity.offer_side = event.params.offer.side
  entity.offer_maker = event.params.offer.maker
  entity.offer_taker = event.params.offer.taker
  entity.offer_collateral_criteria = event.params.offer.collateral.criteria
  entity.offer_collateral_collection = event.params.offer.collateral.collection
  entity.offer_collateral_identifier = event.params.offer.collateral.identifier
  entity.offer_terms_currency = event.params.offer.terms.currency
  entity.offer_terms_amount = event.params.offer.terms.amount
  entity.offer_terms_maxAmount = event.params.offer.terms.maxAmount
  entity.offer_terms_minAmount = event.params.offer.terms.minAmount
  entity.offer_terms_rate = event.params.offer.terms.rate
  entity.offer_terms_defaultRate = event.params.offer.terms.defaultRate
  entity.offer_terms_duration = event.params.offer.terms.duration
  entity.offer_terms_gracePeriod = event.params.offer.terms.gracePeriod
  entity.offer_fee_recipient = event.params.offer.fee.recipient
  entity.offer_fee_rate = event.params.offer.fee.rate
  entity.offer_expiration = event.params.offer.expiration
  entity.offer_salt = event.params.offer.salt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMarketOfferTaken(event: MarketOfferTakenEvent): void {
  let entity = new MarketOfferTaken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.taker = event.params.taker
  entity.offer_kind = event.params.offer.kind
  entity.offer_soft = event.params.offer.soft
  entity.offer_side = event.params.offer.side
  entity.offer_maker = event.params.offer.maker
  entity.offer_taker = event.params.offer.taker
  entity.offer_collateral_criteria = event.params.offer.collateral.criteria
  entity.offer_collateral_collection = event.params.offer.collateral.collection
  entity.offer_collateral_identifier = event.params.offer.collateral.identifier
  entity.offer_terms_currency = event.params.offer.terms.currency
  entity.offer_terms_amount = event.params.offer.terms.amount
  entity.offer_terms_rebate = event.params.offer.terms.rebate
  entity.offer_fee_recipient = event.params.offer.fee.recipient
  entity.offer_fee_rate = event.params.offer.fee.rate
  entity.offer_expiration = event.params.offer.expiration
  entity.offer_salt = event.params.offer.salt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNonceIncremented(event: NonceIncrementedEvent): void {
  let entity = new NonceIncremented(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.nonce = event.params.nonce

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCancelled(event: OfferCancelledEvent): void {
  let entity = new OfferCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.user = event.params.user
  entity.salt = event.params.salt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRefinance(event: RefinanceEvent): void {
  let entity = new Refinance(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldLienId = event.params.oldLienId
  entity.newLienId = event.params.newLienId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

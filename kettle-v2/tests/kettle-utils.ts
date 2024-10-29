import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Initialized,
  LoanOfferTaken,
  MarketOfferTaken,
  NonceIncremented,
  OfferCancelled,
  OwnershipTransferred,
  Refinance
} from "../generated/Kettle/Kettle"

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createLoanOfferTakenEvent(
  tokenId: BigInt,
  taker: Address,
  offer: ethereum.Tuple
): LoanOfferTaken {
  let loanOfferTakenEvent = changetype<LoanOfferTaken>(newMockEvent())

  loanOfferTakenEvent.parameters = new Array()

  loanOfferTakenEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  loanOfferTakenEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  loanOfferTakenEvent.parameters.push(
    new ethereum.EventParam("offer", ethereum.Value.fromTuple(offer))
  )

  return loanOfferTakenEvent
}

export function createMarketOfferTakenEvent(
  tokenId: BigInt,
  taker: Address,
  offer: ethereum.Tuple
): MarketOfferTaken {
  let marketOfferTakenEvent = changetype<MarketOfferTaken>(newMockEvent())

  marketOfferTakenEvent.parameters = new Array()

  marketOfferTakenEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketOfferTakenEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  marketOfferTakenEvent.parameters.push(
    new ethereum.EventParam("offer", ethereum.Value.fromTuple(offer))
  )

  return marketOfferTakenEvent
}

export function createNonceIncrementedEvent(
  user: Address,
  nonce: BigInt
): NonceIncremented {
  let nonceIncrementedEvent = changetype<NonceIncremented>(newMockEvent())

  nonceIncrementedEvent.parameters = new Array()

  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  nonceIncrementedEvent.parameters.push(
    new ethereum.EventParam("nonce", ethereum.Value.fromUnsignedBigInt(nonce))
  )

  return nonceIncrementedEvent
}

export function createOfferCancelledEvent(
  operator: Address,
  user: Address,
  salt: BigInt
): OfferCancelled {
  let offerCancelledEvent = changetype<OfferCancelled>(newMockEvent())

  offerCancelledEvent.parameters = new Array()

  offerCancelledEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  offerCancelledEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  offerCancelledEvent.parameters.push(
    new ethereum.EventParam("salt", ethereum.Value.fromUnsignedBigInt(salt))
  )

  return offerCancelledEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRefinanceEvent(
  oldLienId: BigInt,
  newLienId: BigInt
): Refinance {
  let refinanceEvent = changetype<Refinance>(newMockEvent())

  refinanceEvent.parameters = new Array()

  refinanceEvent.parameters.push(
    new ethereum.EventParam(
      "oldLienId",
      ethereum.Value.fromUnsignedBigInt(oldLienId)
    )
  )
  refinanceEvent.parameters.push(
    new ethereum.EventParam(
      "newLienId",
      ethereum.Value.fromUnsignedBigInt(newLienId)
    )
  )

  return refinanceEvent
}

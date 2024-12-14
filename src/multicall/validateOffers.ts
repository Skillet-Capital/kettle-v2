import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall";
import { BigNumber } from "@ethersproject/bignumber";

import { MarketOffer, MulticallValidation, OfferWithHash, Side } from "../types";
import { equalAddresses } from "../utils/equalAddresses";

import { buildAvailabilityValidationsContext } from "./availability";
import { buildCollateralValidationsContext } from "./collaterals";
import { buildTermsValidationsContext } from "./terms";
import { getEpoch } from "../utils";
import { buildSoftCollateralValidationsContext } from "./soft-collateral";

export async function validateOffers(
  kettleAddress: string,
  rpcUrl: string,
  offers: OfferWithHash[],
  soft: boolean = true
): Promise<MulticallValidation> {

  // create multicall instance
  const multicall = new Multicall({
    multicallCustomContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
    nodeUrl: rpcUrl,
    tryAggregate: true
  });

  // remove duplicate offers
  const uniqueOffers = offers.filter(
    (offer, index, self) => self.findIndex((o) => o.salt === offer.salt) === index,
  );

  // build context for multicall
  const callContext: ContractCallContext[] = [
    ...buildAvailabilityValidationsContext(
      uniqueOffers,
      kettleAddress,
    ),
    // soft validations check for ownership and approval of collateral (not intended for deletion)
    ...(soft ? [

      // validate collateral for hard asks
      ...buildCollateralValidationsContext(
        uniqueOffers.filter(({ side, soft }) => side == Side.ASK && !soft),
        kettleAddress,
      ),

      // validate collateral for soft asks
      ...buildSoftCollateralValidationsContext(
        uniqueOffers.filter(({ side, soft }) => side == Side.ASK && soft),
        kettleAddress
      ),

      // validate terms for bids
      ...buildTermsValidationsContext(
        uniqueOffers.filter(({ side }) => side == Side.BID),
        kettleAddress,
      ),
    ] : [])
  ];

  // call multicall
  const results: ContractCallResults = await multicall.call(callContext);
  if (!results || !results.results) return {};

  const availabilityValidations = checkAvailabilityValidations(offers, results);
  const collateralValidations = soft ? checkCollateralValidations(offers, results) : {};
  const softCollateralValidations = soft ? checkSoftCollateralValidations(offers, results) : {};
  const termsValidations = soft ? checkTermsValidations(offers, results) : {};

  return Object.fromEntries(offers.map((offer) => {
    const { salt, side, kind, expiration } = offer;
    const _salt = salt.toString();

    // check if offer has expired
    if (parseInt(expiration.toString()) < getEpoch()) return [
      _salt,
      {
        check: "expiration",
        reason: "Offer expired",
        valid: false
      }
    ]

    const availability = availabilityValidations[_salt];
    const termsValidation = termsValidations[_salt];
    const collateralValidation = collateralValidations[_salt];
    const softCollateralValidation = softCollateralValidations[_salt];

    // check if availability validation failed
    if (!availability) return [
      _salt,
      {
        check: "validation",
        reason: "Availability validation failed",
        valid: false
      }
    ];

    if (!availability.valid) return [
      _salt,
      {
        check: availability.check,
        reason: availability.reason,
        valid: false
      }
    ];

    if (soft) {
      if (side === Side.BID) {
        if (!termsValidation) return [
          _salt,
          {
            check: "validation",
            reason: "Terms validation failed",
            valid: false
          }
        ]

        if (!termsValidation.valid) return [
          _salt,
          {
            check: termsValidation.check,
            reason: termsValidation.reason,
            valid: false
          }
        ]
      }

      if (side === Side.ASK && !soft) {
        if (!collateralValidation) return [
          _salt,
          {
            check: "validation",
            reason: "Collateral validation failed",
            valid: false
          }
        ]

        if (!collateralValidation.valid) return [
          _salt,
          {
            check: collateralValidation.check,
            reason: collateralValidation.reason,
            valid: false
          }
        ]
      }

      if (side === Side.ASK && soft) {
        if (!softCollateralValidation) return [
          _salt,
          {
            check: "validation",
            reason: "Collateral validation failed",
            valid: false
          }
        ]

        if (!softCollateralValidation.valid) return [
          _salt,
          {
            check: softCollateralValidation.check,
            reason: softCollateralValidation.reason,
            valid: false
          }
        ]
      }
    }

    return [
      _salt,
      {
        valid: true
      }
    ]
  }))
}

function checkAvailabilityValidations(
  offers: MarketOffer[],
  _results: ContractCallResults
): MulticallValidation {
  const { results } = _results;

  return Object.fromEntries(offers.map((offer) => {
    const { maker, salt } = offer;
    const _salt = salt.toString();

    const cancelledOrFulfilled = results["kettle-availability"]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === `${maker}-${salt}`.toLowerCase()
        && callReturn.methodName === "cancelledOrFulfilled"
      )
    )?.returnValues[0];

    const nonce = results["kettle-availability"]?.callsReturnContext?.find(
      (callReturn) => equalAddresses(callReturn.reference, maker) && callReturn.methodName === "nonces"
    )?.returnValues[0];

    if (!cancelledOrFulfilled || !nonce) return [
      _salt,
      {
        check: "validation",
        reason: "Availability Validation failed",
        valid: false
      }
    ];

    if (BigNumber.from(cancelledOrFulfilled).eq(1)) return [
      _salt,
      {
        check: "cancelled",
        reason: "Offer cancelled or fulfilled",
        valid: false
      }
    ];

    if (!BigNumber.from(nonce).eq(offer.nonce)) return [
      _salt,
      {
        check: "nonce",
        reason: "Invalid nonce",
        valid: false
      }
    ];

    return [
      _salt,
      {
        valid: true
      }
    ]
  }));
}

function checkCollateralValidations(
  offers: MarketOffer[],
  _results: ContractCallResults
): MulticallValidation {
  const { results } = _results;

  return Object.fromEntries(offers.filter(({ side, soft }) => side == Side.ASK && !soft).map((offer) => {
    const { salt, maker, collateral } = offer;
    const { identifier, collection } = collateral;

    const _salt = salt.toString();

    const approved = results[collection]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === maker.toLowerCase()
        && callReturn.methodName === "isApprovedForAll"
      )
    )?.returnValues[0] ?? null;

    const owner = results[collection]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === identifier.toString()
        && callReturn.methodName === "ownerOf"
      )
    )?.returnValues[0] ?? null;

    if (approved === null || owner === null) return [
      _salt,
      {
        check: "validation",
        reason: "Hard Collateral Validation failed",
        valid: false
      }
    ];

    if (!approved) return [
      _salt,
      {
        check: "approval",
        reason: "Collateral not approved",
        valid: false
      }
    ];

    if (!equalAddresses(owner, maker)) return [
      _salt,
      {
        check: "ownership",
        reason: "Collateral not owned by maker",
        valid: false
      }
    ];

    return [
      _salt,
      {
        valid: true
      }
    ]
  }));
}

function checkSoftCollateralValidations(
  offers: MarketOffer[],
  _results: ContractCallResults
): MulticallValidation {
  const { results } = _results;

  return Object.fromEntries(offers.filter(({ side, soft }) => side == Side.ASK && soft).map((offer) => {
    const { salt, maker, collateral } = offer;
    const { identifier, collection } = collateral;

    const _salt = salt.toString();

    const whitelisted = results["kettle-soft-offer"]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === maker.toLowerCase()
        && callReturn.methodName === "whitelistedAskMakers"
      )
    )?.returnValues[0] ?? null;

    const escrowed = results["kettle-soft-offer"]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === identifier.toString().toLowerCase()
        && callReturn.methodName === "escrowedTokens"
      )
    )?.returnValues[0] ?? null;

    if (whitelisted === null || escrowed === null) return [
      _salt,
      {
        check: "validation",
        reason: "Soft Collateral Validation failed",
        valid: false
      }
    ];

    if (!whitelisted) return [
      _salt,
      {
        check: "whitelisted",
        reason: "Ask maker is not whitelisted",
        valid: false
      }
    ];

    if (escrowed) return [
      _salt,
      {
        check: "already-escrowed",
        reason: "Collateral is already escrowed",
        valid: false
      }
    ];

    return [
      _salt,
      {
        valid: true
      }
    ]
  }));
}

function checkTermsValidations(
  offers: MarketOffer[],
  _results: ContractCallResults
): MulticallValidation {
  const { results } = _results;

  return Object.fromEntries(offers.filter(({ side }) => side == Side.BID).map((offer) => {
    const { salt, maker, terms } = offer;
    const { currency, amount } = terms;

    const _salt = salt.toString();

    const allowance = results[currency]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === maker.toLowerCase()
        && callReturn.methodName === "allowance"
      )
    )?.returnValues[0] ?? null;

    const balance = results[currency]?.callsReturnContext?.find(
      (callReturn) => (
        callReturn.reference === maker.toLowerCase()
        && callReturn.methodName === "balanceOf"
      )
    )?.returnValues[0] ?? null;

    if (allowance === null || balance === null) return [
      offer.salt,
      {
        check: "validation",
        reason: "Offer Terms Validation failed",
        valid: false
      }
    ];

    if (BigNumber.from(allowance).lt(amount)) return [
      _salt,
      {
        check: "allowance",
        reason: "Insufficient allowance",
        valid: false
      }
    ];

    if (BigNumber.from(balance).lt(amount)) return [
      _salt,
      {
        check: "balance",
        reason: "Insufficient balance",
        valid: false
      }
    ];

    return [
      _salt,
      {
        valid: true
      }
    ]
  }));
}

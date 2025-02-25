import { BigNumber } from "@ethersproject/bignumber";
import { createPublicClient, http, MulticallResults } from "viem"
import { base } from "viem/chains"
import { MarketOffer, MulticallValidation, OfferWithHash, Side } from "../types";
import { equalAddresses } from "../utils/equalAddresses";
import { buildViemAvailabilityValidationsContext } from "./viemAvailability";
import { buildViemCollateralValidationsContext } from "./viemCollateralValidations";
import { buildViemSoftCollateralValidationsContext } from "./viemSoftCollateralValidations";
import { buildViemTermsValidationsContext } from "./viemTerms";
import { getEpoch } from "../utils";

export async function validateOffers(
  kettleAddress: `0x${string}`,
  rpcUrl: string,
  offers: OfferWithHash[],
  soft: boolean = true
): Promise<MulticallValidation> {

  const client = createPublicClient({
    batch: { multicall: true },
    chain: base,
    transport: http(rpcUrl)
  })

  // remove duplicate offers
  const uniqueOffers: OfferWithHash[] = offers.filter(
    (offer, index, self) => self.findIndex((o) => o.salt === offer.salt) === index,
  );

  const hardAsks: OfferWithHash[] = uniqueOffers.filter(({ side, soft }) => side == Side.ASK && !soft)
  const softAsks: OfferWithHash[] = uniqueOffers.filter(({ side, soft }) => side == Side.ASK && soft)
  const softBids: OfferWithHash[] = uniqueOffers.filter(({ side }) => side == Side.BID && soft)

  // build context for multicall
  const { cancelledOrFulfilledCalls, noncesCalls } = buildViemAvailabilityValidationsContext(uniqueOffers, kettleAddress)

  const { ownerOfCalls, isApprovedForAllCalls } = soft ? buildViemCollateralValidationsContext(
    hardAsks,
    kettleAddress,
  ) : { ownerOfCalls: [], isApprovedForAllCalls: [] }

  const { whitelistedAskMakersCalls, escrowedTokensCalls } = soft ? buildViemSoftCollateralValidationsContext(
    softAsks,
    kettleAddress
  ) : { whitelistedAskMakersCalls: [], escrowedTokensCalls: [] }

  const { allowanceCalls, balanceOfCalls } = soft ? buildViemTermsValidationsContext(
    softBids,
    kettleAddress,
  ) : { allowanceCalls: [], balanceOfCalls: [] }

  const [
    cancelledOrFulfilledResults, noncesResults,
    ownerOfResults, isApprovedForAllResults,
    whitelistedAskMakersResults, escrowedTokensResults,
    allowResults, balanceOfResults
  ] = await Promise.all([
    client.multicall({ contracts: cancelledOrFulfilledCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }),
    client.multicall({ contracts: noncesCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }),
    soft ? client.multicall({ contracts: ownerOfCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
    soft ? client.multicall({ contracts: isApprovedForAllCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
    soft ? client.multicall({ contracts: whitelistedAskMakersCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
    soft ? client.multicall({ contracts: escrowedTokensCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
    soft ? client.multicall({ contracts: allowanceCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
    soft ? client.multicall({ contracts: balanceOfCalls, multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11" }) : [],
  ]);

  const availabilityValidations = checkAvailabilityValidations(uniqueOffers, cancelledOrFulfilledResults, noncesResults);
  const collateralValidations = soft ? checkCollateralValidations(hardAsks, ownerOfResults, isApprovedForAllResults) : {};
  const softCollateralValidations = soft ? checkSoftCollateralValidations(softAsks, whitelistedAskMakersResults, escrowedTokensResults) : {};
  const termsValidations = soft ? checkTermsValidations(softBids, allowResults, balanceOfResults) : {};

  return Object.fromEntries(offers.map((offer) => {
    const { salt, side, kind, soft: softOffer, expiration } = offer;
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

      if (side === Side.ASK && !softOffer) {
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

      if (side === Side.ASK && softOffer) {
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
  }));
}

function checkAvailabilityValidations(
  offers: MarketOffer[],
  cancelledOrFulfilledResults: any,
  noncesResults: any
): any {

  return Object.fromEntries(
    offers.map((offer, index) => {
      const { salt, nonce } = offer;
      const _salt = salt.toString();

      // Get the corresponding results by index
      const cancelledOrFulfilled = cancelledOrFulfilledResults[index];
      const currentNonce = noncesResults[index];

      // Check for errors in the multicall results
      if (
        cancelledOrFulfilled.status !== "success" ||
        currentNonce.status !== "success"
      ) {
        return [
          _salt,
          {
            check: "validation",
            reason: "Availability validation failed: Error in multicall",
            valid: false
          }
        ];
      }

      // Check if the offer was cancelled or fulfilled
      if (cancelledOrFulfilled.result === 1n) {
        return [
          _salt,
          {
            check: "cancelled",
            reason: "Offer cancelled or fulfilled",
            valid: false
          }
        ];
      }

      // Check if the nonce is valid - convert both to strings for comparison
      const resultNonce = currentNonce.result?.toString() || "";
      const offerNonce = nonce?.toString() || "";

      if (resultNonce !== offerNonce) {
        return [
          _salt,
          {
            check: "nonce",
            reason: "Invalid nonce",
            valid: false
          }
        ];
      }

      // All checks passed
      return [
        _salt,
        {
          valid: true
        }
      ];
    })
  );
}

function checkCollateralValidations(
  offers: MarketOffer[],
  ownerOfResults: MulticallResults,
  isApprovedForAllResults: MulticallResults
): MulticallValidation {

  return Object.fromEntries(offers.map((offer, index) => {
    const { salt, maker } = offer;

    const _salt = salt.toString();

    const approved = isApprovedForAllResults[index]

    const owner = ownerOfResults[index]

    if (approved.status !== "success" || owner.status !== "success") return [
      _salt,
      {
        check: "validation",
        reason: "Hard Collateral Validation failed",
        valid: false
      }
    ];

    if (!approved.result) return [
      _salt,
      {
        check: "approval",
        reason: "Collateral not approved",
        valid: false
      }
    ];

    if (!equalAddresses(owner.result as string, maker)) return [
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
  offers: OfferWithHash[],
  whitelistedAskMakersResults: MulticallResults,
  escrowedTokensResults: MulticallResults
): MulticallValidation {

  return Object.fromEntries(
    offers.map((offer, index) => {
      const { salt, maker, collateral } = offer;
      const { identifier, collection } = collateral;
      const whitelisted = whitelistedAskMakersResults[index];
      const escrowed = escrowedTokensResults[index];

      const _salt = salt.toString();

      if (whitelisted.status !== "success" || escrowed.status !== "success") return [
        _salt,
        {
          check: "validation",
          reason: "Soft Collateral Validation failed",
          valid: false
        }
      ];

      if (!whitelisted.result) return [
        _salt,
        {
          check: "whitelisted",
          reason: "Ask maker is not whitelisted",
          valid: false
        }
      ];

      if (escrowed.result) return [
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
  allowResults: MulticallResults,
  balanceOfResults: MulticallResults
): MulticallValidation {

  return Object.fromEntries(offers.map((offer, index) => {
    const { salt, maker, terms } = offer;
    const { currency, amount } = terms;

    const _salt = salt.toString();

    const allowance = allowResults[index];
    const balance = balanceOfResults[index];

    if (allowance.status !== "success" || balance.status !== "success") return [
      offer.salt,
      {
        check: "validation",
        reason: "Offer Terms Validation failed",
        valid: false
      }
    ];

    if (BigNumber.from(allowance.result).lt(amount)) return [
      _salt,
      {
        check: "allowance",
        reason: "Insufficient allowance",
        valid: false
      }
    ];

    if (BigNumber.from(balance.result).lt(amount)) return [
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

import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall";
import { BigNumber } from "@ethersproject/bignumber";

import { MarketOffer, Side } from "../types";
import { equalAddresses } from "../utils/equalAddresses";

import { buildAvailabilityValidationsContext } from "./availability";
import { buildCollateralValidationsContext } from "./collaterals";
import { buildTermsValidationsContext } from "./terms";

export async function validateMarketOffers(kettleAddress: string, rpcUrl: string, offers: MarketOffer[]) {
  const uniqueOffers = offers.filter(
    (offer, index, self) => self.findIndex((o) => o.salt === offer.salt) === index,
  );

  const multicall = new Multicall({
    multicallCustomContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
    nodeUrl: rpcUrl,
    tryAggregate: true
  });

  const callContext: ContractCallContext[] = [
    ...buildAvailabilityValidationsContext(
      uniqueOffers.map((offer) => ({ maker: offer.maker, salt: offer.salt })),
      kettleAddress,
    ),
    ...buildCollateralValidationsContext(
      uniqueOffers.filter(({ side }) => side == Side.ASK).map((offer) => ({ maker: offer.maker, collateral: offer.collateral })),
      kettleAddress,
    ),
    ...buildTermsValidationsContext(
      uniqueOffers.filter(({ side }) => side == Side.BID).map((offer) => ({ maker: offer.maker, terms: offer.terms })),
      kettleAddress,
    ),
  ];

  const results: ContractCallResults = await multicall.call(callContext);

  return Object.fromEntries(offers.map((offer: MarketOffer) => {
    const { maker, salt } = offer;

    const cancelledOrFulfilled = results.results["kettle"].callsReturnContext.find(
      (callReturn) => (
        callReturn.reference === `${maker}-${salt}`.toLowerCase()
        && callReturn.methodName === "cancelledOrFulfilled"
      )
    )?.returnValues[0];

    const nonce = results.results["kettle"].callsReturnContext.find(
      (callReturn) => equalAddresses(callReturn.reference, maker) && callReturn.methodName === "nonces"
    )?.returnValues[0];

    if (BigNumber.from(cancelledOrFulfilled).eq(1)) return [
      offer.salt,
      {
        reason: "Offer cancelled or fulfilled",
        valid: false
      }
    ];

    if (!BigNumber.from(nonce).eq(offer.nonce)) return [
      offer.salt,
      {
        reason: "Invalid nonce",
        valid: false
      }
    ];

    return [
      offer.salt,
      {
        valid: true
      }
    ]
  }));
}

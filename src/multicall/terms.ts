import { ContractCallContext } from "ethereum-multicall";
import { LoanOffer, LoanOfferTerms, MarketOffer, Numberish, OfferKind } from "../types";

interface TermsMapValue {
  maker: string;
  amount: Numberish;
}

interface TermsMap {
  [currency: string]: TermsMapValue[];
}

export function buildTermsValidationsContext(
  offers: (MarketOffer | LoanOffer)[],
  operator: string
): ContractCallContext[] {

  const currencies = offers.reduce(
    (acc: TermsMap, offer) => {
      const { kind, maker, terms } = offer;
      const { currency } = terms;

      if (!acc[currency]) {
        acc[currency] = [];
      }

      if (kind === OfferKind.LOAN) {
        acc[currency].push({
          maker,
          amount: (terms as LoanOfferTerms).maxAmount
        });
      } else {
        acc[currency].push({
          maker,
          amount: terms.amount
        });
      }

      return acc;
    },
    {}
  );

  return Object.entries(currencies).map(([currency, terms]) => ({
    reference: currency,
    contractAddress: currency,
    abi: [
      {
        name: 'balanceOf',
        stateMutability: 'view',
        type: 'function',
        inputs: [{ type: 'address', name: 'account' }],
        outputs: [{ type: 'uint256', name: 'balance' }]
      },
      {
        name: 'allowance',
        stateMutability: 'view',
        type: 'function',
        inputs: [{ type: 'address', name: 'owner' }, { type: 'address', name: 'spender' }],
        outputs: [{ type: 'uint256', name: 'allowance' }]
      }
    ],
    calls: [
      ...terms.map(({ maker }) => ({
        reference: maker.toLowerCase(),
        methodName: 'allowance',
        methodParameters: [maker, operator]
      })),
      ...terms.map(({ maker }) => ({
        reference: maker.toLowerCase(),
        methodName: 'balanceOf',
        methodParameters: [maker]
      })),
    ]
  }));
}

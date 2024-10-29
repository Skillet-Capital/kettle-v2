import { ContractCallContext } from "ethereum-multicall";
import { GenericOfferTerms, Numberish } from "../types";

interface OfferTerms {
  maker: string;
  terms: GenericOfferTerms;
}

interface TermsMapValue {
  maker: string;
  amount: Numberish;
}

interface TermsMap {
  [currency: string]: TermsMapValue[];
}

export function buildTermsValidationsContext(
  terms: OfferTerms[],
  operator: string
): ContractCallContext[] {

  const currencies = terms.reduce(
    (acc: TermsMap, _terms) => {
      const { maker, terms } = _terms;
      const { currency, amount } = terms;

      if (!acc[currency]) {
        acc[currency] = [];
      }

      acc[currency].push({
        maker,
        amount,
      });

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
        reference: maker,
        methodName: 'allowance',
        methodParameters: [maker, operator]
      })),
      ...terms.map(({ maker }) => ({
        reference: maker,
        methodName: 'balanceOf',
        methodParameters: [maker]
      })),
    ]
  }));
}

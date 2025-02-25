import { LoanOffer, LoanOfferTerms, MarketOffer, Numberish, OfferKind } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface TermsContextResult {
  balanceOfCalls: ContractFunctionParameters[];
  allowanceCalls: ContractFunctionParameters[];
}

interface TermsMapValue {
  maker: string;
  amount: Numberish;
}

interface TermsMap {
  [currency: string]: TermsMapValue[];
}

export function buildViemTermsValidationsContext(
  offers: (MarketOffer | LoanOffer)[],
  operator: string
): TermsContextResult {

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

  const abi: Abi = [
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
  ]

  const result: TermsContextResult = {
    balanceOfCalls: [],
    allowanceCalls: []
  }

  Object.entries(currencies).map(([currency, terms]) => {
    return terms.map(({ maker }) => {
      result.balanceOfCalls.push({
        address: currency as `0x${string}`,
        abi,
        functionName: "balanceOf",
        args: [maker]
      })
      result.allowanceCalls.push({
        address: currency as `0x${string}`,
        abi,
        functionName: "allowance",
        args: [maker, operator]
      })
    })
  })

  return result
}

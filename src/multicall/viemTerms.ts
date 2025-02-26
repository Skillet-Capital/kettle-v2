import { LoanOffer, MarketOffer } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface TermsContextResult {
  balanceOfCalls: ContractFunctionParameters[];
  allowanceCalls: ContractFunctionParameters[];
}

export function buildViemTermsValidationsContext(
  offers: (MarketOffer | LoanOffer)[],
  operator: string
): TermsContextResult {

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

  offers.reduce<TermsContextResult>((acc, offer) => {
    acc.balanceOfCalls.push({
      address: offer.terms.currency as `0x${string}`,
      abi,
      functionName: "balanceOf",
      args: [offer.maker]
    })
    acc.allowanceCalls.push({
      address: offer.terms.currency as `0x${string}`,
      abi,
      functionName: "allowance",
      args: [offer.maker, operator]
    })
    return acc;
  }, result)

  return result
}

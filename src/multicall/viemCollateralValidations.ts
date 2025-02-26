import { OfferWithHash } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface CollateralContextResult {
  ownerOfCalls: ContractFunctionParameters[];
  isApprovedForAllCalls: ContractFunctionParameters[];
}

export function buildViemCollateralValidationsContext(
  offers: OfferWithHash[],
  operator: `0x${string}`
): CollateralContextResult {

  const abi: Abi = [
    {
      name: 'ownerOf',
      stateMutability: 'view',
      type: 'function',
      inputs: [{ type: 'uint256', name: 'tokenId' }],
      outputs: [{ type: 'address', name: 'owner' }]
    },
    {
      name: 'isApprovedForAll',
      stateMutability: 'view',
      type: 'function',
      inputs: [{ type: 'address', name: 'owner' }, { type: 'address', name: 'operator' }],
      outputs: [{ type: 'bool', name: 'approved' }]
    }
  ]

  const result: CollateralContextResult = {
    ownerOfCalls: [],
    isApprovedForAllCalls: []
  }

  offers.reduce<CollateralContextResult>((acc, offer) => {
    acc.ownerOfCalls.push({
      address: offer.collateral.collection as `0x${string}`,
      abi,
      functionName: "ownerOf",
      args: [offer.collateral.identifier]
    })
    acc.isApprovedForAllCalls.push({
      address: offer.collateral.collection as `0x${string}`,
      abi,
      functionName: "isApprovedForAll",
      args: [offer.maker, operator]
    })
    return acc;
  }, result)

  return result;
}

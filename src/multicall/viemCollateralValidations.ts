import { OfferWithHash } from "../types";
import { LoanOffer, MarketOffer, Numberish } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface CollateralContextResult {
  ownerOfCalls: ContractFunctionParameters[];
  isApprovedForAllCalls: ContractFunctionParameters[];
}

interface CollateralMapValue {
  maker: string;
  identifier: Numberish;
}

interface CollateralMap {
  [collection: string]: CollateralMapValue[];
}

export function buildViemCollateralValidationsContext(
  offers: OfferWithHash[],
  operator: `0x${string}`
): CollateralContextResult {

  const collections = offers.reduce<CollateralMap>(
    (acc: CollateralMap, offer) => {
      const { maker, collateral } = offer;
      const { collection, identifier } = collateral;

      if (!acc[collection]) {
        acc[collection] = [];
      }

      acc[collection].push({
        maker,
        identifier,
      });

      return acc;
    },
    {}
  );

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

  Object.entries(collections).map(([collection, collaterals]) => {
    return collaterals.map(({ maker, identifier }) => {
      result.ownerOfCalls.push({
        address: collection as `0x${string}`,
        abi,
        functionName: "ownerOf",
        args: [identifier]
      })
      result.isApprovedForAllCalls.push({
        address: collection as `0x${string}`,
        abi,
        functionName: "isApprovedForAll",
        args: [maker, operator]
      })
    })
  })

  return result;
}
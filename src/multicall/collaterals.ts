import { ContractCallContext } from "ethereum-multicall";
import { LoanOffer, MarketOffer, Numberish } from "../types";

interface CollateralMapValue {
  maker: string;
  identifier: Numberish;
}

interface CollateralMap {
  [collection: string]: CollateralMapValue[];
}

export function buildCollateralValidationsContext(
  offers: (MarketOffer | LoanOffer)[],
  operator: string
): ContractCallContext[] {

  const collections = offers.reduce(
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

  return Object.entries(collections).map(([collection, collaterals]) => ({
    reference: collection,
    contractAddress: collection,
    abi: [
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
    ],
    calls: [
      ...collaterals.map(({ maker }) => ({
        reference: maker.toLowerCase(),
        methodName: 'isApprovedForAll',
        methodParameters: [maker, operator]
      })),
      ...collaterals.map(({ identifier }) => ({
        reference: identifier.toString(),
        methodName: 'ownerOf',
        methodParameters: [identifier]
      }))
    ]
  }));
}

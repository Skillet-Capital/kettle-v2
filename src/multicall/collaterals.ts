import { ContractCallContext } from "ethereum-multicall";
import { CollateralTerms, Criteria, Numberish } from "../types";

interface OfferCollateral {
  maker: string;
  collateral: CollateralTerms;
}

interface CollateralMapValue {
  maker: string;
  criteria: Criteria;
  identifier: Numberish;
}

interface CollateralMap {
  [collection: string]: CollateralMapValue[];
}

export function buildCollateralValidationsContext(
  collaterals: OfferCollateral[],
  operator: string
): ContractCallContext[] {

  const collections = collaterals.reduce(
    (acc: CollateralMap, _collateral) => {
      const { maker, collateral } = _collateral;
      const { collection, identifier, criteria } = collateral;

      if (!acc[collection]) {
        acc[collection] = [];
      }

      acc[collection].push({
        maker,
        identifier,
        criteria
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
        reference: maker,
        methodName: 'isApprovedForAll',
        methodParameters: [maker, operator]
      })),
      ...collaterals.filter(({ criteria }) => criteria === Criteria.SIMPLE).map(({ identifier }) => ({
        reference: identifier.toString(),
        methodName: 'ownerOf',
        methodParameters: [identifier]
      }))
    ]
  }));
}

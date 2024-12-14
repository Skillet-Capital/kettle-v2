import { ContractCallContext } from "ethereum-multicall";
import { OfferWithHash } from "../types";

export function buildSoftCollateralValidationsContext(
  offers: OfferWithHash[],
  kettleAddress: string
): ContractCallContext[] {

  return [{
    reference: "kettle-soft-offer",
    contractAddress: kettleAddress,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "whitelistedAskMakers",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "escrowedTokens",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    calls: [
      ...offers.map(
        (offer) => ({
          reference: offer.maker.toLowerCase(),
          methodName: "whitelistedAskMakers",
          methodParameters: [offer.maker]
        })
      ),
      ...offers.map(
        (offer) => ({
          reference: offer.collateral.identifier.toString().toLowerCase(),
          methodName: "escrowedTokens",
          methodParameters: [offer.collateral.identifier]
        })
      )
    ]
  }]
}

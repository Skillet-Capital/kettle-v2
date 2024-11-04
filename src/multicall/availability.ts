import { ContractCallContext } from "ethereum-multicall";
import { OfferWithHash } from "../types";

export function buildAvailabilityValidationsContext(
  offers: OfferWithHash[],
  kettleAddress: string
): ContractCallContext[] {

  return [{
    reference: "kettle-availability",
    contractAddress: kettleAddress,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "cancelledOrFulfilled",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "nonces",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    calls: [
      ...offers.map(
        (offer) => ({
          reference: `${offer.maker}-${offer.salt}`.toLowerCase(),
          methodName: "cancelledOrFulfilled",
          methodParameters: [offer.maker, offer.salt]
        }),
      ),
      ...offers.map(
        (offer) => ({
          reference: offer.maker,
          methodName: "nonces",
          methodParameters: [offer.maker]
        }),
      )
    ]
  }]
}

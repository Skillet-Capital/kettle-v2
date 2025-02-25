import { OfferWithHash } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface AvailabilityContextResult {
  cancelledOrFulfilledCalls: ContractFunctionParameters[];
  noncesCalls: ContractFunctionParameters[];
}

export function buildViemAvailabilityValidationsContext(
  offers: OfferWithHash[],
  kettleAddress: `0x${string}`
): AvailabilityContextResult {
  const abi: Abi = [
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
    ]

  return offers.reduce<AvailabilityContextResult>((acc, offer) => {
    acc.cancelledOrFulfilledCalls.push({
      address: kettleAddress,
      abi,
      functionName: "cancelledOrFulfilled",
      args: [offer.maker, offer.salt]
    })
    acc.noncesCalls.push({
      address: kettleAddress,
      abi,
      functionName: "nonces",
      args: [offer.maker]
    })
    return acc
  }, { cancelledOrFulfilledCalls: [], noncesCalls: [] })
}

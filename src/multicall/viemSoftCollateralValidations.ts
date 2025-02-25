import { OfferWithHash } from "../types";
import { Abi, ContractFunctionParameters } from "viem";

interface SoftValidationContextResult {
  whitelistedAskMakersCalls: ContractFunctionParameters[];
  escrowedTokensCalls: ContractFunctionParameters[];
}

export function buildViemSoftCollateralValidationsContext(
  offers: OfferWithHash[],
  kettleAddress: `0x${string}`
): SoftValidationContextResult {

  const abi: Abi = [
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
  ]

  return offers.reduce<SoftValidationContextResult>((acc, offer) => {
    acc.whitelistedAskMakersCalls.push({
      address: kettleAddress,
      abi,
      functionName: "whitelistedAskMakers",
      args: [offer.maker]
    })
    acc.escrowedTokensCalls.push({
      address: kettleAddress,
      abi,
      functionName: "escrowedTokens",
      args: [offer.collateral.identifier]
    })
    return acc
  }, { whitelistedAskMakersCalls: [], escrowedTokensCalls: [] })
}

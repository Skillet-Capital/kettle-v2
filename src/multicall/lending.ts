import { ContractCallContext } from "ethereum-multicall";
import { OfferWithHash } from "../types";

export function buildAmountTakenContext(
  offers: OfferWithHash[],
  kettleAddress: string
): ContractCallContext[] {

  return [{
    reference: "kettle-amount-taken",
    contractAddress: kettleAddress,
    abi: [
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "amountTaken",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
      }
    ],
    calls: offers.map(
      (offer) => ({
        reference: offer.hash,
        methodName: "amountTaken",
        methodParameters: [offer.hash]
      })
    )
  }]
}

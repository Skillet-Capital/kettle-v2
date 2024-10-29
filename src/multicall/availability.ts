import { ContractCallContext } from "ethereum-multicall";

interface OfferCancellationFulfillmentNonce {
  maker: string;
  salt: string | number | bigint;
}

export function buildAvailabilityValidationsContext(
  contexts: OfferCancellationFulfillmentNonce[],
  kettleAddress: string
): ContractCallContext[] {

  return [{
    reference: "kettle",
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
      ...contexts.map(
        (_context) => ({
          reference: `${_context.maker}-${_context.salt}`.toLowerCase(),
          methodName: "cancelledOrFulfilled",
          methodParameters: [_context.maker, _context.salt]
        }),
      ),
      ...contexts.map(
        (_context) => ({
          reference: _context.maker,
          methodName: "nonces",
          methodParameters: [_context.maker]
        }),
      )
    ]
  }]
}

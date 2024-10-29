import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

export function formatCollateralId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toString()].join("/");
}

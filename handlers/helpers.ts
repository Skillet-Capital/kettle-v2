import { Address, BigInt } from "@graphprotocol/graph-ts"

export function formatCollateralId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toString()].join("/");
}

export function formatLienId(address: Address, lienId: BigInt): string {
  return [address.toHexString(), lienId.toString()].join("-");
}

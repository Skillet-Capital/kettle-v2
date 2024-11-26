import { Address, BigInt } from "@graphprotocol/graph-ts"

export function formatPlaceholderId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toHexString()].join("/");
}

export function formatCollateralId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toString()].join("/");
}

export function formatLienId(address: Address, lienId: BigInt): string {
  return [address.toHexString(), lienId.toString()].join("-");
}

export function formatEscrowId(address: Address, escrowId: BigInt): string {
  return [address.toHexString(), escrowId.toString()].join("-");
}

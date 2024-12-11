import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

function padTo32Bytes(hexString: string): string {
  return hexString.padStart(64, '0');
}

export function formatPlaceholder(placeholder: BigInt): Bytes {
  // Convert BigInt to a hexadecimal string
  let hexString = placeholder.toHexString().replace('0x', '');
  let paddedHexString = '0x' + hexString.padStart(64, '0');

  // Convert the padded string to Bytes
  return Bytes.fromHexString(paddedHexString);
}

export function formatPlaceholderId(collection: Address, placeholder: BigInt): string {
  const formattedPlaceholder = formatPlaceholder(placeholder);

  return [collection.toHexString(), formattedPlaceholder.toHexString()].join("/");
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

export function calculateFeeAmount(amount: BigInt, fee: BigInt): BigInt {
  return amount.times(fee).div(BigInt.fromI32(10000));
}

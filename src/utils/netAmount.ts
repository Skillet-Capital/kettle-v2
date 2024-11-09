import { BASIS_POINTS_DIVISOR } from "../constants";

function mulFee(amount: bigint | string | number, rate: bigint | string | number) {
  return BigInt(amount) * BigInt(rate) / BASIS_POINTS_DIVISOR;
}

export function calculateNetAmount(amount: bigint | string | number, rate: bigint | string | number) {
  return BigInt(amount) - mulFee(amount, rate);
}

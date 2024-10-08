import { Numberish } from "../types";

export function getEpoch() {
  return Math.floor(Date.now() / 1000);
}

export function offerExpired(expiration: Numberish) {
  return getEpoch() > Number(expiration);
}

export function lienDefaulted(startTime: Numberish, duration: Numberish, gracePeriod: Numberish) {
  return getEpoch() > Number(startTime) + Number(duration) + Number(gracePeriod);
}

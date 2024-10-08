import { Numberish } from "../types";
export declare function getEpoch(): number;
export declare function offerExpired(expiration: Numberish): boolean;
export declare function lienDefaulted(startTime: Numberish, duration: Numberish, gracePeriod: Numberish): boolean;

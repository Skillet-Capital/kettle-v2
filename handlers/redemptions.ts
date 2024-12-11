import { 
  Redemption as RedemptionEvent
} from "../generated/Kettle/Kettle"

import {
  Redemption
} from "../generated/schema"

import { formatCollateralId } from "./helpers";

export function handleRedemption(event: RedemptionEvent): void {
  const redemption = new Redemption(event.params.redemptionHash.toHexString());
  redemption.redemptionHash = event.params.redemptionHash;
  redemption.redeemer = event.params.redeemer;
  redemption.collection = event.params.collection;
  redemption.tokenId = event.params.tokenId;
  redemption.currency = event.params.currency;
  redemption.amount = event.params.amount;
  redemption.timestamp = event.block.timestamp;
  redemption.collateralId = formatCollateralId(event.params.collection, event.params.tokenId);
  redemption.save();
}

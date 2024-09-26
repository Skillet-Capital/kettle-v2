import { Addressable } from "ethers";
import { Kettle as KettleContract } from "../typechain-types";

import { Kettle__factory } from "../typechain-types";
import { LienStruct } from "../typechain-types/contracts/Kettle";

export type { 
  KettleContract,
  LienStruct
};

export {
  Kettle__factory
};

export type Numberish = string | number | bigint;

// ==============================================
//                INTERNAL TYPES
// ==============================================

export enum Side { BID, ASK };
export enum Criteria { SIMPLE, PROOF };

export type CollateralTerms = {
  criteria: number | string | bigint;
  collection: string;
  identifier: string | number | bigint;
}

export type FeeTerms = {
  recipient: string;
  rate: string | number | bigint;
}

export type GenericOfferTerms = {
  currency: string;
  amount: string | number | bigint;
}

export type MarketOfferTerms = {
  currency: string;
  amount: string | number | bigint;
  withLoan: boolean;
  borrowAmount: string | number | bigint;
  loanOfferHash: string;
  rebate: string | number | bigint;
}

export type LoanOfferTerms = {
  currency: string;
  amount: string | number | bigint;
  maxAmount: string | number | bigint;
  minAmount: string | number | bigint;
  rate: string | number | bigint;
  defaultRate: string | number | bigint;
  duration: string | number | bigint;
  gracePeriod: string | number | bigint;
}

export type MarketOffer = {
  side: Side;
  maker: string;
  taker: string;
  collateral: CollateralTerms;
  terms: MarketOfferTerms;
  fee: FeeTerms;
  expiration: string | number | bigint;
  salt: string | number | bigint;
  nonce: string | number | bigint;
}

export type LoanOffer = {
  side: Side;
  maker: string;
  taker: string;
  collateral: CollateralTerms;
  terms: LoanOfferTerms;
  fee: FeeTerms;
  expiration: string | number | bigint;
  salt: string | number | bigint;
  nonce: string | number | bigint;
}

export type Lien = {
  borrower: string;
  collection: string;
  tokenId: string;
  currency: string;
  principal: Numberish;
  rate: Numberish;
  defaultRate: Numberish;
  duration: Numberish;
  gracePeriod: Numberish;
  recipient: string;
  fee: Numberish;
  startTime: Numberish;
}

// ==============================================
//                INPUT TYPES
// ==============================================

export type CreateMarketOfferInput = {
  side: Side;
  taker?: string | Addressable;
  criteria?: number | string | bigint;
  collection: string | Addressable;
  identifier: string | number | bigint;
  currency: string | Addressable;
  amount: string | number | bigint;
  fee: string | number | bigint;
  recipient: string | Addressable;
  expiration: string | number | bigint;
  rebate?: string | number | bigint;
}

export type CreateLoanOfferInput = {
  side: Side;
  taker?: string | Addressable;
  criteria?: number | string | bigint;
  collection: string | Addressable;
  identifier: string | number | bigint;
  currency: string | Addressable;
  amount: string | number | bigint;
  minAmount?: string | number | bigint;
  maxAmount?: string | number | bigint;
  rate: string | number | bigint;
  defaultRate: string | number | bigint;
  duration: string | number | bigint;
  gracePeriod: string | number | bigint
  fee: string | number | bigint;
  recipient: string | Addressable;
  expiration: string | number | bigint;
}

// ==============================================
//                OUTPUT TYPES
// ==============================================

export type OfferWithSignature = {
  offer: LoanOffer | MarketOffer;
  signature: string;
}

export type CurrentDebt = {
  debt: Numberish;
  interest: Numberish;
  fee: Numberish;
}

// ==============================================
//                ACTION TYPES
// ==============================================

export type ApprovalAction = {
  type: "approval";
  approve: () => Promise<string | null>;
}

export type CreateOfferAction = {
  type: "create";
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  create: () => Promise<OfferWithSignature>;
}

export type TakeOfferAction = {
  type: "take";
  // payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  take: () => Promise<string>;
}

export type RepayAction = {
  type: "repay";
  repay: () => Promise<string>;
}

export type ClaimAction = {
  type: "claim";
  claim: () => Promise<string>;
}


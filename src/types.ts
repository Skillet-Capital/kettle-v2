import { Addressable, Signer, JsonRpcSigner, TypedDataField } from "ethers";

import { 
  KettleV2 as KettleContract,
  KettleV2__factory,
  TestERC20__factory,
  TestERC721__factory,
} from "../typechain-types";

import { EscrowStruct } from "../typechain-types/contracts/Kettle";

export type {
  KettleContract,
  EscrowStruct
};

export {
  KettleV2__factory as Kettle__factory,
  TestERC20__factory,
  TestERC721__factory
};

export type Numberish = string | number | bigint;

// ==============================================
//                INTERNAL TYPES
// ==============================================

export enum OfferKind { LOAN, MARKET };
export enum Side { BID, ASK };
export enum Criteria { SIMPLE, PROOF };

export type CollateralTerms = {
  criteria: Criteria;
  collection: string;
  identifier: Numberish;
}

export type FeeTerms = {
  recipient: string;
  rate: Numberish;
}

export type GenericOfferTerms = {
  currency: string;
  amount: Numberish;
  rebate?: Numberish;
}

export type MarketOfferTerms = {
  currency: string;
  amount: Numberish;
  rebate: Numberish;
}

export type LoanOfferTerms = {
  currency: string;
  amount: Numberish;
  maxAmount: Numberish;
  minAmount: Numberish;
  rate: Numberish;
  defaultRate: Numberish;
  duration: Numberish;
  gracePeriod: Numberish;
}

export type MarketOffer = {
  kind: OfferKind.MARKET;
  soft: boolean;
  side: Side;
  maker: string;
  taker: string;
  collateral: CollateralTerms;
  terms: MarketOfferTerms;
  fee: FeeTerms;
  expiration: Numberish;
  salt: Numberish;
  nonce: Numberish;
}

export type LoanOffer = {
  kind: OfferKind.LOAN;
  soft: boolean;
  side: Side;
  maker: string;
  taker: string;
  collateral: CollateralTerms;
  terms: LoanOfferTerms;
  fee: FeeTerms;
  expiration: Numberish;
  salt: Numberish;
  nonce: Numberish;
}

export type Permit = {
  taker: string;
  currency: string;
  amount: Numberish;
  offerHash: string;
  expiration: Numberish;
  salt: string;
  nonce: Numberish;
}

export type Lien = {
  borrower: string;
  collection: string;
  tokenId: Numberish;
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

export type Escrow = {
  placeholder: string;
  buyer: string;
  seller: string;
  collection: string;
  identifier: Numberish;
  currency: string;
  amount: Numberish;
  fee: Numberish;
  recipient: string;
  rebate: Numberish;
  redemptionHash: string;
  withRedemption: boolean;
  redemptionCharge: string;
  timestamp: Numberish;
  lockTime: Numberish;
}

export type LienWithLender = {
  lender: string;
  borrower: string;
  collection: string;
  tokenId: Numberish;
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

export type OfferWithHash = (MarketOffer) & { hash: string };

// ==============================================
//                INPUT TYPES
// ==============================================

export type CreateMarketOfferInput = {
  soft?: boolean;
  side: Side;
  taker?: string | Addressable;
  criteria?: Criteria;
  collection: string | Addressable;
  identifier: Numberish;
  currency: string | Addressable;
  amount: Numberish;
  fee: Numberish;
  recipient: string | Addressable;
  expiration: Numberish;
  rebate?: Numberish;
  lien?: LienWithLender;
  salt?: Numberish;
}

export type CreateLoanOfferInput = {
  soft?: boolean;
  side: Side;
  taker?: string | Addressable;
  criteria?: Criteria;
  collection: string | Addressable;
  identifier: Numberish;
  currency: string | Addressable;
  amount: Numberish;
  minAmount?: Numberish;
  maxAmount?: Numberish;
  rate: Numberish;
  defaultRate: Numberish;
  duration: Numberish;
  gracePeriod: Numberish
  fee: Numberish;
  recipient: string | Addressable;
  expiration: Numberish;
  lien?: LienWithLender;
  salt?: Numberish;
}

export type TakeOfferInput = {
  softBid?: boolean;
  tokenId?: Numberish;
  taker?: string;
  amount?: Numberish;
  offer: MarketOffer | LoanOffer;
  signature: string;
  proof?: string[];
  lienId?: Numberish;
  lien?: Lien;
  redemptionCharge?: RedemptionCharge;
  redemptionChargeSignature?: string;
}

export type ValidateTakeOfferInput = {
  softBid?: boolean;
  tokenId: Numberish;
  amount?: Numberish;
  offer: MarketOffer | LoanOffer;
  lien?: Lien;
}

// ==============================================
//                OUTPUT TYPES
// ==============================================

export type UserOp = {
  to: string;
  data: string;
}

export type OfferWithSignature = {
  offer: LoanOffer | MarketOffer;
  signature: string;
}

export type PermitWithSignature = {
  permit: Permit;
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

export type Payload = {
  types: Record<string, TypedDataField[]>,
  domain: {
    readonly name: string | undefined;
    readonly version: string | undefined;
    readonly chainId: number | undefined;
    readonly verifyingContract: string | `0x${string}`;
  };
  primaryType: string;
  message: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum StepAction { SEND, SIGN };

export type GenericStep = {
  action: StepAction;
  type: string;
}

export type SendStep = GenericStep & {
  action: StepAction.SEND;
  type: `approve-${string}` | `take-${string}` | `repay-${string}` | `escrow-${string}` | `claim-${string}` | `cancel-${string}` | `redeem${string}` | `${string}-escrow`;
  userOp: UserOp;
  send: (signer: Signer | JsonRpcSigner) => Promise<string>;
}

export type SignStep = GenericStep & {
  action: StepAction.SIGN;
  type: "sign-offer",
  offer: MarketOffer | LoanOffer;
  payload: Payload;
  sign: (signer: Signer | JsonRpcSigner) => Promise<OfferWithSignature>;
}

// ==============================================
//               VALIDATION TYPES
// ==============================================

export type Validation = {
  check?: 
    | "validation"
    | "cancelled" 
    | "nonce" 
    | "balance" 
    | "allowance" 
    | "ownership" 
    | "approval" 
    | "debt-covers-ask" 
    | "loan-max-amount"
    | "whitelisted-ask-maker"
    | "whitelisted-bid-taker"
    | "escrow-exists"
  valid: boolean;
  reason?: string;
}

export type MulticallValidation = {
  [salt: string]: Validation;
}

// ==============================================
//            REDEMPTION MANAGER TYPES
// ==============================================

export type Asset = {
  collection: Addressable;
  tokenId: Numberish;
}

export type RedemptionCharge = {
  redeemer: string,
  collection: string,
  tokenId: Numberish,
  currency: string,
  amount: Numberish,
  expiration: Numberish,
  salt: Numberish,
  nonce: Numberish,
}

export type ChargeWithSignature = {
  charge: RedemptionCharge;
  signature: string;
}

export type RedemptionSignStep = GenericStep & {
  action: StepAction.SIGN;
  type: "sign-redemption-charge",
  charge: RedemptionCharge;
  payload: Payload;
  sign: (signer: Signer | JsonRpcSigner) => Promise<ChargeWithSignature>;
}

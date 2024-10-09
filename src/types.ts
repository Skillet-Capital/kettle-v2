import { Addressable, Signer, JsonRpcSigner, TypedDataField } from "ethers";

import { 
  Kettle as KettleContract, 
  EscrowController, 
  LendingController,
  Kettle__factory,
  EscrowController__factory,
  LendingController__factory
} from "../typechain-types";

import { LienStruct } from "../typechain-types/contracts/LendingController";
import { EscrowStruct } from "../typechain-types/contracts/EscrowController";

import { TestERC20__factory, TestERC721__factory } from "../typechain-types";

export type {
  KettleContract,
  EscrowController,
  LendingController,
  LienStruct,
  EscrowStruct
};

export {
  Kettle__factory,
  EscrowController__factory,
  LendingController__factory,
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
  rebate?: string | number | bigint;
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
  kind: OfferKind.MARKET;
  soft: boolean;
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
  kind: OfferKind.LOAN;
  soft: boolean;
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

// ==============================================
//                INPUT TYPES
// ==============================================

export type CreateMarketOfferInput = {
  soft?: boolean;
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
  lien?: LienWithLender;
}

export type CreateLoanOfferInput = {
  soft?: boolean;
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

export type TakeOfferInput = {
  tokenId?: Numberish;
  amount?: Numberish;
  offer: MarketOffer | LoanOffer;
  signature: string;
  proof?: string[];
  lienId?: Numberish;
  lien?: Lien;
}

// ==============================================
//                OUTPUT TYPES
// ==============================================

export type UserOp = {
  target: string;
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
    readonly name: string;
    readonly version: string;
    readonly chainId: number | string;
    readonly verifyingContract: string;
  }
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
  userOp: UserOp;
  send: (signer: Signer | JsonRpcSigner) => Promise<string>;
}

export type SignStep = GenericStep & {
  action: StepAction.SIGN;
  offer: MarketOffer | LoanOffer;
  payload: Payload;
  sign: (signer: Signer | JsonRpcSigner) => Promise<OfferWithSignature>;
}

// ==============================================
//               VALIDATION TYPES
// ==============================================

export type Validation = {
  check: "cancelled" | "nonce" | "balance" | "allowance" | "ownership" | "approval" | "debt-covers-ask" | "loan-max-amount"
  valid: boolean;
  reason?: string;
}

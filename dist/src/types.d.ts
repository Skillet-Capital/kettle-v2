import { Addressable, Signer, JsonRpcSigner, TypedDataField } from "ethers";
import { Kettle as KettleContract, EscrowController, LendingController, Kettle__factory, EscrowController__factory, LendingController__factory } from "../typechain-types";
import { LienStruct } from "../typechain-types/contracts/LendingController";
import { EscrowStruct } from "../typechain-types/contracts/EscrowController";
import { TestERC20__factory, TestERC721__factory } from "../typechain-types";
export type { KettleContract, EscrowController, LendingController, LienStruct, EscrowStruct };
export { Kettle__factory, EscrowController__factory, LendingController__factory, TestERC20__factory, TestERC721__factory };
export type Numberish = string | number | bigint;
export declare enum OfferKind {
    LOAN = 0,
    MARKET = 1
}
export declare enum Side {
    BID = 0,
    ASK = 1
}
export declare enum Criteria {
    SIMPLE = 0,
    PROOF = 1
}
export type CollateralTerms = {
    criteria: Criteria;
    collection: string;
    identifier: Numberish;
};
export type FeeTerms = {
    recipient: string;
    rate: Numberish;
};
export type GenericOfferTerms = {
    currency: string;
    amount: Numberish;
    rebate?: Numberish;
};
export type MarketOfferTerms = {
    currency: string;
    amount: Numberish;
    rebate: Numberish;
};
export type LoanOfferTerms = {
    currency: string;
    amount: Numberish;
    maxAmount: Numberish;
    minAmount: Numberish;
    rate: Numberish;
    defaultRate: Numberish;
    duration: Numberish;
    gracePeriod: Numberish;
};
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
};
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
};
export type Permit = {
    taker: string;
    currency: string;
    amount: Numberish;
    offerHash: string;
    expiration: Numberish;
    salt: string;
    nonce: Numberish;
};
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
};
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
};
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
};
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
};
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
    gracePeriod: Numberish;
    fee: Numberish;
    recipient: string | Addressable;
    expiration: Numberish;
    lien?: LienWithLender;
};
export type TakeOfferInput = {
    tokenId?: Numberish;
    amount?: Numberish;
    offer: MarketOffer | LoanOffer;
    signature: string;
    proof?: string[];
    lienId?: Numberish;
    lien?: Lien;
};
export type ValidateTakeOfferInput = {
    tokenId: Numberish;
    amount?: Numberish;
    offer: MarketOffer | LoanOffer;
    lien?: Lien;
};
export type UserOp = {
    to: string;
    data: string;
};
export type OfferWithSignature = {
    offer: LoanOffer | MarketOffer;
    signature: string;
};
export type PermitWithSignature = {
    permit: Permit;
    signature: string;
};
export type CurrentDebt = {
    debt: Numberish;
    interest: Numberish;
    fee: Numberish;
};
export type Payload = {
    types: Record<string, TypedDataField[]>;
    domain: {
        readonly name: string | undefined;
        readonly version: string | undefined;
        readonly chainId: number | undefined;
        readonly verifyingContract: string | `0x${string}`;
    };
    primaryType: string;
    message: Record<string, any>;
};
export declare enum StepAction {
    SEND = 0,
    SIGN = 1
}
export type GenericStep = {
    action: StepAction;
    type: string;
};
export type SendStep = GenericStep & {
    action: StepAction.SEND;
    type: `approve-${string}` | `take-${string}` | `repay-${string}` | `escrow-${string}` | `claim-${string}`;
    userOp: UserOp;
    send: (signer: Signer | JsonRpcSigner) => Promise<string>;
};
export type SignStep = GenericStep & {
    action: StepAction.SIGN;
    type: "sign-offer";
    offer: MarketOffer | LoanOffer;
    payload: Payload;
    sign: (signer: Signer | JsonRpcSigner) => Promise<OfferWithSignature>;
};
export type Validation = {
    check: "cancelled" | "nonce" | "balance" | "allowance" | "ownership" | "approval" | "debt-covers-ask" | "loan-max-amount";
    valid: boolean;
    reason?: string;
};

import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../common";
export type CollateralStruct = {
    criteria: BigNumberish;
    collection: AddressLike;
    identifier: BigNumberish;
};
export type CollateralStructOutput = [
    criteria: bigint,
    collection: string,
    identifier: bigint
] & {
    criteria: bigint;
    collection: string;
    identifier: bigint;
};
export type LoanOfferTermsStruct = {
    currency: AddressLike;
    amount: BigNumberish;
    maxAmount: BigNumberish;
    minAmount: BigNumberish;
    rate: BigNumberish;
    defaultRate: BigNumberish;
    duration: BigNumberish;
    gracePeriod: BigNumberish;
};
export type LoanOfferTermsStructOutput = [
    currency: string,
    amount: bigint,
    maxAmount: bigint,
    minAmount: bigint,
    rate: bigint,
    defaultRate: bigint,
    duration: bigint,
    gracePeriod: bigint
] & {
    currency: string;
    amount: bigint;
    maxAmount: bigint;
    minAmount: bigint;
    rate: bigint;
    defaultRate: bigint;
    duration: bigint;
    gracePeriod: bigint;
};
export type FeeTermsStruct = {
    recipient: AddressLike;
    rate: BigNumberish;
};
export type FeeTermsStructOutput = [recipient: string, rate: bigint] & {
    recipient: string;
    rate: bigint;
};
export type LoanOfferStruct = {
    kind: BigNumberish;
    soft: boolean;
    side: BigNumberish;
    maker: AddressLike;
    taker: AddressLike;
    collateral: CollateralStruct;
    terms: LoanOfferTermsStruct;
    fee: FeeTermsStruct;
    expiration: BigNumberish;
    salt: BigNumberish;
};
export type LoanOfferStructOutput = [
    kind: bigint,
    soft: boolean,
    side: bigint,
    maker: string,
    taker: string,
    collateral: CollateralStructOutput,
    terms: LoanOfferTermsStructOutput,
    fee: FeeTermsStructOutput,
    expiration: bigint,
    salt: bigint
] & {
    kind: bigint;
    soft: boolean;
    side: bigint;
    maker: string;
    taker: string;
    collateral: CollateralStructOutput;
    terms: LoanOfferTermsStructOutput;
    fee: FeeTermsStructOutput;
    expiration: bigint;
    salt: bigint;
};
export type MarketOfferTermsStruct = {
    currency: AddressLike;
    amount: BigNumberish;
    withLoan: boolean;
    borrowAmount: BigNumberish;
    loanOfferHash: BytesLike;
    rebate: BigNumberish;
};
export type MarketOfferTermsStructOutput = [
    currency: string,
    amount: bigint,
    withLoan: boolean,
    borrowAmount: bigint,
    loanOfferHash: string,
    rebate: bigint
] & {
    currency: string;
    amount: bigint;
    withLoan: boolean;
    borrowAmount: bigint;
    loanOfferHash: string;
    rebate: bigint;
};
export type MarketOfferStruct = {
    kind: BigNumberish;
    soft: boolean;
    side: BigNumberish;
    maker: AddressLike;
    taker: AddressLike;
    collateral: CollateralStruct;
    terms: MarketOfferTermsStruct;
    fee: FeeTermsStruct;
    expiration: BigNumberish;
    salt: BigNumberish;
};
export type MarketOfferStructOutput = [
    kind: bigint,
    soft: boolean,
    side: bigint,
    maker: string,
    taker: string,
    collateral: CollateralStructOutput,
    terms: MarketOfferTermsStructOutput,
    fee: FeeTermsStructOutput,
    expiration: bigint,
    salt: bigint
] & {
    kind: bigint;
    soft: boolean;
    side: bigint;
    maker: string;
    taker: string;
    collateral: CollateralStructOutput;
    terms: MarketOfferTermsStructOutput;
    fee: FeeTermsStructOutput;
    expiration: bigint;
    salt: bigint;
};
export interface SignaturesInterface extends Interface {
    getFunction(nameOrSignature: "hashLoanOffer" | "hashMarketOffer" | "nonces"): FunctionFragment;
    encodeFunctionData(functionFragment: "hashLoanOffer", values: [LoanOfferStruct]): string;
    encodeFunctionData(functionFragment: "hashMarketOffer", values: [MarketOfferStruct]): string;
    encodeFunctionData(functionFragment: "nonces", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "hashLoanOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashMarketOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
}
export interface Signatures extends BaseContract {
    connect(runner?: ContractRunner | null): Signatures;
    waitForDeployment(): Promise<this>;
    interface: SignaturesInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    hashLoanOffer: TypedContractMethod<[
        offer: LoanOfferStruct
    ], [
        string
    ], "view">;
    hashMarketOffer: TypedContractMethod<[
        offer: MarketOfferStruct
    ], [
        string
    ], "view">;
    nonces: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "hashLoanOffer"): TypedContractMethod<[offer: LoanOfferStruct], [string], "view">;
    getFunction(nameOrSignature: "hashMarketOffer"): TypedContractMethod<[offer: MarketOfferStruct], [string], "view">;
    getFunction(nameOrSignature: "nonces"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    filters: {};
}

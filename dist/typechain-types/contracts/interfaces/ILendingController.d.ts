import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../common";
export type LienStruct = {
    borrower: AddressLike;
    collection: AddressLike;
    tokenId: BigNumberish;
    currency: AddressLike;
    principal: BigNumberish;
    rate: BigNumberish;
    defaultRate: BigNumberish;
    duration: BigNumberish;
    gracePeriod: BigNumberish;
    recipient: AddressLike;
    fee: BigNumberish;
    startTime: BigNumberish;
};
export type LienStructOutput = [
    borrower: string,
    collection: string,
    tokenId: bigint,
    currency: string,
    principal: bigint,
    rate: bigint,
    defaultRate: bigint,
    duration: bigint,
    gracePeriod: bigint,
    recipient: string,
    fee: bigint,
    startTime: bigint
] & {
    borrower: string;
    collection: string;
    tokenId: bigint;
    currency: string;
    principal: bigint;
    rate: bigint;
    defaultRate: bigint;
    duration: bigint;
    gracePeriod: bigint;
    recipient: string;
    fee: bigint;
    startTime: bigint;
};
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
export interface ILendingControllerInterface extends Interface {
    getFunction(nameOrSignature: "closeLien" | "computeCurrentDebt" | "currentLender" | "openLien" | "releaseCollateral" | "verifyLienIsCurrent"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "LienClosed" | "LienOpened"): EventFragment;
    encodeFunctionData(functionFragment: "closeLien", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "computeCurrentDebt", values: [LienStruct]): string;
    encodeFunctionData(functionFragment: "currentLender", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "openLien", values: [
        BigNumberish,
        BigNumberish,
        AddressLike,
        AddressLike,
        LoanOfferStruct
    ]): string;
    encodeFunctionData(functionFragment: "releaseCollateral", values: [AddressLike, BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "verifyLienIsCurrent", values: [BigNumberish, LienStruct]): string;
    decodeFunctionResult(functionFragment: "closeLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeCurrentDebt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentLender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "releaseCollateral", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyLienIsCurrent", data: BytesLike): Result;
}
export declare namespace LienClosedEvent {
    type InputTuple = [lienId: BigNumberish];
    type OutputTuple = [lienId: bigint];
    interface OutputObject {
        lienId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace LienOpenedEvent {
    type InputTuple = [lienId: BigNumberish, lien: LienStruct];
    type OutputTuple = [lienId: bigint, lien: LienStructOutput];
    interface OutputObject {
        lienId: bigint;
        lien: LienStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface ILendingController extends BaseContract {
    connect(runner?: ContractRunner | null): ILendingController;
    waitForDeployment(): Promise<this>;
    interface: ILendingControllerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    closeLien: TypedContractMethod<[lienId: BigNumberish], [void], "nonpayable">;
    computeCurrentDebt: TypedContractMethod<[
        lien: LienStruct
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            fee: bigint;
            interest: bigint;
        }
    ], "view">;
    currentLender: TypedContractMethod<[lienId: BigNumberish], [string], "view">;
    openLien: TypedContractMethod<[
        tokenId: BigNumberish,
        principal: BigNumberish,
        lender: AddressLike,
        borrower: AddressLike,
        offer: LoanOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    releaseCollateral: TypedContractMethod<[
        collection: AddressLike,
        tokenId: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "nonpayable">;
    verifyLienIsCurrent: TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        void
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "closeLien"): TypedContractMethod<[lienId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "computeCurrentDebt"): TypedContractMethod<[
        lien: LienStruct
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            fee: bigint;
            interest: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "currentLender"): TypedContractMethod<[lienId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "openLien"): TypedContractMethod<[
        tokenId: BigNumberish,
        principal: BigNumberish,
        lender: AddressLike,
        borrower: AddressLike,
        offer: LoanOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "releaseCollateral"): TypedContractMethod<[
        collection: AddressLike,
        tokenId: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "verifyLienIsCurrent"): TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        void
    ], "view">;
    getEvent(key: "LienClosed"): TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
    getEvent(key: "LienOpened"): TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
    filters: {
        "LienClosed(uint256)": TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        LienClosed: TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        "LienOpened(uint256,tuple)": TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
        LienOpened: TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
    };
}

import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
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
export type MarketOfferTermsStruct = {
    currency: AddressLike;
    amount: BigNumberish;
    rebate: BigNumberish;
};
export type MarketOfferTermsStructOutput = [
    currency: string,
    amount: bigint,
    rebate: bigint
] & {
    currency: string;
    amount: bigint;
    rebate: bigint;
};
export type FeeTermsStruct = {
    recipient: AddressLike;
    rate: BigNumberish;
};
export type FeeTermsStructOutput = [recipient: string, rate: bigint] & {
    recipient: string;
    rate: bigint;
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
export interface KettleInterface extends Interface {
    getFunction(nameOrSignature: "__Kettle_init" | "acceptOwnership" | "amountTaken" | "cancelOffers" | "cancelOffersForUser" | "cancelledOrFulfilled" | "conduit" | "escrow" | "escrowMarketOffer" | "fulfillLoanOffer" | "fulfillLoanOfferInLien" | "fulfillMarketOffer" | "fulfillMarketOfferInLien" | "hashLoanOffer" | "hashMarketOffer" | "incrementNonce" | "lending" | "nonces" | "owner" | "pendingOwner" | "renounceOwnership" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized" | "NonceIncremented" | "OfferCancelled" | "OwnershipTransferStarted" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "__Kettle_init", values: [AddressLike, AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "acceptOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "amountTaken", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "cancelOffers", values: [BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "cancelOffersForUser", values: [AddressLike, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "cancelledOrFulfilled", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "conduit", values?: undefined): string;
    encodeFunctionData(functionFragment: "escrow", values?: undefined): string;
    encodeFunctionData(functionFragment: "escrowMarketOffer", values: [BigNumberish, MarketOfferStruct, BytesLike, BytesLike[]]): string;
    encodeFunctionData(functionFragment: "fulfillLoanOffer", values: [
        BigNumberish,
        BigNumberish,
        LoanOfferStruct,
        BytesLike,
        BytesLike[]
    ]): string;
    encodeFunctionData(functionFragment: "fulfillLoanOfferInLien", values: [
        BigNumberish,
        BigNumberish,
        LienStruct,
        LoanOfferStruct,
        BytesLike,
        BytesLike[]
    ]): string;
    encodeFunctionData(functionFragment: "fulfillMarketOffer", values: [BigNumberish, MarketOfferStruct, BytesLike, BytesLike[]]): string;
    encodeFunctionData(functionFragment: "fulfillMarketOfferInLien", values: [
        BigNumberish,
        LienStruct,
        MarketOfferStruct,
        BytesLike,
        BytesLike[]
    ]): string;
    encodeFunctionData(functionFragment: "hashLoanOffer", values: [LoanOfferStruct]): string;
    encodeFunctionData(functionFragment: "hashMarketOffer", values: [MarketOfferStruct]): string;
    encodeFunctionData(functionFragment: "incrementNonce", values?: undefined): string;
    encodeFunctionData(functionFragment: "lending", values?: undefined): string;
    encodeFunctionData(functionFragment: "nonces", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "__Kettle_init", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "amountTaken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancelOffers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancelOffersForUser", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancelledOrFulfilled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "conduit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "escrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "escrowMarketOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fulfillLoanOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fulfillLoanOfferInLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fulfillMarketOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fulfillMarketOfferInLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashLoanOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashMarketOffer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "incrementNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lending", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
export declare namespace InitializedEvent {
    type InputTuple = [version: BigNumberish];
    type OutputTuple = [version: bigint];
    interface OutputObject {
        version: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NonceIncrementedEvent {
    type InputTuple = [user: AddressLike, nonce: BigNumberish];
    type OutputTuple = [user: string, nonce: bigint];
    interface OutputObject {
        user: string;
        nonce: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OfferCancelledEvent {
    type InputTuple = [
        operator: AddressLike,
        user: AddressLike,
        salt: BigNumberish
    ];
    type OutputTuple = [operator: string, user: string, salt: bigint];
    interface OutputObject {
        operator: string;
        user: string;
        salt: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferStartedEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface Kettle extends BaseContract {
    connect(runner?: ContractRunner | null): Kettle;
    waitForDeployment(): Promise<this>;
    interface: KettleInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    __Kettle_init: TypedContractMethod<[
        conduitController: AddressLike,
        lendingController: AddressLike,
        escrowController: AddressLike,
        owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;
    amountTaken: TypedContractMethod<[offerHash: BytesLike], [bigint], "view">;
    cancelOffers: TypedContractMethod<[
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    cancelOffersForUser: TypedContractMethod<[
        user: AddressLike,
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    cancelledOrFulfilled: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    conduit: TypedContractMethod<[], [string], "view">;
    escrow: TypedContractMethod<[], [string], "view">;
    escrowMarketOffer: TypedContractMethod<[
        placeholder: BigNumberish,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    fulfillLoanOffer: TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish,
        offer: LoanOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    fulfillLoanOfferInLien: TypedContractMethod<[
        lienId: BigNumberish,
        amount: BigNumberish,
        lien: LienStruct,
        offer: LoanOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    fulfillMarketOffer: TypedContractMethod<[
        tokenId: BigNumberish,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    fulfillMarketOfferInLien: TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
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
    incrementNonce: TypedContractMethod<[], [void], "nonpayable">;
    lending: TypedContractMethod<[], [string], "view">;
    nonces: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    pendingOwner: TypedContractMethod<[], [string], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "__Kettle_init"): TypedContractMethod<[
        conduitController: AddressLike,
        lendingController: AddressLike,
        escrowController: AddressLike,
        owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "acceptOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "amountTaken"): TypedContractMethod<[offerHash: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "cancelOffers"): TypedContractMethod<[salts: BigNumberish[]], [void], "nonpayable">;
    getFunction(nameOrSignature: "cancelOffersForUser"): TypedContractMethod<[
        user: AddressLike,
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "cancelledOrFulfilled"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "conduit"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "escrow"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "escrowMarketOffer"): TypedContractMethod<[
        placeholder: BigNumberish,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "fulfillLoanOffer"): TypedContractMethod<[
        tokenId: BigNumberish,
        amount: BigNumberish,
        offer: LoanOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "fulfillLoanOfferInLien"): TypedContractMethod<[
        lienId: BigNumberish,
        amount: BigNumberish,
        lien: LienStruct,
        offer: LoanOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "fulfillMarketOffer"): TypedContractMethod<[
        tokenId: BigNumberish,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "fulfillMarketOfferInLien"): TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct,
        offer: MarketOfferStruct,
        signature: BytesLike,
        proof: BytesLike[]
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "hashLoanOffer"): TypedContractMethod<[offer: LoanOfferStruct], [string], "view">;
    getFunction(nameOrSignature: "hashMarketOffer"): TypedContractMethod<[offer: MarketOfferStruct], [string], "view">;
    getFunction(nameOrSignature: "incrementNonce"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "lending"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "nonces"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pendingOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "NonceIncremented"): TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
    getEvent(key: "OfferCancelled"): TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
    getEvent(key: "OwnershipTransferStarted"): TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "NonceIncremented(address,uint256)": TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
        NonceIncremented: TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
        "OfferCancelled(address,address,uint256)": TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
        OfferCancelled: TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
        "OwnershipTransferStarted(address,address)": TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        OwnershipTransferStarted: TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}

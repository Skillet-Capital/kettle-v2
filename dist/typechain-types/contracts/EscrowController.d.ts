import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
export type EscrowStruct = {
    side: BigNumberish;
    placeholder: BigNumberish;
    identifier: BigNumberish;
    buyer: AddressLike;
    seller: AddressLike;
    collection: AddressLike;
    currency: AddressLike;
    recipient: AddressLike;
    amount: BigNumberish;
    fee: BigNumberish;
    rebate: BigNumberish;
    timestamp: BigNumberish;
    lockTime: BigNumberish;
};
export type EscrowStructOutput = [
    side: bigint,
    placeholder: bigint,
    identifier: bigint,
    buyer: string,
    seller: string,
    collection: string,
    currency: string,
    recipient: string,
    amount: bigint,
    fee: bigint,
    rebate: bigint,
    timestamp: bigint,
    lockTime: bigint
] & {
    side: bigint;
    placeholder: bigint;
    identifier: bigint;
    buyer: string;
    seller: string;
    collection: string;
    currency: string;
    recipient: string;
    amount: bigint;
    fee: bigint;
    rebate: bigint;
    timestamp: bigint;
    lockTime: bigint;
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
export interface EscrowControllerInterface extends Interface {
    getFunction(nameOrSignature: "__EscrowController_init" | "acceptOwnership" | "claimEscrow" | "escrowIndex" | "escrowedTokens" | "escrows" | "hashEscrow" | "kettle" | "lockTime" | "openEscrow" | "owner" | "pendingOwner" | "rejectEscrow" | "renounceOwnership" | "setEscrowedToken" | "setKettle" | "setLockTime" | "setWhitelistOnly" | "settleEscrow" | "transferOwnership" | "whitelistBidTaker" | "whitelistOnly" | "whitelistedAskMaker" | "whitelistedAskMakers" | "whitelistedBidTakers"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "EscrowClaimed" | "EscrowOpened" | "EscrowRejected" | "EscrowSettled" | "Initialized" | "OwnershipTransferStarted" | "OwnershipTransferred" | "SellerWhitelisted"): EventFragment;
    encodeFunctionData(functionFragment: "__EscrowController_init", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "acceptOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "claimEscrow", values: [BigNumberish, EscrowStruct]): string;
    encodeFunctionData(functionFragment: "escrowIndex", values?: undefined): string;
    encodeFunctionData(functionFragment: "escrowedTokens", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "escrows", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "hashEscrow", values: [EscrowStruct]): string;
    encodeFunctionData(functionFragment: "kettle", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "openEscrow", values: [
        BigNumberish,
        BigNumberish,
        AddressLike,
        AddressLike,
        MarketOfferStruct
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "rejectEscrow", values: [boolean, BigNumberish, EscrowStruct]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setEscrowedToken", values: [BigNumberish, boolean]): string;
    encodeFunctionData(functionFragment: "setKettle", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "setLockTime", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setWhitelistOnly", values: [boolean]): string;
    encodeFunctionData(functionFragment: "settleEscrow", values: [BigNumberish, BigNumberish, EscrowStruct, AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "whitelistBidTaker", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "whitelistOnly", values?: undefined): string;
    encodeFunctionData(functionFragment: "whitelistedAskMaker", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "whitelistedAskMakers", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "whitelistedBidTakers", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "__EscrowController_init", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimEscrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "escrowIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "escrowedTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "escrows", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashEscrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "kettle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openEscrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rejectEscrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setEscrowedToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setKettle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setLockTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setWhitelistOnly", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "settleEscrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "whitelistBidTaker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "whitelistOnly", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "whitelistedAskMaker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "whitelistedAskMakers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "whitelistedBidTakers", data: BytesLike): Result;
}
export declare namespace EscrowClaimedEvent {
    type InputTuple = [escrowId: BigNumberish];
    type OutputTuple = [escrowId: bigint];
    interface OutputObject {
        escrowId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowOpenedEvent {
    type InputTuple = [escrowId: BigNumberish, escrow: EscrowStruct];
    type OutputTuple = [escrowId: bigint, escrow: EscrowStructOutput];
    interface OutputObject {
        escrowId: bigint;
        escrow: EscrowStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowRejectedEvent {
    type InputTuple = [escrowId: BigNumberish, rebateReturned: boolean];
    type OutputTuple = [escrowId: bigint, rebateReturned: boolean];
    interface OutputObject {
        escrowId: bigint;
        rebateReturned: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowSettledEvent {
    type InputTuple = [escrowId: BigNumberish, tokenId: BigNumberish];
    type OutputTuple = [escrowId: bigint, tokenId: bigint];
    interface OutputObject {
        escrowId: bigint;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
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
export declare namespace SellerWhitelistedEvent {
    type InputTuple = [maker: AddressLike, whitelisted: boolean];
    type OutputTuple = [maker: string, whitelisted: boolean];
    interface OutputObject {
        maker: string;
        whitelisted: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface EscrowController extends BaseContract {
    connect(runner?: ContractRunner | null): EscrowController;
    waitForDeployment(): Promise<this>;
    interface: EscrowControllerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    __EscrowController_init: TypedContractMethod<[
        owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;
    claimEscrow: TypedContractMethod<[
        escrowId: BigNumberish,
        escrow: EscrowStruct
    ], [
        void
    ], "nonpayable">;
    escrowIndex: TypedContractMethod<[], [bigint], "view">;
    escrowedTokens: TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
    escrows: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    hashEscrow: TypedContractMethod<[escrow: EscrowStruct], [string], "view">;
    kettle: TypedContractMethod<[], [string], "view">;
    lockTime: TypedContractMethod<[], [bigint], "view">;
    openEscrow: TypedContractMethod<[
        placeholder: BigNumberish,
        rebate: BigNumberish,
        buyer: AddressLike,
        seller: AddressLike,
        offer: MarketOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    pendingOwner: TypedContractMethod<[], [string], "view">;
    rejectEscrow: TypedContractMethod<[
        returnRebate: boolean,
        escrowId: BigNumberish,
        escrow: EscrowStruct
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    setEscrowedToken: TypedContractMethod<[
        tokenId: BigNumberish,
        escrowed: boolean
    ], [
        void
    ], "nonpayable">;
    setKettle: TypedContractMethod<[_kettle: AddressLike], [void], "nonpayable">;
    setLockTime: TypedContractMethod<[time: BigNumberish], [void], "nonpayable">;
    setWhitelistOnly: TypedContractMethod<[
        _whitelistOnly: boolean
    ], [
        void
    ], "nonpayable">;
    settleEscrow: TypedContractMethod<[
        escrowId: BigNumberish,
        tokenId: BigNumberish,
        escrow: EscrowStruct,
        assetFactory: AddressLike
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    whitelistBidTaker: TypedContractMethod<[
        user: AddressLike,
        whitelisted: boolean
    ], [
        void
    ], "nonpayable">;
    whitelistOnly: TypedContractMethod<[], [boolean], "view">;
    whitelistedAskMaker: TypedContractMethod<[
        user: AddressLike,
        whitelisted: boolean
    ], [
        void
    ], "nonpayable">;
    whitelistedAskMakers: TypedContractMethod<[
        arg0: AddressLike
    ], [
        boolean
    ], "view">;
    whitelistedBidTakers: TypedContractMethod<[
        arg0: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "__EscrowController_init"): TypedContractMethod<[owner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "acceptOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "claimEscrow"): TypedContractMethod<[
        escrowId: BigNumberish,
        escrow: EscrowStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "escrowIndex"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "escrowedTokens"): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
    getFunction(nameOrSignature: "escrows"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "hashEscrow"): TypedContractMethod<[escrow: EscrowStruct], [string], "view">;
    getFunction(nameOrSignature: "kettle"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "lockTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "openEscrow"): TypedContractMethod<[
        placeholder: BigNumberish,
        rebate: BigNumberish,
        buyer: AddressLike,
        seller: AddressLike,
        offer: MarketOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pendingOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "rejectEscrow"): TypedContractMethod<[
        returnRebate: boolean,
        escrowId: BigNumberish,
        escrow: EscrowStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "setEscrowedToken"): TypedContractMethod<[
        tokenId: BigNumberish,
        escrowed: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setKettle"): TypedContractMethod<[_kettle: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "setLockTime"): TypedContractMethod<[time: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setWhitelistOnly"): TypedContractMethod<[_whitelistOnly: boolean], [void], "nonpayable">;
    getFunction(nameOrSignature: "settleEscrow"): TypedContractMethod<[
        escrowId: BigNumberish,
        tokenId: BigNumberish,
        escrow: EscrowStruct,
        assetFactory: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "whitelistBidTaker"): TypedContractMethod<[
        user: AddressLike,
        whitelisted: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "whitelistOnly"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "whitelistedAskMaker"): TypedContractMethod<[
        user: AddressLike,
        whitelisted: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "whitelistedAskMakers"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "whitelistedBidTakers"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getEvent(key: "EscrowClaimed"): TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
    getEvent(key: "EscrowOpened"): TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
    getEvent(key: "EscrowRejected"): TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
    getEvent(key: "EscrowSettled"): TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferStarted"): TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "SellerWhitelisted"): TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
    filters: {
        "EscrowClaimed(uint256)": TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
        EscrowClaimed: TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
        "EscrowOpened(uint256,tuple)": TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
        EscrowOpened: TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
        "EscrowRejected(uint256,bool)": TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
        EscrowRejected: TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
        "EscrowSettled(uint256,uint256)": TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
        EscrowSettled: TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
        "Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "OwnershipTransferStarted(address,address)": TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        OwnershipTransferStarted: TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "SellerWhitelisted(address,bool)": TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
        SellerWhitelisted: TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
    };
}

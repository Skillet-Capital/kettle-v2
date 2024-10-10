import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
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
export interface LendingControllerInterface extends Interface {
    getFunction(nameOrSignature: "LENDER_RECEIPT" | "__LendingController_init" | "acceptOwnership" | "claim" | "closeLien" | "closeLienWithPayments" | "computeCurrentDebt" | "computeDebtAt" | "conduit" | "currentLender" | "hashLien" | "kettle" | "lienIndex" | "liens" | "onERC721Received" | "openLien" | "owner" | "pendingOwner" | "releaseCollateral" | "renounceOwnership" | "repay" | "setKettle" | "transferOwnership" | "verifyLienIsCurrent"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized" | "LienClosed" | "LienOpened" | "OwnershipTransferStarted" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "LENDER_RECEIPT", values?: undefined): string;
    encodeFunctionData(functionFragment: "__LendingController_init", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "acceptOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "claim", values: [BigNumberish, LienStruct]): string;
    encodeFunctionData(functionFragment: "closeLien", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "closeLienWithPayments", values: [BigNumberish, BigNumberish, AddressLike, AddressLike, LienStruct]): string;
    encodeFunctionData(functionFragment: "computeCurrentDebt", values: [LienStruct]): string;
    encodeFunctionData(functionFragment: "computeDebtAt", values: [LienStruct, BigNumberish]): string;
    encodeFunctionData(functionFragment: "conduit", values?: undefined): string;
    encodeFunctionData(functionFragment: "currentLender", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "hashLien", values: [LienStruct]): string;
    encodeFunctionData(functionFragment: "kettle", values?: undefined): string;
    encodeFunctionData(functionFragment: "lienIndex", values?: undefined): string;
    encodeFunctionData(functionFragment: "liens", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "openLien", values: [
        BigNumberish,
        BigNumberish,
        AddressLike,
        AddressLike,
        LoanOfferStruct
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "releaseCollateral", values: [AddressLike, BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "repay", values: [BigNumberish, LienStruct]): string;
    encodeFunctionData(functionFragment: "setKettle", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "verifyLienIsCurrent", values: [BigNumberish, LienStruct]): string;
    decodeFunctionResult(functionFragment: "LENDER_RECEIPT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "__LendingController_init", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "closeLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "closeLienWithPayments", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeCurrentDebt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeDebtAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "conduit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentLender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "kettle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lienIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "liens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openLien", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "releaseCollateral", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "repay", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setKettle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyLienIsCurrent", data: BytesLike): Result;
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
export interface LendingController extends BaseContract {
    connect(runner?: ContractRunner | null): LendingController;
    waitForDeployment(): Promise<this>;
    interface: LendingControllerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    LENDER_RECEIPT: TypedContractMethod<[], [string], "view">;
    __LendingController_init: TypedContractMethod<[
        conduitController: AddressLike,
        receipt: AddressLike,
        owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;
    claim: TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        void
    ], "nonpayable">;
    closeLien: TypedContractMethod<[lienId: BigNumberish], [void], "nonpayable">;
    closeLienWithPayments: TypedContractMethod<[
        amount: BigNumberish,
        lienId: BigNumberish,
        primaryPayer: AddressLike,
        residualPayerOrRecipient: AddressLike,
        lien: LienStruct
    ], [
        void
    ], "nonpayable">;
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
    computeDebtAt: TypedContractMethod<[
        lien: LienStruct,
        timestamp: BigNumberish
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
    conduit: TypedContractMethod<[], [string], "view">;
    currentLender: TypedContractMethod<[lienId: BigNumberish], [string], "view">;
    hashLien: TypedContractMethod<[lien: LienStruct], [string], "view">;
    kettle: TypedContractMethod<[], [string], "view">;
    lienIndex: TypedContractMethod<[], [bigint], "view">;
    liens: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    onERC721Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "nonpayable">;
    openLien: TypedContractMethod<[
        tokenId: BigNumberish,
        principal: BigNumberish,
        lender: AddressLike,
        borrower: AddressLike,
        offer: LoanOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    pendingOwner: TypedContractMethod<[], [string], "view">;
    releaseCollateral: TypedContractMethod<[
        collection: AddressLike,
        tokenId: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    repay: TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        bigint
    ], "nonpayable">;
    setKettle: TypedContractMethod<[_kettle: AddressLike], [void], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
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
    getFunction(nameOrSignature: "LENDER_RECEIPT"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "__LendingController_init"): TypedContractMethod<[
        conduitController: AddressLike,
        receipt: AddressLike,
        owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "acceptOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "claim"): TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "closeLien"): TypedContractMethod<[lienId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "closeLienWithPayments"): TypedContractMethod<[
        amount: BigNumberish,
        lienId: BigNumberish,
        primaryPayer: AddressLike,
        residualPayerOrRecipient: AddressLike,
        lien: LienStruct
    ], [
        void
    ], "nonpayable">;
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
    getFunction(nameOrSignature: "computeDebtAt"): TypedContractMethod<[
        lien: LienStruct,
        timestamp: BigNumberish
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
    getFunction(nameOrSignature: "conduit"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "currentLender"): TypedContractMethod<[lienId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "hashLien"): TypedContractMethod<[lien: LienStruct], [string], "view">;
    getFunction(nameOrSignature: "kettle"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "lienIndex"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "liens"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "onERC721Received"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "openLien"): TypedContractMethod<[
        tokenId: BigNumberish,
        principal: BigNumberish,
        lender: AddressLike,
        borrower: AddressLike,
        offer: LoanOfferStruct
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pendingOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "releaseCollateral"): TypedContractMethod<[
        collection: AddressLike,
        tokenId: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "repay"): TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "setKettle"): TypedContractMethod<[_kettle: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "verifyLienIsCurrent"): TypedContractMethod<[
        lienId: BigNumberish,
        lien: LienStruct
    ], [
        void
    ], "view">;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "LienClosed"): TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
    getEvent(key: "LienOpened"): TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferStarted"): TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "LienClosed(uint256)": TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        LienClosed: TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        "LienOpened(uint256,tuple)": TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
        LienOpened: TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
        "OwnershipTransferStarted(address,address)": TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        OwnershipTransferStarted: TypedContractEvent<OwnershipTransferStartedEvent.InputTuple, OwnershipTransferStartedEvent.OutputTuple, OwnershipTransferStartedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}

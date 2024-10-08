import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../../common";
export type PackedUserOperationStruct = {
    sender: AddressLike;
    nonce: BigNumberish;
    initCode: BytesLike;
    callData: BytesLike;
    accountGasLimits: BytesLike;
    preVerificationGas: BigNumberish;
    gasFees: BytesLike;
    paymasterAndData: BytesLike;
    signature: BytesLike;
};
export type PackedUserOperationStructOutput = [
    sender: string,
    nonce: bigint,
    initCode: string,
    callData: string,
    accountGasLimits: string,
    preVerificationGas: bigint,
    gasFees: string,
    paymasterAndData: string,
    signature: string
] & {
    sender: string;
    nonce: bigint;
    initCode: string;
    callData: string;
    accountGasLimits: string;
    preVerificationGas: bigint;
    gasFees: string;
    paymasterAndData: string;
    signature: string;
};
export interface SimpleAccountInterface extends Interface {
    getFunction(nameOrSignature: "UPGRADE_INTERFACE_VERSION" | "addDeposit" | "entryPoint" | "execute" | "executeBatch" | "getDeposit" | "getNonce" | "initialize" | "onERC1155BatchReceived" | "onERC1155Received" | "onERC721Received" | "owner" | "proxiableUUID" | "supportsInterface" | "upgradeToAndCall" | "validateUserOp" | "withdrawDepositTo"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized" | "SimpleAccountInitialized" | "Upgraded"): EventFragment;
    encodeFunctionData(functionFragment: "UPGRADE_INTERFACE_VERSION", values?: undefined): string;
    encodeFunctionData(functionFragment: "addDeposit", values?: undefined): string;
    encodeFunctionData(functionFragment: "entryPoint", values?: undefined): string;
    encodeFunctionData(functionFragment: "execute", values: [AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "executeBatch", values: [AddressLike[], BigNumberish[], BytesLike[]]): string;
    encodeFunctionData(functionFragment: "getDeposit", values?: undefined): string;
    encodeFunctionData(functionFragment: "getNonce", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "onERC1155BatchReceived", values: [
        AddressLike,
        AddressLike,
        BigNumberish[],
        BigNumberish[],
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "onERC1155Received", values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "validateUserOp", values: [PackedUserOperationStruct, BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "withdrawDepositTo", values: [AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "UPGRADE_INTERFACE_VERSION", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addDeposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executeBatch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155BatchReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateUserOp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawDepositTo", data: BytesLike): Result;
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
export declare namespace SimpleAccountInitializedEvent {
    type InputTuple = [entryPoint: AddressLike, owner: AddressLike];
    type OutputTuple = [entryPoint: string, owner: string];
    interface OutputObject {
        entryPoint: string;
        owner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UpgradedEvent {
    type InputTuple = [implementation: AddressLike];
    type OutputTuple = [implementation: string];
    interface OutputObject {
        implementation: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface SimpleAccount extends BaseContract {
    connect(runner?: ContractRunner | null): SimpleAccount;
    waitForDeployment(): Promise<this>;
    interface: SimpleAccountInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    UPGRADE_INTERFACE_VERSION: TypedContractMethod<[], [string], "view">;
    addDeposit: TypedContractMethod<[], [void], "payable">;
    entryPoint: TypedContractMethod<[], [string], "view">;
    execute: TypedContractMethod<[
        dest: AddressLike,
        value: BigNumberish,
        func: BytesLike
    ], [
        void
    ], "nonpayable">;
    executeBatch: TypedContractMethod<[
        dest: AddressLike[],
        value: BigNumberish[],
        func: BytesLike[]
    ], [
        void
    ], "nonpayable">;
    getDeposit: TypedContractMethod<[], [bigint], "view">;
    getNonce: TypedContractMethod<[], [bigint], "view">;
    initialize: TypedContractMethod<[anOwner: AddressLike], [void], "nonpayable">;
    onERC1155BatchReceived: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish[],
        arg3: BigNumberish[],
        arg4: BytesLike
    ], [
        string
    ], "view">;
    onERC1155Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BigNumberish,
        arg4: BytesLike
    ], [
        string
    ], "view">;
    onERC721Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    proxiableUUID: TypedContractMethod<[], [string], "view">;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], "view">;
    upgradeToAndCall: TypedContractMethod<[
        newImplementation: AddressLike,
        data: BytesLike
    ], [
        void
    ], "payable">;
    validateUserOp: TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        missingAccountFunds: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    withdrawDepositTo: TypedContractMethod<[
        withdrawAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "UPGRADE_INTERFACE_VERSION"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "addDeposit"): TypedContractMethod<[], [void], "payable">;
    getFunction(nameOrSignature: "entryPoint"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "execute"): TypedContractMethod<[
        dest: AddressLike,
        value: BigNumberish,
        func: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "executeBatch"): TypedContractMethod<[
        dest: AddressLike[],
        value: BigNumberish[],
        func: BytesLike[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getDeposit"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getNonce"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[anOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "onERC1155BatchReceived"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish[],
        arg3: BigNumberish[],
        arg4: BytesLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "onERC1155Received"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BigNumberish,
        arg4: BytesLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "onERC721Received"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "proxiableUUID"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "upgradeToAndCall"): TypedContractMethod<[
        newImplementation: AddressLike,
        data: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "validateUserOp"): TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        missingAccountFunds: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "withdrawDepositTo"): TypedContractMethod<[
        withdrawAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "SimpleAccountInitialized"): TypedContractEvent<SimpleAccountInitializedEvent.InputTuple, SimpleAccountInitializedEvent.OutputTuple, SimpleAccountInitializedEvent.OutputObject>;
    getEvent(key: "Upgraded"): TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
    filters: {
        "Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "SimpleAccountInitialized(address,address)": TypedContractEvent<SimpleAccountInitializedEvent.InputTuple, SimpleAccountInitializedEvent.OutputTuple, SimpleAccountInitializedEvent.OutputObject>;
        SimpleAccountInitialized: TypedContractEvent<SimpleAccountInitializedEvent.InputTuple, SimpleAccountInitializedEvent.OutputTuple, SimpleAccountInitializedEvent.OutputObject>;
        "Upgraded(address)": TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
        Upgraded: TypedContractEvent<UpgradedEvent.InputTuple, UpgradedEvent.OutputTuple, UpgradedEvent.OutputObject>;
    };
}

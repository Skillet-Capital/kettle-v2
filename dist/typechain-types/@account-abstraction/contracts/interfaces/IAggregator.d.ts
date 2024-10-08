import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../common";
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
export interface IAggregatorInterface extends Interface {
    getFunction(nameOrSignature: "aggregateSignatures" | "validateSignatures" | "validateUserOpSignature"): FunctionFragment;
    encodeFunctionData(functionFragment: "aggregateSignatures", values: [PackedUserOperationStruct[]]): string;
    encodeFunctionData(functionFragment: "validateSignatures", values: [PackedUserOperationStruct[], BytesLike]): string;
    encodeFunctionData(functionFragment: "validateUserOpSignature", values: [PackedUserOperationStruct]): string;
    decodeFunctionResult(functionFragment: "aggregateSignatures", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateSignatures", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateUserOpSignature", data: BytesLike): Result;
}
export interface IAggregator extends BaseContract {
    connect(runner?: ContractRunner | null): IAggregator;
    waitForDeployment(): Promise<this>;
    interface: IAggregatorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    aggregateSignatures: TypedContractMethod<[
        userOps: PackedUserOperationStruct[]
    ], [
        string
    ], "view">;
    validateSignatures: TypedContractMethod<[
        userOps: PackedUserOperationStruct[],
        signature: BytesLike
    ], [
        void
    ], "view">;
    validateUserOpSignature: TypedContractMethod<[
        userOp: PackedUserOperationStruct
    ], [
        string
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "aggregateSignatures"): TypedContractMethod<[
        userOps: PackedUserOperationStruct[]
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "validateSignatures"): TypedContractMethod<[
        userOps: PackedUserOperationStruct[],
        signature: BytesLike
    ], [
        void
    ], "view">;
    getFunction(nameOrSignature: "validateUserOpSignature"): TypedContractMethod<[userOp: PackedUserOperationStruct], [string], "view">;
    filters: {};
}

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
export interface IPaymasterInterface extends Interface {
    getFunction(nameOrSignature: "postOp" | "validatePaymasterUserOp"): FunctionFragment;
    encodeFunctionData(functionFragment: "postOp", values: [BigNumberish, BytesLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "validatePaymasterUserOp", values: [PackedUserOperationStruct, BytesLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validatePaymasterUserOp", data: BytesLike): Result;
}
export interface IPaymaster extends BaseContract {
    connect(runner?: ContractRunner | null): IPaymaster;
    waitForDeployment(): Promise<this>;
    interface: IPaymasterInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    postOp: TypedContractMethod<[
        mode: BigNumberish,
        context: BytesLike,
        actualGasCost: BigNumberish,
        actualUserOpFeePerGas: BigNumberish
    ], [
        void
    ], "nonpayable">;
    validatePaymasterUserOp: TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        maxCost: BigNumberish
    ], [
        [string, bigint] & {
            context: string;
            validationData: bigint;
        }
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "postOp"): TypedContractMethod<[
        mode: BigNumberish,
        context: BytesLike,
        actualGasCost: BigNumberish,
        actualUserOpFeePerGas: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "validatePaymasterUserOp"): TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        maxCost: BigNumberish
    ], [
        [string, bigint] & {
            context: string;
            validationData: bigint;
        }
    ], "nonpayable">;
    filters: {};
}

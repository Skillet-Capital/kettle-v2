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
export interface IAccountInterface extends Interface {
    getFunction(nameOrSignature: "validateUserOp"): FunctionFragment;
    encodeFunctionData(functionFragment: "validateUserOp", values: [PackedUserOperationStruct, BytesLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "validateUserOp", data: BytesLike): Result;
}
export interface IAccount extends BaseContract {
    connect(runner?: ContractRunner | null): IAccount;
    waitForDeployment(): Promise<this>;
    interface: IAccountInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    validateUserOp: TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        missingAccountFunds: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "validateUserOp"): TypedContractMethod<[
        userOp: PackedUserOperationStruct,
        userOpHash: BytesLike,
        missingAccountFunds: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    filters: {};
}

import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../common";
export interface NonceManagerInterface extends Interface {
    getFunction(nameOrSignature: "getNonce" | "incrementNonce" | "nonceSequenceNumber"): FunctionFragment;
    encodeFunctionData(functionFragment: "getNonce", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "incrementNonce", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "nonceSequenceNumber", values: [AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "incrementNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nonceSequenceNumber", data: BytesLike): Result;
}
export interface NonceManager extends BaseContract {
    connect(runner?: ContractRunner | null): NonceManager;
    waitForDeployment(): Promise<this>;
    interface: NonceManagerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getNonce: TypedContractMethod<[
        sender: AddressLike,
        key: BigNumberish
    ], [
        bigint
    ], "view">;
    incrementNonce: TypedContractMethod<[
        key: BigNumberish
    ], [
        void
    ], "nonpayable">;
    nonceSequenceNumber: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getNonce"): TypedContractMethod<[
        sender: AddressLike,
        key: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "incrementNonce"): TypedContractMethod<[key: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "nonceSequenceNumber"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    filters: {};
}

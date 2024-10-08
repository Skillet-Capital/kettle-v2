import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface Create2FactoryInterface extends Interface {
    getFunction(nameOrSignature: "deploy" | "getAddress"): FunctionFragment;
    encodeFunctionData(functionFragment: "deploy", values: [BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "getAddress", values: [BigNumberish, BytesLike]): string;
    decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
}
export interface Create2Factory extends BaseContract {
    connect(runner?: ContractRunner | null): Create2Factory;
    waitForDeployment(): Promise<this>;
    interface: Create2FactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    deploy: TypedContractMethod<[
        salt: BigNumberish,
        bytecode: BytesLike
    ], [
        string
    ], "nonpayable">;
    getAddress: TypedContractMethod<[
        salt: BigNumberish,
        bytecode: BytesLike
    ], [
        string
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "deploy"): TypedContractMethod<[
        salt: BigNumberish,
        bytecode: BytesLike
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "getAddress"): TypedContractMethod<[
        salt: BigNumberish,
        bytecode: BytesLike
    ], [
        string
    ], "view">;
    filters: {};
}

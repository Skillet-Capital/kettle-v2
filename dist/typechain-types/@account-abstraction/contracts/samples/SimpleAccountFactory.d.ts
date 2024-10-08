import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../common";
export interface SimpleAccountFactoryInterface extends Interface {
    getFunction(nameOrSignature: "accountImplementation" | "createAccount" | "getAddress"): FunctionFragment;
    encodeFunctionData(functionFragment: "accountImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "createAccount", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getAddress", values: [AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "accountImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createAccount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
}
export interface SimpleAccountFactory extends BaseContract {
    connect(runner?: ContractRunner | null): SimpleAccountFactory;
    waitForDeployment(): Promise<this>;
    interface: SimpleAccountFactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    accountImplementation: TypedContractMethod<[], [string], "view">;
    createAccount: TypedContractMethod<[
        owner: AddressLike,
        salt: BigNumberish
    ], [
        string
    ], "nonpayable">;
    getAddress: TypedContractMethod<[
        owner: AddressLike,
        salt: BigNumberish
    ], [
        string
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "accountImplementation"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "createAccount"): TypedContractMethod<[
        owner: AddressLike,
        salt: BigNumberish
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "getAddress"): TypedContractMethod<[
        owner: AddressLike,
        salt: BigNumberish
    ], [
        string
    ], "view">;
    filters: {};
}

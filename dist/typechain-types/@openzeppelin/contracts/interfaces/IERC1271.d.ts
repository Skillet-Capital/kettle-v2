import type { BaseContract, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../common";
export interface IERC1271Interface extends Interface {
    getFunction(nameOrSignature: "isValidSignature"): FunctionFragment;
    encodeFunctionData(functionFragment: "isValidSignature", values: [BytesLike, BytesLike]): string;
    decodeFunctionResult(functionFragment: "isValidSignature", data: BytesLike): Result;
}
export interface IERC1271 extends BaseContract {
    connect(runner?: ContractRunner | null): IERC1271;
    waitForDeployment(): Promise<this>;
    interface: IERC1271Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    isValidSignature: TypedContractMethod<[
        hash: BytesLike,
        signature: BytesLike
    ], [
        string
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "isValidSignature"): TypedContractMethod<[
        hash: BytesLike,
        signature: BytesLike
    ], [
        string
    ], "view">;
    filters: {};
}

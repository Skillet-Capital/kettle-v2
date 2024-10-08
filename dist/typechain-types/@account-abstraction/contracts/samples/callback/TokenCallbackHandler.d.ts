import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../../../common";
export interface TokenCallbackHandlerInterface extends Interface {
    getFunction(nameOrSignature: "onERC1155BatchReceived" | "onERC1155Received" | "onERC721Received" | "supportsInterface"): FunctionFragment;
    encodeFunctionData(functionFragment: "onERC1155BatchReceived", values: [
        AddressLike,
        AddressLike,
        BigNumberish[],
        BigNumberish[],
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "onERC1155Received", values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    decodeFunctionResult(functionFragment: "onERC1155BatchReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC1155Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
}
export interface TokenCallbackHandler extends BaseContract {
    connect(runner?: ContractRunner | null): TokenCallbackHandler;
    waitForDeployment(): Promise<this>;
    interface: TokenCallbackHandlerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
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
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
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
    getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
    filters: {};
}

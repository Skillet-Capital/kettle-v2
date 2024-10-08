import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface ITransferConduitInterface extends Interface {
    getFunction(nameOrSignature: "transferERC20From" | "transferERC721From"): FunctionFragment;
    encodeFunctionData(functionFragment: "transferERC20From", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferERC721From", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "transferERC20From", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferERC721From", data: BytesLike): Result;
}
export interface ITransferConduit extends BaseContract {
    connect(runner?: ContractRunner | null): ITransferConduit;
    waitForDeployment(): Promise<this>;
    interface: ITransferConduitInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    transferERC20From: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    transferERC721From: TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "transferERC20From"): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "transferERC721From"): TypedContractMethod<[
        token: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    filters: {};
}

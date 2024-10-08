import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface IKettleAssetFactoryInterface extends Interface {
    getFunction(nameOrSignature: "isKettleAsset" | "mint"): FunctionFragment;
    encodeFunctionData(functionFragment: "isKettleAsset", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "mint", values: [AddressLike, AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "isKettleAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
}
export interface IKettleAssetFactory extends BaseContract {
    connect(runner?: ContractRunner | null): IKettleAssetFactory;
    waitForDeployment(): Promise<this>;
    interface: IKettleAssetFactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    isKettleAsset: TypedContractMethod<[asset: AddressLike], [boolean], "view">;
    mint: TypedContractMethod<[
        asset: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "isKettleAsset"): TypedContractMethod<[asset: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        asset: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    filters: {};
}

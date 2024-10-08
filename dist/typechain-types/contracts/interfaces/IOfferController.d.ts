import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../common";
export interface IOfferControllerInterface extends Interface {
    getFunction(nameOrSignature: "cancelOffers" | "cancelOffersForUser" | "incrementNonce"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "NonceIncremented" | "OfferCancelled"): EventFragment;
    encodeFunctionData(functionFragment: "cancelOffers", values: [BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "cancelOffersForUser", values: [AddressLike, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "incrementNonce", values?: undefined): string;
    decodeFunctionResult(functionFragment: "cancelOffers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancelOffersForUser", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "incrementNonce", data: BytesLike): Result;
}
export declare namespace NonceIncrementedEvent {
    type InputTuple = [user: AddressLike, nonce: BigNumberish];
    type OutputTuple = [user: string, nonce: bigint];
    interface OutputObject {
        user: string;
        nonce: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OfferCancelledEvent {
    type InputTuple = [
        operator: AddressLike,
        user: AddressLike,
        salt: BigNumberish
    ];
    type OutputTuple = [operator: string, user: string, salt: bigint];
    interface OutputObject {
        operator: string;
        user: string;
        salt: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IOfferController extends BaseContract {
    connect(runner?: ContractRunner | null): IOfferController;
    waitForDeployment(): Promise<this>;
    interface: IOfferControllerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    cancelOffers: TypedContractMethod<[
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    cancelOffersForUser: TypedContractMethod<[
        user: AddressLike,
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    incrementNonce: TypedContractMethod<[], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "cancelOffers"): TypedContractMethod<[salts: BigNumberish[]], [void], "nonpayable">;
    getFunction(nameOrSignature: "cancelOffersForUser"): TypedContractMethod<[
        user: AddressLike,
        salts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "incrementNonce"): TypedContractMethod<[], [void], "nonpayable">;
    getEvent(key: "NonceIncremented"): TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
    getEvent(key: "OfferCancelled"): TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
    filters: {
        "NonceIncremented(address,uint256)": TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
        NonceIncremented: TypedContractEvent<NonceIncrementedEvent.InputTuple, NonceIncrementedEvent.OutputTuple, NonceIncrementedEvent.OutputObject>;
        "OfferCancelled(address,address,uint256)": TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
        OfferCancelled: TypedContractEvent<OfferCancelledEvent.InputTuple, OfferCancelledEvent.OutputTuple, OfferCancelledEvent.OutputObject>;
    };
}

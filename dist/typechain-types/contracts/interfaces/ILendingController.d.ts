import type { BaseContract, BigNumberish, FunctionFragment, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener } from "../../common";
export type LienStruct = {
    borrower: AddressLike;
    collection: AddressLike;
    tokenId: BigNumberish;
    currency: AddressLike;
    principal: BigNumberish;
    rate: BigNumberish;
    defaultRate: BigNumberish;
    duration: BigNumberish;
    gracePeriod: BigNumberish;
    recipient: AddressLike;
    fee: BigNumberish;
    startTime: BigNumberish;
};
export type LienStructOutput = [
    borrower: string,
    collection: string,
    tokenId: bigint,
    currency: string,
    principal: bigint,
    rate: bigint,
    defaultRate: bigint,
    duration: bigint,
    gracePeriod: bigint,
    recipient: string,
    fee: bigint,
    startTime: bigint
] & {
    borrower: string;
    collection: string;
    tokenId: bigint;
    currency: string;
    principal: bigint;
    rate: bigint;
    defaultRate: bigint;
    duration: bigint;
    gracePeriod: bigint;
    recipient: string;
    fee: bigint;
    startTime: bigint;
};
export interface ILendingControllerInterface extends Interface {
    getEvent(nameOrSignatureOrTopic: "LienClosed" | "LienOpened"): EventFragment;
}
export declare namespace LienClosedEvent {
    type InputTuple = [lienId: BigNumberish];
    type OutputTuple = [lienId: bigint];
    interface OutputObject {
        lienId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace LienOpenedEvent {
    type InputTuple = [lienId: BigNumberish, lien: LienStruct];
    type OutputTuple = [lienId: bigint, lien: LienStructOutput];
    interface OutputObject {
        lienId: bigint;
        lien: LienStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface ILendingController extends BaseContract {
    connect(runner?: ContractRunner | null): ILendingController;
    waitForDeployment(): Promise<this>;
    interface: ILendingControllerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getEvent(key: "LienClosed"): TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
    getEvent(key: "LienOpened"): TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
    filters: {
        "LienClosed(uint256)": TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        LienClosed: TypedContractEvent<LienClosedEvent.InputTuple, LienClosedEvent.OutputTuple, LienClosedEvent.OutputObject>;
        "LienOpened(uint256,tuple)": TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
        LienOpened: TypedContractEvent<LienOpenedEvent.InputTuple, LienOpenedEvent.OutputTuple, LienOpenedEvent.OutputObject>;
    };
}

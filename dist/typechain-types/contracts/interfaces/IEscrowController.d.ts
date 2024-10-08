import type { BaseContract, BigNumberish, FunctionFragment, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener } from "../../common";
export type EscrowStruct = {
    side: BigNumberish;
    placeholder: BigNumberish;
    identifier: BigNumberish;
    buyer: AddressLike;
    seller: AddressLike;
    collection: AddressLike;
    currency: AddressLike;
    recipient: AddressLike;
    amount: BigNumberish;
    fee: BigNumberish;
    rebate: BigNumberish;
    timestamp: BigNumberish;
    lockTime: BigNumberish;
};
export type EscrowStructOutput = [
    side: bigint,
    placeholder: bigint,
    identifier: bigint,
    buyer: string,
    seller: string,
    collection: string,
    currency: string,
    recipient: string,
    amount: bigint,
    fee: bigint,
    rebate: bigint,
    timestamp: bigint,
    lockTime: bigint
] & {
    side: bigint;
    placeholder: bigint;
    identifier: bigint;
    buyer: string;
    seller: string;
    collection: string;
    currency: string;
    recipient: string;
    amount: bigint;
    fee: bigint;
    rebate: bigint;
    timestamp: bigint;
    lockTime: bigint;
};
export interface IEscrowControllerInterface extends Interface {
    getEvent(nameOrSignatureOrTopic: "EscrowClaimed" | "EscrowOpened" | "EscrowRejected" | "EscrowSettled" | "SellerWhitelisted"): EventFragment;
}
export declare namespace EscrowClaimedEvent {
    type InputTuple = [escrowId: BigNumberish];
    type OutputTuple = [escrowId: bigint];
    interface OutputObject {
        escrowId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowOpenedEvent {
    type InputTuple = [escrowId: BigNumberish, escrow: EscrowStruct];
    type OutputTuple = [escrowId: bigint, escrow: EscrowStructOutput];
    interface OutputObject {
        escrowId: bigint;
        escrow: EscrowStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowRejectedEvent {
    type InputTuple = [escrowId: BigNumberish, rebateReturned: boolean];
    type OutputTuple = [escrowId: bigint, rebateReturned: boolean];
    interface OutputObject {
        escrowId: bigint;
        rebateReturned: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace EscrowSettledEvent {
    type InputTuple = [escrowId: BigNumberish, tokenId: BigNumberish];
    type OutputTuple = [escrowId: bigint, tokenId: bigint];
    interface OutputObject {
        escrowId: bigint;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace SellerWhitelistedEvent {
    type InputTuple = [maker: AddressLike, whitelisted: boolean];
    type OutputTuple = [maker: string, whitelisted: boolean];
    interface OutputObject {
        maker: string;
        whitelisted: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IEscrowController extends BaseContract {
    connect(runner?: ContractRunner | null): IEscrowController;
    waitForDeployment(): Promise<this>;
    interface: IEscrowControllerInterface;
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
    getEvent(key: "EscrowClaimed"): TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
    getEvent(key: "EscrowOpened"): TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
    getEvent(key: "EscrowRejected"): TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
    getEvent(key: "EscrowSettled"): TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
    getEvent(key: "SellerWhitelisted"): TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
    filters: {
        "EscrowClaimed(uint256)": TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
        EscrowClaimed: TypedContractEvent<EscrowClaimedEvent.InputTuple, EscrowClaimedEvent.OutputTuple, EscrowClaimedEvent.OutputObject>;
        "EscrowOpened(uint256,tuple)": TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
        EscrowOpened: TypedContractEvent<EscrowOpenedEvent.InputTuple, EscrowOpenedEvent.OutputTuple, EscrowOpenedEvent.OutputObject>;
        "EscrowRejected(uint256,bool)": TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
        EscrowRejected: TypedContractEvent<EscrowRejectedEvent.InputTuple, EscrowRejectedEvent.OutputTuple, EscrowRejectedEvent.OutputObject>;
        "EscrowSettled(uint256,uint256)": TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
        EscrowSettled: TypedContractEvent<EscrowSettledEvent.InputTuple, EscrowSettledEvent.OutputTuple, EscrowSettledEvent.OutputObject>;
        "SellerWhitelisted(address,bool)": TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
        SellerWhitelisted: TypedContractEvent<SellerWhitelistedEvent.InputTuple, SellerWhitelistedEvent.OutputTuple, SellerWhitelistedEvent.OutputObject>;
    };
}

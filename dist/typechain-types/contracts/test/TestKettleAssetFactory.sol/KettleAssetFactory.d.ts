import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../../common";
export interface KettleAssetFactoryInterface extends Interface {
    getFunction(nameOrSignature: "BASE_URI" | "MINTER_ROLE" | "approvedTransfers" | "beacon" | "deployAsset" | "getDeploymentAddress" | "indexTransfer" | "initialize" | "isKettleAsset" | "kettleAssetImplementation" | "lockContract" | "lockToken" | "lockedContracts" | "lockedTokens" | "mint" | "operators" | "owner" | "removeApprovedTransfer" | "renounceOwnership" | "roles" | "setApprovedTransfer" | "setBaseURI" | "setMetadata" | "setOperator" | "setRole" | "tokenURI" | "transferOwnership" | "upgradeImplementation"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ContractLocked" | "Initialized" | "KettleAssetDeployed" | "KettleAssetTransferred" | "OperatorWhitelisted" | "OwnershipTransferred" | "RoleGranted" | "TokenLocked" | "TransferApproved"): EventFragment;
    encodeFunctionData(functionFragment: "BASE_URI", values?: undefined): string;
    encodeFunctionData(functionFragment: "MINTER_ROLE", values?: undefined): string;
    encodeFunctionData(functionFragment: "approvedTransfers", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "beacon", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployAsset", values: [BytesLike, string, string, string]): string;
    encodeFunctionData(functionFragment: "getDeploymentAddress", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "indexTransfer", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "isKettleAsset", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "kettleAssetImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockContract", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "lockToken", values: [AddressLike, BigNumberish, boolean]): string;
    encodeFunctionData(functionFragment: "lockedContracts", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockedTokens", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "mint", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "operators", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeApprovedTransfer", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "roles", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "setApprovedTransfer", values: [AddressLike, AddressLike, AddressLike, BigNumberish, boolean]): string;
    encodeFunctionData(functionFragment: "setBaseURI", values: [string]): string;
    encodeFunctionData(functionFragment: "setMetadata", values: [AddressLike, string, string, string]): string;
    encodeFunctionData(functionFragment: "setOperator", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "setRole", values: [BytesLike, AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "upgradeImplementation", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "BASE_URI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MINTER_ROLE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvedTransfers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "beacon", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDeploymentAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "indexTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isKettleAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "kettleAssetImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedContracts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "operators", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeApprovedTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "roles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovedTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBaseURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMetadata", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOperator", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeImplementation", data: BytesLike): Result;
}
export declare namespace ContractLockedEvent {
    type InputTuple = [asset: AddressLike, locked: boolean];
    type OutputTuple = [asset: string, locked: boolean];
    interface OutputObject {
        asset: string;
        locked: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace InitializedEvent {
    type InputTuple = [version: BigNumberish];
    type OutputTuple = [version: bigint];
    interface OutputObject {
        version: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace KettleAssetDeployedEvent {
    type InputTuple = [
        asset: AddressLike,
        brand: string,
        model: string,
        ref: string
    ];
    type OutputTuple = [
        asset: string,
        brand: string,
        model: string,
        ref: string
    ];
    interface OutputObject {
        asset: string;
        brand: string;
        model: string;
        ref: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace KettleAssetTransferredEvent {
    type InputTuple = [
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ];
    type OutputTuple = [
        asset: string,
        from: string,
        to: string,
        tokenId: bigint
    ];
    interface OutputObject {
        asset: string;
        from: string;
        to: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OperatorWhitelistedEvent {
    type InputTuple = [operator: AddressLike, approved: boolean];
    type OutputTuple = [operator: string, approved: boolean];
    interface OutputObject {
        operator: string;
        approved: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RoleGrantedEvent {
    type InputTuple = [
        account: AddressLike,
        role: BytesLike,
        privilege: boolean
    ];
    type OutputTuple = [account: string, role: string, privilege: boolean];
    interface OutputObject {
        account: string;
        role: string;
        privilege: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TokenLockedEvent {
    type InputTuple = [
        asset: AddressLike,
        tokenId: BigNumberish,
        locked: boolean
    ];
    type OutputTuple = [asset: string, tokenId: bigint, locked: boolean];
    interface OutputObject {
        asset: string;
        tokenId: bigint;
        locked: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TransferApprovedEvent {
    type InputTuple = [
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish,
        approved: boolean
    ];
    type OutputTuple = [
        asset: string,
        from: string,
        to: string,
        tokenId: bigint,
        approved: boolean
    ];
    interface OutputObject {
        asset: string;
        from: string;
        to: string;
        tokenId: bigint;
        approved: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface KettleAssetFactory extends BaseContract {
    connect(runner?: ContractRunner | null): KettleAssetFactory;
    waitForDeployment(): Promise<this>;
    interface: KettleAssetFactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    BASE_URI: TypedContractMethod<[], [string], "view">;
    MINTER_ROLE: TypedContractMethod<[], [string], "view">;
    approvedTransfers: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: AddressLike,
        arg3: BigNumberish
    ], [
        boolean
    ], "view">;
    beacon: TypedContractMethod<[], [string], "view">;
    deployAsset: TypedContractMethod<[
        salt: BytesLike,
        brand: string,
        model: string,
        ref: string
    ], [
        string
    ], "nonpayable">;
    getDeploymentAddress: TypedContractMethod<[
        salt: BytesLike
    ], [
        string
    ], "view">;
    indexTransfer: TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    initialize: TypedContractMethod<[
        owner: AddressLike,
        _implementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    isKettleAsset: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    kettleAssetImplementation: TypedContractMethod<[], [string], "view">;
    lockContract: TypedContractMethod<[
        asset: AddressLike,
        locked: boolean
    ], [
        void
    ], "nonpayable">;
    lockToken: TypedContractMethod<[
        asset: AddressLike,
        tokenId: BigNumberish,
        locked: boolean
    ], [
        void
    ], "nonpayable">;
    lockedContracts: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    lockedTokens: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        boolean
    ], "view">;
    mint: TypedContractMethod<[
        asset: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    operators: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    removeApprovedTransfer: TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    roles: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BytesLike
    ], [
        boolean
    ], "view">;
    setApprovedTransfer: TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    setBaseURI: TypedContractMethod<[_baseURI: string], [void], "nonpayable">;
    setMetadata: TypedContractMethod<[
        asset: AddressLike,
        brand: string,
        model: string,
        ref: string
    ], [
        void
    ], "nonpayable">;
    setOperator: TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    setRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike,
        privilege: boolean
    ], [
        void
    ], "nonpayable">;
    tokenURI: TypedContractMethod<[
        asset: AddressLike,
        tokenId: BigNumberish
    ], [
        string
    ], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    upgradeImplementation: TypedContractMethod<[
        newImplementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "BASE_URI"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "MINTER_ROLE"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "approvedTransfers"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: AddressLike,
        arg3: BigNumberish
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "beacon"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "deployAsset"): TypedContractMethod<[
        salt: BytesLike,
        brand: string,
        model: string,
        ref: string
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "getDeploymentAddress"): TypedContractMethod<[salt: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "indexTransfer"): TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        owner: AddressLike,
        _implementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "isKettleAsset"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "kettleAssetImplementation"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "lockContract"): TypedContractMethod<[
        asset: AddressLike,
        locked: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lockToken"): TypedContractMethod<[
        asset: AddressLike,
        tokenId: BigNumberish,
        locked: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lockedContracts"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "lockedTokens"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        asset: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "operators"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "removeApprovedTransfer"): TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "roles"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BytesLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "setApprovedTransfer"): TypedContractMethod<[
        asset: AddressLike,
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setBaseURI"): TypedContractMethod<[_baseURI: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "setMetadata"): TypedContractMethod<[
        asset: AddressLike,
        brand: string,
        model: string,
        ref: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setOperator"): TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike,
        privilege: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "tokenURI"): TypedContractMethod<[
        asset: AddressLike,
        tokenId: BigNumberish
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "upgradeImplementation"): TypedContractMethod<[
        newImplementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "ContractLocked"): TypedContractEvent<ContractLockedEvent.InputTuple, ContractLockedEvent.OutputTuple, ContractLockedEvent.OutputObject>;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "KettleAssetDeployed"): TypedContractEvent<KettleAssetDeployedEvent.InputTuple, KettleAssetDeployedEvent.OutputTuple, KettleAssetDeployedEvent.OutputObject>;
    getEvent(key: "KettleAssetTransferred"): TypedContractEvent<KettleAssetTransferredEvent.InputTuple, KettleAssetTransferredEvent.OutputTuple, KettleAssetTransferredEvent.OutputObject>;
    getEvent(key: "OperatorWhitelisted"): TypedContractEvent<OperatorWhitelistedEvent.InputTuple, OperatorWhitelistedEvent.OutputTuple, OperatorWhitelistedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "RoleGranted"): TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
    getEvent(key: "TokenLocked"): TypedContractEvent<TokenLockedEvent.InputTuple, TokenLockedEvent.OutputTuple, TokenLockedEvent.OutputObject>;
    getEvent(key: "TransferApproved"): TypedContractEvent<TransferApprovedEvent.InputTuple, TransferApprovedEvent.OutputTuple, TransferApprovedEvent.OutputObject>;
    filters: {
        "ContractLocked(address,bool)": TypedContractEvent<ContractLockedEvent.InputTuple, ContractLockedEvent.OutputTuple, ContractLockedEvent.OutputObject>;
        ContractLocked: TypedContractEvent<ContractLockedEvent.InputTuple, ContractLockedEvent.OutputTuple, ContractLockedEvent.OutputObject>;
        "Initialized(uint64)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "KettleAssetDeployed(address,string,string,string)": TypedContractEvent<KettleAssetDeployedEvent.InputTuple, KettleAssetDeployedEvent.OutputTuple, KettleAssetDeployedEvent.OutputObject>;
        KettleAssetDeployed: TypedContractEvent<KettleAssetDeployedEvent.InputTuple, KettleAssetDeployedEvent.OutputTuple, KettleAssetDeployedEvent.OutputObject>;
        "KettleAssetTransferred(address,address,address,uint256)": TypedContractEvent<KettleAssetTransferredEvent.InputTuple, KettleAssetTransferredEvent.OutputTuple, KettleAssetTransferredEvent.OutputObject>;
        KettleAssetTransferred: TypedContractEvent<KettleAssetTransferredEvent.InputTuple, KettleAssetTransferredEvent.OutputTuple, KettleAssetTransferredEvent.OutputObject>;
        "OperatorWhitelisted(address,bool)": TypedContractEvent<OperatorWhitelistedEvent.InputTuple, OperatorWhitelistedEvent.OutputTuple, OperatorWhitelistedEvent.OutputObject>;
        OperatorWhitelisted: TypedContractEvent<OperatorWhitelistedEvent.InputTuple, OperatorWhitelistedEvent.OutputTuple, OperatorWhitelistedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "RoleGranted(address,bytes32,bool)": TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        RoleGranted: TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        "TokenLocked(address,uint256,bool)": TypedContractEvent<TokenLockedEvent.InputTuple, TokenLockedEvent.OutputTuple, TokenLockedEvent.OutputObject>;
        TokenLocked: TypedContractEvent<TokenLockedEvent.InputTuple, TokenLockedEvent.OutputTuple, TokenLockedEvent.OutputObject>;
        "TransferApproved(address,address,address,uint256,bool)": TypedContractEvent<TransferApprovedEvent.InputTuple, TransferApprovedEvent.OutputTuple, TransferApprovedEvent.OutputObject>;
        TransferApproved: TypedContractEvent<TransferApprovedEvent.InputTuple, TransferApprovedEvent.OutputTuple, TransferApprovedEvent.OutputObject>;
    };
}

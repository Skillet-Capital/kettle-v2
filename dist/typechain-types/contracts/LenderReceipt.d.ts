import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../common";
export interface LenderReceiptInterface extends Interface {
    getFunction(nameOrSignature: "ADMIN_ROLE" | "LENDER_RECEIPT_SUPPLIER" | "_baseURIextended" | "_roles" | "approve" | "balanceOf" | "burn" | "getApproved" | "isApprovedForAll" | "mint" | "name" | "ownerOf" | "safeTransferFrom(address,address,uint256)" | "safeTransferFrom(address,address,uint256,bytes)" | "setApprovalForAll" | "setBaseURI" | "setRole" | "setSupplier" | "supportsInterface" | "symbol" | "tokenURI" | "transferFrom"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Approval" | "ApprovalForAll" | "Transfer"): EventFragment;
    encodeFunctionData(functionFragment: "ADMIN_ROLE", values?: undefined): string;
    encodeFunctionData(functionFragment: "LENDER_RECEIPT_SUPPLIER", values?: undefined): string;
    encodeFunctionData(functionFragment: "_baseURIextended", values?: undefined): string;
    encodeFunctionData(functionFragment: "_roles", values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "approve", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "burn", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getApproved", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "mint", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256)", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "setBaseURI", values: [string]): string;
    encodeFunctionData(functionFragment: "setRole", values: [BigNumberish, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setSupplier", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [AddressLike, AddressLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "LENDER_RECEIPT_SUPPLIER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_baseURIextended", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_roles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBaseURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSupplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
}
export declare namespace ApprovalEvent {
    type InputTuple = [
        owner: AddressLike,
        spender: AddressLike,
        id: BigNumberish
    ];
    type OutputTuple = [owner: string, spender: string, id: bigint];
    interface OutputObject {
        owner: string;
        spender: string;
        id: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ApprovalForAllEvent {
    type InputTuple = [
        owner: AddressLike,
        operator: AddressLike,
        approved: boolean
    ];
    type OutputTuple = [
        owner: string,
        operator: string,
        approved: boolean
    ];
    interface OutputObject {
        owner: string;
        operator: string;
        approved: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TransferEvent {
    type InputTuple = [
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ];
    type OutputTuple = [from: string, to: string, id: bigint];
    interface OutputObject {
        from: string;
        to: string;
        id: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface LenderReceipt extends BaseContract {
    connect(runner?: ContractRunner | null): LenderReceipt;
    waitForDeployment(): Promise<this>;
    interface: LenderReceiptInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    ADMIN_ROLE: TypedContractMethod<[], [bigint], "view">;
    LENDER_RECEIPT_SUPPLIER: TypedContractMethod<[], [bigint], "view">;
    _baseURIextended: TypedContractMethod<[], [string], "view">;
    _roles: TypedContractMethod<[
        arg0: BigNumberish,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    approve: TypedContractMethod<[
        spender: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;
    burn: TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getApproved: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    isApprovedForAll: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        boolean
    ], "view">;
    mint: TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    name: TypedContractMethod<[], [string], "view">;
    ownerOf: TypedContractMethod<[id: BigNumberish], [string], "view">;
    "safeTransferFrom(address,address,uint256)": TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    setApprovalForAll: TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    setBaseURI: TypedContractMethod<[baseURI: string], [void], "nonpayable">;
    setRole: TypedContractMethod<[
        role: BigNumberish,
        account: AddressLike,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setSupplier: TypedContractMethod<[
        supplier: AddressLike,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], "view">;
    symbol: TypedContractMethod<[], [string], "view">;
    tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    transferFrom: TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "ADMIN_ROLE"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "LENDER_RECEIPT_SUPPLIER"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "_baseURIextended"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "_roles"): TypedContractMethod<[
        arg0: BigNumberish,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "approve"): TypedContractMethod<[
        spender: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "burn"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "getApproved"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "isApprovedForAll"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "name"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "ownerOf"): TypedContractMethod<[id: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "safeTransferFrom(address,address,uint256)"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setApprovalForAll"): TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setBaseURI"): TypedContractMethod<[baseURI: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "setRole"): TypedContractMethod<[
        role: BigNumberish,
        account: AddressLike,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setSupplier"): TypedContractMethod<[
        supplier: AddressLike,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "symbol"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "tokenURI"): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        id: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
    getEvent(key: "ApprovalForAll"): TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
    getEvent(key: "Transfer"): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    filters: {
        "Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
        Approval: TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
        "ApprovalForAll(address,address,bool)": TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
        ApprovalForAll: TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
        "Transfer(address,address,uint256)": TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
        Transfer: TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    };
}

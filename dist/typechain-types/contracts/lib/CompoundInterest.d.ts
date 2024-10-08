import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface CompoundInterestInterface extends Interface {
    getFunction(nameOrSignature: "bipsToSignedWads" | "computeCurrentDebt" | "currentDebtAmount"): FunctionFragment;
    encodeFunctionData(functionFragment: "bipsToSignedWads", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "computeCurrentDebt", values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "currentDebtAmount", values: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
    ]): string;
    decodeFunctionResult(functionFragment: "bipsToSignedWads", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeCurrentDebt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentDebtAmount", data: BytesLike): Result;
}
export interface CompoundInterest extends BaseContract {
    connect(runner?: ContractRunner | null): CompoundInterest;
    waitForDeployment(): Promise<this>;
    interface: CompoundInterestInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    bipsToSignedWads: TypedContractMethod<[bips: BigNumberish], [bigint], "view">;
    computeCurrentDebt: TypedContractMethod<[
        amount: BigNumberish,
        rate: BigNumberish,
        startTime: BigNumberish,
        endTime: BigNumberish
    ], [
        bigint
    ], "view">;
    currentDebtAmount: TypedContractMethod<[
        timestamp: BigNumberish,
        principal: BigNumberish,
        startTime: BigNumberish,
        duration: BigNumberish,
        fee: BigNumberish,
        rate: BigNumberish,
        defaultRate: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            feeInterest: bigint;
            lenderInterest: bigint;
        }
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "bipsToSignedWads"): TypedContractMethod<[bips: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "computeCurrentDebt"): TypedContractMethod<[
        amount: BigNumberish,
        rate: BigNumberish,
        startTime: BigNumberish,
        endTime: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "currentDebtAmount"): TypedContractMethod<[
        timestamp: BigNumberish,
        principal: BigNumberish,
        startTime: BigNumberish,
        duration: BigNumberish,
        fee: BigNumberish,
        rate: BigNumberish,
        defaultRate: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            feeInterest: bigint;
            lenderInterest: bigint;
        }
    ], "view">;
    filters: {};
}

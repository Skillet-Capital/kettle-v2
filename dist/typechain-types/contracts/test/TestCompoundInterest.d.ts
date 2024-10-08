import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "../../common";
export interface TestCompoundInterestInterface extends Interface {
    getFunction(nameOrSignature: "computeDebt"): FunctionFragment;
    encodeFunctionData(functionFragment: "computeDebt", values: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
    ]): string;
    decodeFunctionResult(functionFragment: "computeDebt", data: BytesLike): Result;
}
export interface TestCompoundInterest extends BaseContract {
    connect(runner?: ContractRunner | null): TestCompoundInterest;
    waitForDeployment(): Promise<this>;
    interface: TestCompoundInterestInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    computeDebt: TypedContractMethod<[
        timestamp: BigNumberish,
        principal: BigNumberish,
        startTime: BigNumberish,
        duration: BigNumberish,
        feeRate: BigNumberish,
        rate: BigNumberish,
        defaultRate: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            fee: bigint;
            interest: bigint;
        }
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "computeDebt"): TypedContractMethod<[
        timestamp: BigNumberish,
        principal: BigNumberish,
        startTime: BigNumberish,
        duration: BigNumberish,
        feeRate: BigNumberish,
        rate: BigNumberish,
        defaultRate: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            debt: bigint;
            fee: bigint;
            interest: bigint;
        }
    ], "view">;
    filters: {};
}

import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../../common";
import type { SafeERC20, SafeERC20Interface } from "../../../../../../@openzeppelin/contracts/token/ERC20/utils/SafeERC20";
type SafeERC20ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SafeERC20__factory extends ContractFactory {
    constructor(...args: SafeERC20ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<SafeERC20 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): SafeERC20__factory;
    static readonly bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220e3b9c3a2aaa93c8076a6b98e51c8c80e28c79fdccc73d6b0bc473caf48bf909f64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "currentAllowance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "requestedDecrease";
            readonly type: "uint256";
        }];
        readonly name: "SafeERC20FailedDecreaseAllowance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "SafeERC20FailedOperation";
        readonly type: "error";
    }];
    static createInterface(): SafeERC20Interface;
    static connect(address: string, runner?: ContractRunner | null): SafeERC20;
}
export {};

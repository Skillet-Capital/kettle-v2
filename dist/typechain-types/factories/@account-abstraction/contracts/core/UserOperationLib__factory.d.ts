import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { UserOperationLib, UserOperationLibInterface } from "../../../../@account-abstraction/contracts/core/UserOperationLib";
type UserOperationLibConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class UserOperationLib__factory extends ContractFactory {
    constructor(...args: UserOperationLibConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<UserOperationLib & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): UserOperationLib__factory;
    static readonly bytecode = "0x60806040523461001e5760405161010361002482393081505061010390f35b600080fdfe60806040526004361015601157600080fd5b60003560e01c806325093e1b14603c578063b29a8ff41460385763ede3150203604a5760bc565b609d565b606a565b6000910312604a57565b600080fd5b6059605960599290565b90565b60596024604f565b6059605c565b60733660046040565b608b607b6064565b6040519182918290815260200190565b0390f35b60596014604f565b6059608f565b60a63660046040565b608b607b6097565b60596034604f565b605960ae565b60c53660046040565b608b607b60b656fea26469706673582212202783f0431c98c6cc9221a55c30f2eadf0c0769e414435dd4e2371cda07cdd7cc64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_DATA_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_POSTOP_GAS_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "PAYMASTER_VALIDATION_GAS_OFFSET";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): UserOperationLibInterface;
    static connect(address: string, runner?: ContractRunner | null): UserOperationLib;
}
export {};

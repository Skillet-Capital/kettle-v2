import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { TestCompoundInterest, TestCompoundInterestInterface } from "../../../contracts/test/TestCompoundInterest";
type TestCompoundInterestConstructorParams = [
    linkLibraryAddresses: TestCompoundInterestLibraryAddresses,
    signer?: Signer
] | ConstructorParameters<typeof ContractFactory>;
export declare class TestCompoundInterest__factory extends ContractFactory {
    constructor(...args: TestCompoundInterestConstructorParams);
    static linkBytecode(linkLibraryAddresses: TestCompoundInterestLibraryAddresses): string;
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<TestCompoundInterest & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): TestCompoundInterest__factory;
    static readonly bytecode = "0x60806040523461001a5760405161025a610020823961025a90f35b600080fdfe6080604052600436101561001257600080fd5b6357f2412360003560e01c146100b9575b600080fd5b905035905b565b60e081830312610023576100438282610028565b926100518360208401610028565b9261005f8160408501610028565b9261006d8260608301610028565b9261009561007e8460808501610028565b9360c061008e8260a08701610028565b9401610028565b90565b90815260608101939261002d9290916040916100b5906020830152565b0152565b34610023576100ea6100db6100cf36600461002f565b95949094939193610156565b60405191939193849384610098565b0390f35b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761012657604052565b6100ee565b9091606082840312610023578151602083015160409093015190935090565b6040513d6000823e3d90fd5b90919392956101d09060609661016a600090565b5073__$77148ab089d148baeff4bae8a4e175f76c$__9561018a60405190565b998a98899788976325d7f05f60e11b89526004890190815260e081019796959094909390929091602086015260408501526060840152608083015260a082015260c00152565b03915af4801561021f5760008080919390926101ed575b50909192565b915050610212915060603d606011610218575b61020a8183610104565b81019061012b565b386101e7565b503d610200565b61014a56fea2646970667358221220c2c5510948bd375f337fe4d7a4c17a190349dbe3383f1678e5b99245accd13bf64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "principal";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "startTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeRate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "defaultRate";
            readonly type: "uint256";
        }];
        readonly name: "computeDebt";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "debt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "interest";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): TestCompoundInterestInterface;
    static connect(address: string, runner?: ContractRunner | null): TestCompoundInterest;
}
export interface TestCompoundInterestLibraryAddresses {
    ["contracts/lib/CompoundInterest.sol:CompoundInterest"]: string;
}
export {};

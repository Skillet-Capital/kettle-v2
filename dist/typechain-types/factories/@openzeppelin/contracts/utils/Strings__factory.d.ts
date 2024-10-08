import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { Strings, StringsInterface } from "../../../../@openzeppelin/contracts/utils/Strings";
type StringsConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Strings__factory extends ContractFactory {
    constructor(...args: StringsConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Strings & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Strings__factory;
    static readonly bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220c73fa1375b4a17d0de0608323858f0f7031760eb4d7c6b161ae0693688c2f69b64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "length";
            readonly type: "uint256";
        }];
        readonly name: "StringsInsufficientHexLength";
        readonly type: "error";
    }];
    static createInterface(): StringsInterface;
    static connect(address: string, runner?: ContractRunner | null): Strings;
}
export {};

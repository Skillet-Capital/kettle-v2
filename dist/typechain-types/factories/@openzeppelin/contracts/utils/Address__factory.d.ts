import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { Address, AddressInterface } from "../../../../@openzeppelin/contracts/utils/Address";
type AddressConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Address__factory extends ContractFactory {
    constructor(...args: AddressConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Address & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Address__factory;
    static readonly bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220c3ff0aa632821c1aeccc1e3508474f4c43e84383f4e748ee77dd4e3337fd814664736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "target";
            readonly type: "address";
        }];
        readonly name: "AddressEmptyCode";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "AddressInsufficientBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "FailedInnerCall";
        readonly type: "error";
    }];
    static createInterface(): AddressInterface;
    static connect(address: string, runner?: ContractRunner | null): Address;
}
export {};

import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { Create2, Create2Interface } from "../../../../@openzeppelin/contracts/utils/Create2";
type Create2ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Create2__factory extends ContractFactory {
    constructor(...args: Create2ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Create2 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Create2__factory;
    static readonly bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220dfd0c86e2e74cbbb8d3d2b619252e6b51bade19d9a605de53c5834d128861e6164736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "Create2EmptyBytecode";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "Create2FailedDeployment";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "balance";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "needed";
            readonly type: "uint256";
        }];
        readonly name: "Create2InsufficientBalance";
        readonly type: "error";
    }];
    static createInterface(): Create2Interface;
    static connect(address: string, runner?: ContractRunner | null): Create2;
}
export {};

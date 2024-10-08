import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type { MerkleProof, MerkleProofInterface } from "../../../../../@openzeppelin/contracts/utils/cryptography/MerkleProof";
type MerkleProofConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MerkleProof__factory extends ContractFactory {
    constructor(...args: MerkleProofConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<MerkleProof & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): MerkleProof__factory;
    static readonly bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220097ef17b6bf036087a2a45ec1b5ebbaba4a8ee52043cc2c51f13933e70e2762864736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MerkleProofInvalidMultiproof";
        readonly type: "error";
    }];
    static createInterface(): MerkleProofInterface;
    static connect(address: string, runner?: ContractRunner | null): MerkleProof;
}
export {};

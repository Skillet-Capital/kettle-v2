import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { SenderCreator, SenderCreatorInterface } from "../../../../@account-abstraction/contracts/core/SenderCreator";
type SenderCreatorConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SenderCreator__factory extends ContractFactory {
    constructor(...args: SenderCreatorConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<SenderCreator & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): SenderCreator__factory;
    static readonly bytecode = "0x60806040523461001a576040516102d061002082396102d090f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c63570e1a3603610057576100aa565b909182601f830112156100575781359167ffffffffffffffff831161005757602001926001830284011161005757565b600080fd5b9060208282031261005757813567ffffffffffffffff8111610057576100829201610027565b9091565b6001600160a01b031690565b90565b6001600160a01b03909116815260200190565b565b34610057576100d26100c66100c036600461005c565b9061022c565b60405191829182610095565b0390f35b6100926100926100929290565b90939293848311610057578411610057578101920390565b356bffffffffffffffffffffffff19169060148110610118575090565b610135906bffffffffffffffffffffffff19906014036008021b90565b1690565b61009290610086906001600160a01b031682565b6100929060601c610139565b6100929061014d565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761019a57604052565b610162565b906100a86101ac60405190565b9283610178565b67ffffffffffffffff811161019a57602090601f01601f19160190565b90826000939282370152565b909291926101f16101ec826101b3565b61019f565b9381855281830111610057576100a89160208501906101d0565b6100929136916101dc565b6100866100926100929290565b61009290610216565b61027392916020916102796000958693610245856100d6565b8161026d61026861026261025960146100d6565b8095858b6100e3565b906100fb565b610159565b956100e3565b9061020b565b90828483519301915af1825192901561028f5750565b61009291925061022356fea2646970667358221220e2f8404bf8a5f5a52b66d574f50f826a5dea6a9173b44ee66dc8c868f4c90e5364736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "initCode";
            readonly type: "bytes";
        }];
        readonly name: "createSender";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): SenderCreatorInterface;
    static connect(address: string, runner?: ContractRunner | null): SenderCreator;
}
export {};

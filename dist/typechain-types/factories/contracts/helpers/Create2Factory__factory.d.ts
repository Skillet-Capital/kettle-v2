import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Create2Factory, Create2FactoryInterface } from "../../../contracts/helpers/Create2Factory";
type Create2FactoryConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Create2Factory__factory extends ContractFactory {
    constructor(...args: Create2FactoryConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Create2Factory & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Create2Factory__factory;
    static readonly bytecode = "0x60806040523461001a5760405161031e610020823961031e90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806327e6daba14610032576361ff715f0361003757610193565b610167565b600080fd5b905035905b565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761007b57604052565b610043565b9061004161008d60405190565b9283610059565b67ffffffffffffffff811161007b57602090601f01601f19160190565b0190565b90826000939282370152565b909291926100d66100d182610094565b610080565b9381855281830111610037576100419160208501906100b5565b9080601f830112156100375781602061010b933591016100c1565b90565b91909160408184031261003757610125838261003c565b92602082013567ffffffffffffffff81116100375761010b92016100f0565b6001600160a01b031690565b9052565b6001600160a01b03909116815260200190565b346100375761018f61018361017d36600461010e565b90610239565b60405191829182610154565b0390f35b346100375761018f6101836101a936600461010e565b906102d4565b6101c26101bc61010b9290565b60f81b90565b6001600160f81b03191690565b61010b90610144906001600160a01b031682565b61010b906101cf565b61010b906101e3565b610150906001600160a01b031660601b90565b0180926101f5565b01918252565b61010b61010b61010b9290565b61010b90610216565b61014461010b61010b9290565b6102ca6102cf916102b961010b9461024f600090565b5061025a60ff6101af565b6102ad610266306101ec565b92610279610272825190565b9160200190565b206040519586946020860194859261021060146100b19461021060018861020860209b9a8c996001600160f81b0319169052565b90810382520382610059565b6102c4610272825190565b20610223565b61022c565b6101e3565b906020815191016000f5803b15610037579056fea26469706673582212208db6523c24ead610bbe0cea0407a87d7522e74049d3f212c3ac6fc17a8c513c464736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "salt";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "bytecode";
            readonly type: "bytes";
        }];
        readonly name: "deploy";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "salt";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "bytecode";
            readonly type: "bytes";
        }];
        readonly name: "getAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): Create2FactoryInterface;
    static connect(address: string, runner?: ContractRunner | null): Create2Factory;
}
export {};

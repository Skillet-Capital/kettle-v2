import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { KettleMath, KettleMathInterface } from "../../../contracts/lib/KettleMath";
type KettleMathConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class KettleMath__factory extends ContractFactory {
    constructor(...args: KettleMathConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<KettleMath & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): KettleMath__factory;
    static readonly bytecode = "0x60806040523461001e5760405161021361002482393081505061021390f35b600080fdfe6080604052600436101561001257600080fd5b63b88faf6d60003560e01c14610042575b600080fd5b919060408382031261002357508135916020013590565b90565b610069610059610053366004610028565b90610085565b6040519182918290815260200190565b0390f35b61003f61003f61003f9290565b61003f61271061006d565b61003f9161009161007a565b916100bc565b634e487b7160e01b600052601260045260246000fd5b81156100b7570490565b610097565b906000926100c982840290565b92600019838209848082109103036100e1600061006d565b81146101ce57808311156101bc578261013f9461012c9361003f98500980860395109003600161011984610115600061006d565b0390565b8416808095049604938060000304010290565b179161013f6101438261013f600361006d565b0290565b6101156101b66101b06101a16101926101836101746002976101648961006d565b1861013f8b82026101158b61006d565b61013f8a82026101158a61006d565b61013f8982026101158961006d565b61013f8882026101158861006d565b61013f8782026101158761006d565b80950290565b9161006d565b60405163227bc15360e01b8152600490fd5b505091905061003f92506100ad56fea26469706673582212206088a3859629f76f2017d3150275215e64f3dc5a478faab5689e60bec30208b864736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MathOverflowedMulDiv";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "gross";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fee";
            readonly type: "uint256";
        }];
        readonly name: "safeMulFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "net";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): KettleMathInterface;
    static connect(address: string, runner?: ContractRunner | null): KettleMath;
}
export {};

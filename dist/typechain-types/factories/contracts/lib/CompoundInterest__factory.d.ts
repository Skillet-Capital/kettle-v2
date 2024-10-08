import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { CompoundInterest, CompoundInterestInterface } from "../../../contracts/lib/CompoundInterest";
type CompoundInterestConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class CompoundInterest__factory extends ContractFactory {
    constructor(...args: CompoundInterestConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<CompoundInterest & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): CompoundInterest__factory;
    static readonly bytecode = "0x60806040523461001e5760405161073c61002482393081505061073c90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806337320831146100425780634bafe0be1461003d5763bfcc91340361004757610180565b610140565b610092565b600080fd5b905035905b565b60808183031261004757610067828261004c565b9261008f610078846020850161004c565b936060610088826040870161004c565b940161004c565b90565b6100bc6100ac6100a3366004610053565b92919091610202565b6040519182918290815260200190565b0390f35b60e081830312610047576100d4828261004c565b926100e2836020840161004c565b926100f0816040850161004c565b926100fe826060830161004c565b9261008f61010f846080850161004c565b9360c06100888260a0870161004c565b90815260608101939261005192909160409161013c906020830152565b0152565b6100bc61015d6101513660046100c0565b9594909493919361027f565b6040519193919384938461011f565b906020828203126100475761008f9161004c565b6100bc6100ac61019136600461016c565b61035d565b634e487b7160e01b600052601160045260246000fd5b919082039182116101b957565b610196565b61008f61008f61008f9290565b8181029291600160ff1b811460008312166101b95781840514901517156101b957565b61008f6a1a1601fc4ea7109e0000006101be565b61026d6102679161026761026161025b61024d6102366102316102319a61008f9c61022b600090565b506101ac565b6101be565b610247670de0b6b3a76400006101be565b906101cb565b6102556101ee565b90610395565b926101be565b9461035d565b906103ba565b61044e565b919082018092116101b957565b8195919261030095976102e5956102a08484610299600090565b9c89610202565b99506102af61008f8285610272565b84111561030357806102d36102df96856102cc6102d99582610272565b918a610202565b93610272565b91610202565b946101ac565b6102fb6102f38483966101ac565b918294610272565b610272565b92565b50506102df9284610202565b818102929181159184041417156101b957565b61008f6127106101be565b634e487b7160e01b600052601260045260246000fd5b9061034d565b9190565b908115610358570490565b61032d565b61023161038761008f9261036f600090565b50610381670de0b6b3a76400006101be565b9061030f565b61038f610322565b90610343565b670de0b6b3a7640000810290670de0b6b3a76400008205148215151615610047570590565b6000198114600160ff1b8314166100475781810291818305149015171561004757670de0b6b3a7640000900590565b6103f661008f61008f9290565b60ff1690565b61008f9061041061034961008f9460ff1690565b901b90565b8115610358570590565b61008f9061043361034961008f9460ff1690565b901d90565b61008f9061044961034961008f9490565b901c90565b610461680248ce36a70cb26b3e196101be565b8113156106fb5761047a680755bf798b4a1bf1e56101be565b8112156106c75761048b604e6103e9565b610494916103fc565b6104a36503782dace9d96101be565b6104ac91610415565b6104b660606103e9565b6104c081836103fc565b91816bb17217f7d1cf79abc9e3b398936104d9856101be565b6104e291610415565b6104ef6001605f1b6101be565b01906104fa9161041f565b92610504906101be565b830290039080806105216c10fe68e7fd37d0007b713f76506101be565b840184029061052f9161041f565b6105466d02d16720577bd19bf614176fe9ea6101be565b018084016105616d04a4fd9f2a8b96949216d2255a6c6101be565b9003029061056e9161041f565b6105866e0587f503bb6ea29d25fcb7401964506101be565b0182026105a36d360d7aeea093263ecc6e0ecb291760621b6101be565b0191818080806105bf6c240c330e9fb2d9cbaf0fd5aafc6101be565b85038502906105cd9161041f565b6105e46d0277594991cfc85f6e2461837cd96101be565b018402906105f19161041f565b6106086d1a521255e34f6a5061b25ef1c9c46101be565b610615929103840261041f565b61062c6db1bbb201f443cf962f1a1d3db4a56101be565b018202906106399161041f565b6106516e02c72388d9f74f51a9331fed693f156101be565b9003029061065e9161041f565b6106766e05180bb14799ab47a8a8cb2a527d576101be565b0161068191056101be565b61069f74029d9dc38563c32e5c2f6dc192ee70ef65f9978af36101be565b02906106ab60c36101be565b036106b5906101be565b6106be91610438565b61008f906101be565b60405162461bcd60e51b815260206004820152600c60248201526b4558505f4f564552464c4f5760a01b6044820152606490fd5b5061008f60006101be56fea2646970667358221220213435d04b44bb5f615eca733454ee8df21a4f5afb9b8705f54bd2d9f32e78cc64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "bips";
            readonly type: "uint256";
        }];
        readonly name: "bipsToSignedWads";
        readonly outputs: readonly [{
            readonly internalType: "int256";
            readonly name: "";
            readonly type: "int256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "startTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endTime";
            readonly type: "uint256";
        }];
        readonly name: "computeCurrentDebt";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
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
            readonly name: "fee";
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
        readonly name: "currentDebtAmount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "debt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeInterest";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "lenderInterest";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): CompoundInterestInterface;
    static connect(address: string, runner?: ContractRunner | null): CompoundInterest;
}
export {};

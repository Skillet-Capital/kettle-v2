import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Distributions, DistributionsInterface } from "../../../contracts/lib/Distributions";
type DistributionsConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Distributions__factory extends ContractFactory {
    constructor(...args: DistributionsConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Distributions & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Distributions__factory;
    static readonly bytecode = "0x608060405234610020576040516105db61002682393081602501526105db90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c63b252b3c40361004a57307f000000000000000000000000000000000000000000000000000000000000000003610125575b600080fd5b6001600160a01b031690565b90565b6001600160a01b0381165b0361004a57565b9050359061007d8261005e565b565b80610069565b9050359061007d8261007f565b6101408183031261004a576100a78282610070565b926100b58360208401610085565b926100c38160408501610085565b926100d18260608301610085565b926100df8360808401610085565b926100ed8160a08501610070565b926100fb8260c08301610070565b9261005b61010c8460e08501610070565b9361012061011e826101008701610070565b9401610070565b610145610133366004610092565b98979097969196959295949394610172565b604051005b634e487b7160e01b600052601160045260246000fd5b9190820391821161016d57565b61014a565b94919890929398979596976101848190565b8410156101f05750506101948390565b8211156101cf576101c36101bc8461007d9a946101b76101ca978b968d8b61024b565b610160565b8093610160565b968461024b565b61024b565b90806101ca936101b76101e8938561007d9c9b8961024b565b90848461024b565b61007d9998965090610209610211926101ca9695610160565b90878761024b565b848461024b565b61005b61005b61005b9290565b61005b9061004f906001600160a01b031682565b61005b90610225565b61005b90610239565b9291906001600160a01b0382166001600160a01b038216148015610286575b156102755750505050565b61028161007d94610242565b61031f565b506102916000610218565b831461026a565b6102b16102ab61005b9263ffffffff1690565b60e01b90565b6001600160e01b03191690565b6001600160a01b0391821681529116602082015260608101929161007d9160400152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761031a57604052565b6102e2565b906103649061035561007d9560049561033b6323b872dd610298565b9361034560405190565b97889560208701908152016102be565b602082018103825203836102f8565b610392565b801515610069565b9050519061007d82610369565b9060208282031261004a5761005b91610371565b61039e6103a591610242565b9182610426565b80516103b86103b46000610218565b9190565b141590816103fe575b506103c95750565b6103fa906103d660405190565b635274afe760e01b8152918291600483016001600160a01b03909116815260200190565b0390fd5b610420915080602061041161041c935190565b81830101910161037e565b1590565b386103c1565b61005b916104346000610218565b916104a1565b9061007d61044760405190565b92836102f8565b67ffffffffffffffff811161031a57602090601f01601f19160190565b9061047d6104788361044e565b61043a565b918252565b3d1561049c576104913d61046b565b903d6000602084013e565b606090565b916104ab30610242565b818131106104d557506000828192602061005b969551920190855af16104cf610482565b91610506565b6103fa906104e260405190565b63cd78605960e01b8152918291600483016001600160a01b03909116815260200190565b906105115750610576565b81516105206103b46000610218565b1480610560575b61052f575090565b6103fa9061053c60405190565b639996b31560e01b8152918291600483016001600160a01b03909116815260200190565b50803b6105706103b46000610218565b14610527565b80516105856103b46000610218565b111561059357805190602001fd5b604051630a12f52160e11b8152600490fdfea2646970667358221220812aeb8146de8e8d62f6803f8e316026e061190fb6b6422521c89cd650b7672b64736f6c63430008180033";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "SafeERC20FailedOperation";
        readonly type: "error";
    }];
    static createInterface(): DistributionsInterface;
    static connect(address: string, runner?: ContractRunner | null): Distributions;
}
export {};
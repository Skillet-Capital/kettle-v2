import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type { UpgradeableBeacon, UpgradeableBeaconInterface } from "../../../../../@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon";
type UpgradeableBeaconConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class UpgradeableBeacon__factory extends ContractFactory {
    constructor(...args: UpgradeableBeaconConstructorParams);
    getDeployTransaction(implementation_: AddressLike, initialOwner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(implementation_: AddressLike, initialOwner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<UpgradeableBeacon & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): UpgradeableBeacon__factory;
    static readonly bytecode = "0x60806040523462000031576200001f62000018620000e5565b906200010c565b6040516103f76200031882396103f790f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200006e57604052565b62000036565b906200008b6200008360405190565b92836200004c565b565b6001600160a01b031690565b90565b6001600160a01b038116036200003157565b905051906200008b826200009c565b9190604083820312620000315762000099906020620000dd8286620000ae565b9401620000ae565b620001086200070f80380380620000fc8162000074565b928339810190620000bd565b9091565b6200011b6200008b926200014f565b6200021b565b6200008d62000099620000999290565b620000999062000121565b6001600160a01b03909116815260200190565b6200015b600062000131565b6001600160a01b0381166001600160a01b038316146200018157506200008b90620002bd565b620001a7906200019060405190565b631e4fbdf760e01b8152918291600483016200013c565b0390fd5b6200009962000099620000999290565b62000099906200008d906001600160a01b031682565b6200009990620001bb565b6200009990620001d1565b90620001fb620000996200021792620001dc565b82546001600160a01b0319166001600160a01b03919091161790565b9055565b803b620002316200022d6000620001ab565b9190565b14620002805780620002496200024f926001620001e7565b620001dc565b7fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b6200027a60405190565b600090a2565b620001a7906200028f60405190565b63211eb15960e21b8152918291600483016200013c565b62000099906200008d565b620000999054620002a6565b620002e5620002de620002d16000620002b1565b62000249846000620001e7565b91620001dc565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06200031160405190565b600090a356fe6080604052600436101561001257600080fd5b60003560e01c80633659cfe6146100625780635c60da1b1461005d578063715018a6146100585780638da5cb5b146100535763f2fde38b0361008757610148565b61012d565b610115565b6100ee565b6100af565b6001600160a01b031690565b90565b6001600160a01b0381160361008757565b600080fd5b9050359061009982610076565b565b90602082820312610087576100739161008c565b34610087576100c76100c236600461009b565b610175565b604051005b0390f35b600091031261008757565b6001600160a01b03909116815260200190565b34610087576100fe3660046100d0565b6100cc61010961017e565b604051918291826100db565b34610087576101253660046100d0565b6100c76101c5565b346100875761013d3660046100d0565b6100cc6101096101cd565b34610087576100c761015b36600461009b565b61023c565b6100999061016c610245565b610099906102e8565b61009990610160565b6001546001600160a01b031690565b610195610245565b6100996101b3565b6100676100736100739290565b6100739061019d565b6100996101c060006101aa565b610367565b61009961018d565b6000546001600160a01b031690565b610099906101e8610245565b6101f260006101aa565b6001600160a01b0381166001600160a01b03831614610215575061009990610367565b6102389061022260405190565b631e4fbdf760e01b8152918291600483016100db565b0390fd5b610099906101dc565b61024d6101cd565b339081906001600160a01b0316036102625750565b6102389061026f60405190565b63118cdaa760e01b8152918291600483016100db565b6100736100736100739290565b61007390610067906001600160a01b031682565b61007390610292565b610073906102a6565b906102c86100736102e4926102af565b82546001600160a01b0319166001600160a01b03919091161790565b9055565b803b6102fb6102f76000610285565b9190565b14610344578061030f6103149260016102b8565b6102af565b7fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b61033e60405190565b600090a2565b6102389061035160405190565b63211eb15960e21b8152918291600483016100db565b61039061038a61037f6000546001600160a01b031690565b61030f8460006102b8565b916102af565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06103bb60405190565b600090a356fea264697066735822122084fdb6bfdb20fe666ac5f242aec2e7bed7d0b8ff48ab55be089cda434cd3bcf264736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "implementation_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "initialOwner";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "BeaconInvalidImplementation";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "OwnableInvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "OwnableUnauthorizedAccount";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "implementation";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }];
        readonly name: "upgradeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): UpgradeableBeaconInterface;
    static connect(address: string, runner?: ContractRunner | null): UpgradeableBeacon;
}
export {};

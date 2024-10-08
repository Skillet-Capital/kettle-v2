import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BytesLike, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../../../../common";
import type { ERC1967Proxy, ERC1967ProxyInterface } from "../../../../../@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy";
type ERC1967ProxyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC1967Proxy__factory extends ContractFactory {
    constructor(...args: ERC1967ProxyConstructorParams);
    getDeployTransaction(implementation: AddressLike, _data: BytesLike, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(implementation: AddressLike, _data: BytesLike, overrides?: PayableOverrides & {
        from?: string;
    }): Promise<ERC1967Proxy & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ERC1967Proxy__factory;
    static readonly bytecode = "0x608060405261001561000f610167565b90610189565b60405160c36103fd823960c390f35b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761005b57604052565b610024565b9061007461006d60405190565b928361003a565b565b6001600160a01b031690565b90565b6001600160a01b0381160361009657565b600080fd5b9050519061007482610085565b6001600160401b03811161005b57602090601f01601f19160190565b60005b8381106100d75750506000910152565b81810151838201526020016100c7565b909291926100fc6100f7826100a8565b610060565b9381855281830111610096576100749160208501906100c4565b9080601f83011215610096578151610082926020016100e7565b91909160408184031261009657610147838261009b565b60208201519093906001600160401b038111610096576100829201610116565b6101856104c08038038061017a81610060565b928339810190610130565b9091565b90610074916101c6565b61008290610076906001600160a01b031682565b61008290610193565b610082906101a7565b6100826100826100829290565b906101d0826102a2565b6101d9826101b0565b7fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b61020360405190565b600090a2805161021a61021660006101b9565b9190565b111561022c5761022991610349565b50565b50506100746102f4565b6001600160a01b03909116815260200190565b6100827f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6101b9565b9061028261008261029e926101b0565b82546001600160a01b0319166001600160a01b03919091161790565b9055565b803b6102b161021660006101b9565b146102cd576100749060006102c7610082610249565b01610272565b6102f0906102da60405190565b634c9c8ce360e01b815291829160048301610236565b0390fd5b6102fe60006101b9565b341161030657565b60405163b398979f60e01b8152600490fd5b906103256100f7836100a8565b918252565b3d15610344576103393d610318565b903d6000602084013e565b606090565b60008061008293610358606090565b50602081519101845af461036a61032a565b919061037657506103cd565b815161038561021660006101b9565b14806103b7575b610394575090565b6102f0906103a160405190565b639996b31560e01b815291829160048301610236565b50803b6103c761021660006101b9565b1461038c565b80516103dc61021660006101b9565b11156103ea57805190602001fd5b604051630a12f52160e11b8152600490fdfe6080604052600a600e565b6017565b6014607c565b90565b60008091368280378136915af43d6000803e156032573d6000f35b3d6000fd5b6014601460149290565b60147f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6037565b6001600160a01b031690565b601490546068565b60146000608860146041565b01607456fea264697066735822122082afebc3740eb4facb9ac142ee7ff0ccd1e1d7e246f5dff63b08827bd9cc241264736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly stateMutability: "payable";
        readonly type: "constructor";
    }, {
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
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "ERC1967InvalidImplementation";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ERC1967NonPayable";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "FailedInnerCall";
        readonly type: "error";
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
        readonly stateMutability: "payable";
        readonly type: "fallback";
    }];
    static createInterface(): ERC1967ProxyInterface;
    static connect(address: string, runner?: ContractRunner | null): ERC1967Proxy;
}
export {};

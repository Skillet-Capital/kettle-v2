import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type { ProxyAdmin, ProxyAdminInterface } from "../../../../../@openzeppelin/contracts/proxy/transparent/ProxyAdmin";
type ProxyAdminConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ProxyAdmin__factory extends ContractFactory {
    constructor(...args: ProxyAdminConstructorParams);
    getDeployTransaction(initialOwner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(initialOwner: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ProxyAdmin & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): ProxyAdmin__factory;
    static readonly bytecode = "0x60806040523462000030576200001e62000018620000d3565b620000f6565b6040516105eb6200026382396105eb90f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200006d57604052565b62000035565b906200008a6200008260405190565b92836200004b565b565b6001600160a01b031690565b90565b6001600160a01b038116036200003057565b905051906200008a826200009b565b9060208282031262000030576200009891620000ad565b620000986200084e80380380620000ea8162000073565b928339810190620000bc565b6200008a906200012f565b6200008c62000098620000989290565b620000989062000101565b6001600160a01b03909116815260200190565b6200013b600062000111565b6001600160a01b0381166001600160a01b038316146200016157506200008a9062000202565b62000187906200017060405190565b631e4fbdf760e01b8152918291600483016200011c565b0390fd5b62000098906200008c565b6200009890546200018b565b62000098906200008c906001600160a01b031682565b6200009890620001a2565b6200009890620001b8565b90620001e262000098620001fe92620001c3565b82546001600160a01b0319166001600160a01b03919091161790565b9055565b620002306200022962000216600062000196565b62000223846000620001ce565b620001c3565b91620001c3565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06200025c60405190565b600090a356fe6080604052600436101561001257600080fd5b60003560e01c8063715018a6146100625780638da5cb5b1461005d5780639623609d14610058578063ad3cb1cc146100535763f2fde38b036100725761032f565b6102f4565b610233565b6100c6565b610077565b600091031261007257565b600080fd5b3461007257610087366004610067565b61008f61037f565b604051005b0390f35b6001600160a01b031690565b90565b6100b090610098565b9052565b6020810192916100c491906100a7565b565b34610072576100d6366004610067565b6100946100e1610391565b604051918291826100b4565b6100a490610098565b6100ff816100ed565b0361007257565b905035906100c4826100f6565b6100ff81610098565b905035906100c482610113565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761016157604052565b610129565b906100c461017360405190565b928361013f565b67ffffffffffffffff811161016157602090601f01601f19160190565b0190565b90826000939282370152565b909291926101bc6101b78261017a565b610166565b9381855281830111610072576100c491602085019061019b565b9080601f83011215610072578160206100a4933591016101a7565b91606083830312610072576102068284610106565b92610214836020830161011c565b92604082013567ffffffffffffffff8111610072576100a492016101d6565b61008f6102413660046101f1565b91610475565b906102546101b78361017a565b918252565b6102636005610247565b640352e302e360dc1b602082015290565b6100a4610259565b6100a4610274565b6100a461027c565b60005b83811061029f5750506000910152565b818101518382015260200161028f565b6102d06102d9602093610197936102c4815190565b80835293849260200190565b9586910161028c565b601f01601f191690565b60208082526100a4929101906102af565b3461007257610304366004610067565b61009461030f610284565b604051918291826102e3565b90602082820312610072576100a49161011c565b346100725761008f61034236600461031b565b6104de565b61034f6104e7565b6100c461036d565b6100986100a46100a49290565b6100a490610357565b6100c461037a6000610364565b61055e565b6100c4610347565b6100a490546100ed565b6100a46000610387565b906100c492916103a96104e7565b610404565b6100a490610098906001600160a01b031682565b6100a4906103ae565b6100a4906103c2565b916100a4926103eb604082019360008301906100a7565b60208184039101526102af565b6040513d6000823e3d90fd5b61040d906103cb565b90634f1ef28691803b156100725761043a60009361044561042d60405190565b9687958694859460e01b90565b8452600484016103d4565b039134905af18015610470576104585750565b6100c4906000610468818361013f565b810190610067565b6103f8565b906100c4929161039b565b6100c49061048c6104e7565b6104966000610364565b61049f81610098565b6104a883610098565b146104b757506100c49061055e565b6104da906104c460405190565b631e4fbdf760e01b8152918291600483016100b4565b0390fd5b6100c490610480565b6104ef610391565b33906105036104fd83610098565b91610098565b0361050b5750565b6104da9061051860405190565b63118cdaa760e01b8152918291600483016100b4565b9061053e6100a461055a926103cb565b82546001600160a01b0319166001600160a01b03919091161790565b9055565b61058461057e61056e6000610387565b61057984600061052e565b6103cb565b916103cb565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06105af60405190565b600090a356fea26469706673582212203636babe96d3697e14fee97129a9912519d9f3148bc21e32c22b570b0e835b9c64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "initialOwner";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
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
        readonly inputs: readonly [];
        readonly name: "UPGRADE_INTERFACE_VERSION";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
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
            readonly internalType: "contract ITransparentUpgradeableProxy";
            readonly name: "proxy";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "upgradeAndCall";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): ProxyAdminInterface;
    static connect(address: string, runner?: ContractRunner | null): ProxyAdmin;
}
export {};

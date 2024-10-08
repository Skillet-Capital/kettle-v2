import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BigNumberish, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { TestERC20, TestERC20Interface } from "../../../contracts/test/TestERC20";
type TestERC20ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestERC20__factory extends ContractFactory {
    constructor(...args: TestERC20ConstructorParams);
    getDeployTransaction(decimals: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(decimals: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<TestERC20 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): TestERC20__factory;
    static readonly bytecode = "0x60e0604052346200004b576200001e62000018620000dc565b62000186565b604051610d91620005d382396080518161042d015260a05181610702015260c051816107290152610d9190f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200008857604052565b62000050565b90620000a56200009d60405190565b928362000066565b565b60ff8116036200004b57565b90505190620000a582620000a7565b906020828203126200004b57620000d991620000b3565b90565b620000d96200136480380380620000f3816200008e565b928339810190620000c2565b6001600160401b0381116200008857602090601f01601f19160190565b90620001326200012c83620000ff565b6200008e565b918252565b6200014360066200011c565b6505465737432360d41b602082015290565b620000d962000137565b6200016b60056200011c565b64054535432360dc1b602082015290565b620000d96200015f565b620000a5906200019562000155565b6200019f6200017c565b906200039c565b634e487b7160e01b600052602260045260246000fd5b9060016002830492168015620001df575b6020831014620001d957565b620001a6565b91607f1691620001cd565b620000d9620000d9620000d99290565b91906200020f620000d96200022793620001ea565b90835460001960089290920291821b191691901b1790565b9055565b620000a591600091620001fa565b81811062000245575050565b806200025560006001936200022b565b0162000239565b9190601f81116200026c57505050565b62000280620000a593600052602060002090565b906020601f840181900483019310620002a4575b6020601f90910104019062000239565b909150819062000294565b90620002b9815190565b906001600160401b0382116200008857620002e182620002da8554620001bc565b856200025c565b602090601f831160011462000320576200022792916000918362000314575b5050600019600883021c1916906002021790565b01519050388062000300565b601f198316916200033685600052602060002090565b9260005b81811062000377575091600293918560019694106200035d575b50505002019055565b01516000196008601f8516021c1916905538808062000354565b919360206001819287870151815501950192016200033a565b90620000a591620002af565b90620003ae620003b692600062000390565b600162000390565b6080524660a052620003c762000522565b60c052565b80546000939291620003ec620003e283620001bc565b8085529360200190565b91600181169081156200044357506001146200040757505050565b6200041b9192939450600052602060002090565b916000925b8184106200042e5750500190565b80548484015260209093019260010162000420565b92949550505060ff1916825215156020020190565b90620000d991620003cc565b90620000a562000482926200047860405190565b9384809262000458565b038362000066565b620000d99062000464565b620000d990620004ab906001600160a01b031682565b6001600160a01b031690565b620000d99062000495565b620000d990620004b7565b9052565b620004cd90620004ab565b90959492620000a594620005136200051a926200050c6080966200050560a088019c6000890152565b6020870152565b6040850152565b6060830152565b0190620004d1565b620005b4620005c16200053660006200048a565b6200054a62000543825190565b9160200190565b206200055630620004c2565b906200056160405190565b93849260208401927fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646917f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f86620004dc565b9081038252038262000066565b620005ce62000543825190565b209056fe6080604052600436101561001257600080fd5b60003560e01c806306fdde03146100e2578063095ea7b3146100dd57806318160ddd146100d857806323b872dd146100d3578063313ce567146100ce5780633644e515146100c957806340c10f19146100c457806370a08231146100bf5780637ecebe00146100ba57806395d89b41146100b5578063a9059cbb146100b0578063d505accf146100ab5763dd62ed3e036100f257610652565b6105f2565b610561565b610546565b61051f565b6104f4565b610471565b610456565b610418565b6103fc565b6103a7565b610357565b6102cb565b60009103126100f257565b600080fd5b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b9060016002830492168015610143575b602083101461013e57565b61010d565b91607f1691610133565b8054600093929161016a61016083610123565b8085529360200190565b91600181169081156101bc575060011461018357505050565b6101969192939450600052602060002090565b916000925b8184106101a85750500190565b80548484015260209093019260010161019b565b92949550505060ff1916825215156020020190565b906101db9161014d565b90565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761021657604052565b6101de565b9061023c6102359261022c60405190565b938480926101d1565b03836101f4565b565b9060001061024f576101db9061021b565b6100f7565b6101db60008061023e565b60005b8381106102725750506000910152565b8181015183820152602001610262565b6102a36102ac6020936102b693610297815190565b80835293849260200190565b9586910161025f565b601f01601f191690565b0190565b60208082526101db92910190610282565b346100f2576102db3660046100e7565b6102f26102e6610254565b604051918291826102ba565b0390f35b6001600160a01b031690565b6001600160a01b0381165b036100f257565b9050359061023c82610302565b8061030d565b9050359061023c82610321565b91906040838203126100f2576101db9060206103508286610314565b9401610327565b346100f2576102f261037361036d366004610334565b9061068f565b60405191829182901515815260200190565b6101db916008021c81565b906101db9154610385565b6101db60006002610390565b346100f2576103b73660046100e7565b6102f26103c261039b565b6040515b9182918290815260200190565b90916060828403126100f2576101db6103ec8484610314565b9360406103508260208701610314565b346100f2576102f26103736104123660046103d3565b916106ef565b346100f2576104283660046100e7565b6040517f000000000000000000000000000000000000000000000000000000000000000060ff168152602090f35b346100f2576104663660046100e7565b6102f26103c2610700565b346100f2576102f2610373610487366004610334565b90610753565b906020828203126100f2576101db91610314565b6101db906102f6906001600160a01b031682565b6101db906104a1565b6101db906104b5565b906104d1906104be565b600052602052604060002090565b60006104ef6101db9260036104c7565b610390565b346100f2576102f26103c261050a36600461048d565b6104df565b60006104ef6101db9260056104c7565b346100f2576102f26103c261053536600461048d565b61050f565b6101db6000600161023e565b346100f2576105563660046100e7565b6102f26102e661053a565b346100f2576102f2610373610577366004610334565b9061079b565b60ff811661030d565b9050359061023c8261057d565b60e0818303126100f2576105a78282610314565b926105b58360208401610314565b926105c38160408501610327565b926105d18260608301610327565b926101db6105e28460808501610586565b9360c06103508260a08701610327565b346100f257610611610605366004610593565b95949094939193610951565b604051005b91906040838203126100f2576101db9060206106328286610314565b9401610314565b6104ef6101db9261064d60009360046104c7565b6104c7565b346100f2576102f26103c2610668366004610616565b90610639565b6101db6101db6101db9290565b906101db6101db61068b9261066e565b9055565b6106a7826106a28361064d3360046104c7565b61067b565b7f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9256106e76106dd6106d7336104be565b936104be565b936103c660405190565b0390a3600190565b6106fa929190610ad3565b50600190565b7f0000000000000000000000000000000000000000000000000000000000000000460361074b577f000000000000000000000000000000000000000000000000000000000000000090565b6101db610c51565b61075d9190610cee565b600190565b6101db9081565b6101db9054610762565b634e487b7160e01b600052601160045260246000fd5b9190820391821161079657565b610773565b6107c16107a93360036104c7565b6107bb846107b683610769565b610789565b9061067b565b6107dc6107cf8260036104c7565b6107bb846102b683610769565b600080516020610d3c8339815191526106e76106dd6106d7336104be565b1561080157565b60405162461bcd60e51b815260206004820152601760248201527614115493525517d11150511312539157d1561412549151604a1b6044820152606490fd5b919461088f6108969298979561088860a09661087861023c9a61086860c08a019e60008b0152565b6001600160a01b03166020890152565b6001600160a01b03166040870152565b6060850152565b6080830152565b0152565b60208093926108bc6108b76102b69461190160f01b815260020190565b918252565b01918252565b61089661023c946108eb6060949897956108e1608086019a6000870152565b60ff166020850152565b6040830152565b6040513d6000823e3d90fd5b6102f66101db6101db9290565b6101db906108fe565b1561091b57565b60405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa9a4a3a722a960911b6044820152606490fd5b939094610a30600093976109db610a1160209761097661096e4290565b8210156107fa565b8b6109e78c8c6109db610987610700565b956109938360056104c7565b6109a961099f82610769565b91600183016107bb565b60405196879560208701957f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c987610840565b908103825203826101f4565b6109f96109f2825190565b9160200190565b2090610a0460405190565b9384928b8401928361089a565b610a1c6109f2825190565b2092610a2760405190565b948594856108c2565b838052039060015afa15610ace57610ab46106dd6106d77f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92593610aaf876106a28861064d610a8060005160001b90565b610a8d6102f6600061090b565b6001600160a01b038216141580610ab9575b610aa890610914565b60046104c7565b6104be565b0390a3565b506001600160a01b0381811690881614610a9f565b6108f2565b6106e76106dd6106d7600080516020610d3c83398151915293610af4600090565b5086610b13610b0e610b078460046104c7565b33906104c7565b610769565b6000198103610b55575b5050610b3a610b2d8260036104c7565b6107bb896107b683610769565b610aaf610b488760036104c7565b6107bb896102b683610769565b610b7091610b6291610789565b6106a2610b078460046104c7565b8638610b1d565b80546000939291610b8a61016083610123565b91600181169081156101bc5750600114610ba357505050565b610bb69192939450600052602060002090565b916000925b818410610bc85750500190565b805484840152602090930192600101610bbb565b906101db91610b77565b9061023c61023592610bf760405190565b93848092610bdc565b6101db90610be6565b9095949261023c94610c3b610c4292610c34608096610c2d60a088019c6000890152565b6020870152565b6040850152565b6060830152565b01906001600160a01b03169052565b6109db610cd2610c616000610c00565b610c6c6109f2825190565b20610c76306104be565b90610c8060405190565b93849260208401927fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc646917f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f86610c09565b610cdd6109f2825190565b2090565b9190820180921161079657565b610d0b610d0483610cff6002610769565b610ce1565b600261067b565b610d196107cf8260036104c7565b600080516020610d3c833981519152610ab46106dd6106d7610aaf600061090b56feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220d81808e2f43d4f02aaa800782f55ea89ad7cdd816a171b6d3427a941a62c8bf564736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "decimals";
            readonly type: "uint8";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "mint";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "ok";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TestERC20Interface;
    static connect(address: string, runner?: ContractRunner | null): TestERC20;
}
export {};

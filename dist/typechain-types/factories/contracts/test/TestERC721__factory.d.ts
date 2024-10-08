import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { TestERC721, TestERC721Interface } from "../../../contracts/test/TestERC721";
type TestERC721ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestERC721__factory extends ContractFactory {
    constructor(...args: TestERC721ConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<TestERC721 & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): TestERC721__factory;
    static readonly bytecode = "0x6080604052346200002657620000146200010e565b6040516110eb6200033e82396110eb90f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200006357604052565b6200002b565b90620000806200007860405190565b928362000041565b565b6001600160401b0381116200006357602090601f01601f19160190565b90620000b5620000af8362000082565b62000069565b918252565b620000c660076200009f565b665465737437323160c81b602082015290565b620000e3620000ba565b90565b620000f260066200009f565b6554535437323160d01b602082015290565b620000e3620000e6565b620000806200011c620000d9565b6200012662000104565b9062000323565b634e487b7160e01b600052602260045260246000fd5b906001600283049216801562000166575b60208310146200016057565b6200012d565b91607f169162000154565b620000e3620000e3620000e39290565b919062000196620000e3620001ae9362000171565b90835460001960089290920291821b191691901b1790565b9055565b620000809160009162000181565b818110620001cc575050565b80620001dc6000600193620001b2565b01620001c0565b9190601f8111620001f357505050565b620002076200008093600052602060002090565b906020601f8401819004830193106200022b575b6020601f909101040190620001c0565b90915081906200021b565b9062000240815190565b906001600160401b0382116200006357620002688262000261855462000143565b85620001e3565b602090601f8311600114620002a757620001ae9291600091836200029b575b5050600019600883021c1916906002021790565b01519050388062000287565b601f19831691620002bd85600052602060002090565b9260005b818110620002fe57509160029391856001969410620002e4575b50505002019055565b01516000196008601f8516021c19169055388080620002db565b91936020600181928787015181550195019201620002c1565b90620000809162000236565b90620003356200008092600062000317565b60016200031756fe6080604052600436101561001257600080fd5b60003560e01c806301ffc9a71461010257806306fdde03146100fd578063081812fc146100f8578063095ea7b3146100f357806318160ddd146100ee57806323b872dd146100e957806340c10f19146100e457806342842e0e146100df5780636352211e146100da57806370a08231146100d557806395d89b41146100d0578063a22cb465146100cb578063b88d4fde146100c6578063c87b56dd146100c15763e985e9c50361011a5761073e565b610698565b61067c565b6105df565b61058c565b610565565b610536565b61051d565b610501565b6104e8565b610494565b610476565b610416565b610355565b610149565b6001600160e01b031981165b0361011a57565b600080fd5b9050359061012c82610107565b565b9060208282031261011a576101429161011f565b90565b9052565b3461011a5761017761016461015f36600461012e565b61077a565b6040515b91829182901515815260200190565b0390f35b600091031261011a57565b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b90600160028304921680156101d2575b60208310146101cd57565b61019c565b91607f16916101c2565b805460009392916101f96101ef836101b2565b8085529360200190565b916001811690811561024b575060011461021257505050565b6102259192939450600052602060002090565b916000925b8184106102375750500190565b80548484015260209093019260010161022a565b92949550505060ff1916825215156020020190565b90610142916101dc565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176102a257604052565b61026a565b9061012c6102c1926102b860405190565b93848092610260565b0383610280565b906000106102d957610142906102a7565b610186565b6101426000806102c8565b60005b8381106102fc5750506000910152565b81810151838201526020016102ec565b61032d61033660209361034093610321815190565b80835293849260200190565b958691016102e9565b601f01601f191690565b0190565b60208082526101429291019061030c565b3461011a5761036536600461017b565b6101776103706102de565b60405191829182610344565b80610113565b9050359061012c8261037c565b9060208282031261011a5761014291610382565b6101426101426101429290565b906103ba906103a3565b600052602052604060002090565b610142916008021c5b6001600160a01b031690565b9061014291546103c8565b60006103f86101429260046103b0565b6103dd565b610145906103d1565b60208101929161012c91906103fd565b3461011a5761017761043161042c36600461038f565b6103e8565b60405191829182610406565b610113816103d1565b9050359061012c8261043d565b919060408382031261011a5761014290602061046f8286610446565b9401610382565b3461011a5761048f610489366004610453565b9061087d565b604051005b3461011a576104a436600461017b565b6101776104af61093b565b6040519182918290815260200190565b909160608284031261011a576101426104d88484610446565b93604061046f8260208701610446565b3461011a5761048f6104fb3660046104bf565b91610a45565b3461011a57610177610164610517366004610453565b90610b97565b3461011a5761048f6105303660046104bf565b91610c54565b3461011a5761017761043161054c36600461038f565b610d64565b9060208282031261011a5761014291610446565b3461011a576101776104af61057b366004610551565b610dd8565b610142600060016102c8565b3461011a5761059c36600461017b565b610177610370610580565b801515610113565b9050359061012c826105a7565b919060408382031261011a576101429060206105d88286610446565b94016105af565b3461011a5761048f6105f23660046105bc565b90610e34565b909182601f8301121561011a5781359167ffffffffffffffff831161011a57602001926001830284011161011a57565b9060808282031261011a5761063d8183610446565b9261064b8260208501610446565b926106598360408301610382565b92606082013567ffffffffffffffff811161011a5761067892016105f8565b9091565b3461011a5761048f61068f366004610628565b93929092610ee3565b3461011a576101776103706106ae36600461038f565b61100f565b919060408382031261011a576101429060206106cf8286610446565b9401610446565b610142906103d1906001600160a01b031682565b610142906106d6565b610142906106ea565b906103ba906106f3565b610142916008021c5b60ff1690565b906101429154610706565b6107396101429261073460009360056106fc565b6106fc565b610715565b3461011a576101776101646107543660046106b3565b90610720565b61076d6107676101429290565b60e01b90565b6001600160e01b03191690565b6107876301ffc9a761075a565b6001600160e01b03198216149081156107c9575b81156107a5575090565b90506107c56107b7635b5e139f61075a565b916001600160e01b03191690565b1490565b90506107d86380ac58cd61075a565b6001600160e01b03198216149061079b565b610142906103d1565b61014290546107ea565b6101429061070f565b61014290546107fd565b1561081757565b60405162461bcd60e51b815260206004820152600e60248201526d1393d517d055551213d49256915160921b6044820152606490fd5b906001600160a01b03905b9181191691161790565b90610872610142610879926106f3565b825461084d565b9055565b906108e26108dc6108d661089a6108958560026103b0565b6107f3565b6108a3816103d1565b6108ac336103d1565b148015610913575b6108bd90610810565b6108d1866108cc8760046103b0565b610862565b6106f3565b936106f3565b916103a3565b917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92561090d60405190565b600090a4565b506108bd61093461092f6109288460056106fc565b33906106fc565b610806565b90506108b4565b6101426127106103a3565b1561094d57565b60405162461bcd60e51b815260206004820152600a60248201526957524f4e475f46524f4d60b01b6044820152606490fd5b6103d16101426101429290565b6101429061097f565b1561099c57565b60405162461bcd60e51b81526020600482015260116024820152701253959053125117d49150d25412515395607a1b6044820152606490fd5b6101429081565b61014290546109d5565b9060001990610858565b90610a00610142610879926103a3565b82546109e6565b916001600160a01b0360089290920291821b911b610858565b9190610a31610142610879936106f3565b908354610a07565b61012c91600091610a20565b6108dc6108d6610b2f92949394610a7a610a6b610a666108958860026103b0565b6103d1565b610a74836103d1565b14610946565b610a9a610a8a610a66600061098c565b610a93886103d1565b1415610995565b610aa3816103d1565b610aac336103d1565b148015610b80575b8015610b5a575b610ac490610810565b610aeb610ad28260036106fc565b610ae5610ade826109dc565b6000190190565b906109f0565b610b0b610af98760036106fc565b610ae5610b05826109dc565b60010190565b610b1a866108cc8760026103b0565b6108d16000610b2a8760046103b0565b610a39565b917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef61090d60405190565b50610ac4610b6f610a666108958860046103b0565b610b78336103d1565b149050610abb565b50610b9261092f6109288360056106fc565b610ab4565b610ba19190611055565b600190565b9050519061012c82610107565b9060208282031261011a5761014291610ba6565b909161014293610bf0610bf792610be6608086019660008701906103fd565b60208501906103fd565b6040830152565b60608183039101526000815260200190565b6040513d6000823e3d90fd5b15610c1c57565b60405162461bcd60e51b815260206004820152601060248201526f155394d0519157d49150d2541251539560821b6044820152606490fd5b9091610c61818484610a45565b823b610c74610c7060006103a3565b9190565b14918215610c89575b505061012c9150610c15565b60209250610c9c6108d1610cc8956106f3565b906000610ca860405190565b809681958294610cbc63150b7a0260e01b90565b84523360048501610bc7565b03925af18015610d265761012c91600091610cf7575b50610cef630a85bd0160e11b6107b7565b143880610c7d565b610d19915060203d602011610d1f575b610d118183610280565b810190610bb3565b38610cde565b503d610d07565b610c09565b15610d3257565b60405162461bcd60e51b815260206004820152600a6024820152691393d517d3525395115160b21b6044820152606490fd5b610895610d7b91610d73600090565b5060026103b0565b9061012c82610d96610d90610a66600061098c565b916103d1565b1415610d2b565b15610da457565b60405162461bcd60e51b815260206004820152600c60248201526b5a45524f5f4144445245535360a01b6044820152606490fd5b610e0f61014291610de7600090565b50610e08610df8610a66600061098c565b610e01836103d1565b1415610d9d565b60036106fc565b6109dc565b9060ff90610858565b90610e2d61014261087992151590565b8254610e14565b610e4c82610e47836107343360056106fc565b610e1d565b7f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31610e86610e7c6108d6336106f3565b9361016860405190565b0390a3565b90826000939282370152565b919061033681610eae816103409560209181520190565b8095610e8b565b9093916101429593610bf0610ed692610be6608086019860008701906103fd565b6060818503910152610e97565b909291610ef1818584610a45565b833b610f00610c7060006103a3565b14938415610f17575b5050505061012c9150610c15565b60209450610f296108d16000926106f3565b92610f51610f3660405190565b97889687958694630a85bd0160e11b86523360048701610eb5565b03925af18015610d265761012c91600091610f82575b50610f78630a85bd0160e11b6107b7565b1438808080610f09565b610f9b915060203d602011610d1f57610d118183610280565b38610f67565b9061012c610fae60405190565b9283610280565b67ffffffffffffffff81116102a257602090601f01601f19160190565b90610fe4610fdf83610fb5565b610fa1565b918252565b610ff36008610fd2565b67746f6b656e55524960c01b602082015290565b610142610fe9565b50610142611007565b1561101f57565b60405162461bcd60e51b815260206004820152600e60248201526d1053149150511657d3525395115160921b6044820152606490fd5b90610b2f6108dc6108d6611069600061098c565b611075610a8a826103d1565b6110986110866108958760026103b0565b611092610d90846103d1565b14611018565b6110a6610af98760036106fc565b6108d1866108cc8760026103b056fea26469706673582212207934410ff5a3cca7388b721f5981fd5d35cd3b97ca43fe1d254205379b8b9db564736f6c63430008180033";
    static readonly abi: readonly [{
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
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
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
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "ApprovalForAll";
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
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
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
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "getApproved";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly name: "isApprovedForAll";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
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
            readonly name: "tokenId";
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
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
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
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
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
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "setApprovalForAll";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
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
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
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
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TestERC721Interface;
    static connect(address: string, runner?: ContractRunner | null): TestERC721;
}
export {};

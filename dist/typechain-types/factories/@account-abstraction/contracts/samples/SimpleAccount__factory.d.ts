import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { SimpleAccount, SimpleAccountInterface } from "../../../../@account-abstraction/contracts/samples/SimpleAccount";
type SimpleAccountConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SimpleAccount__factory extends ContractFactory {
    constructor(...args: SimpleAccountConstructorParams);
    getDeployTransaction(anEntryPoint: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(anEntryPoint: AddressLike, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<SimpleAccount & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): SimpleAccount__factory;
    static readonly bytecode = "0x60c06040523462000050576200001e62000018620000f3565b62000116565b604051611a0a620002ad82396080518181816113ae0152611504015260a051818181610d3601526115620152611a0a90f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200008d57604052565b62000055565b90620000aa620000a260405190565b92836200006b565b565b6001600160a01b031690565b90565b6001600160a01b038116036200005057565b90505190620000aa82620000bb565b906020828203126200005057620000b891620000cd565b620000b862001cb7803803806200010a8162000093565b928339810190620000dc565b620001206200012d565b60a052620000aa620001f5565b620000aa62000163565b620000b890620000ac906001600160a01b031682565b620000b89062000137565b620000b8906200014d565b6200016e3062000158565b608052565b620000b89060401c60ff1690565b620000b8905462000173565b620000b8905b6001600160401b031690565b620000b890546200018d565b620000b89062000193906001600160401b031682565b90620001d5620000b8620001f192620001ab565b82546001600160401b0319166001600160401b03919091161790565b9055565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00620002218162000181565b6200029a5762000231816200019f565b6001600160401b039190829081160362000249575050565b816200027b7fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2936200029593620001c1565b604051918291826001600160401b03909116815260200190565b0390a1565b60405163f92ee8a960e01b8152600490fdfe6080604052600436101561001b575b361561001957600080fd5b005b60003560e01c806301ffc9a71461012b578063150b7a021461012657806319822f7c1461012157806347e1da2a1461011c5780634a58db19146101175780634d44560d146101125780634f1ef2861461010d57806352d1902d146101085780638da5cb5b14610103578063ad3cb1cc146100fe578063b0d691fe146100f9578063b61d27f6146100f4578063bc197c81146100ef578063c399ec88146100ea578063c4d66de8146100e5578063d087d288146100e05763f23a6e610361000e576108b6565b61083c565b610824565b6107f5565b6107d0565b61072f565b6106c7565b610661565b61058d565b61052f565b61051b565b610407565b6103d8565b6103a9565b6102e5565b61025a565b610172565b6001600160e01b031981165b0361014357565b600080fd5b9050359061015582610130565b565b906020828203126101435761016b91610148565b90565b9052565b346101435761019f61018d610188366004610157565b6108d8565b60405191829182901515815260200190565b0390f35b6001600160a01b031690565b61013c816101a3565b90503590610155826101af565b8061013c565b90503590610155826101c5565b909182601f83011215610143578135916001600160401b03831161014357602001926001830284011161014357565b906080828203126101435761021c81836101b8565b9261022a82602085016101b8565b9261023883604083016101cb565b9260608201356001600160401b0381116101435761025692016101d8565b9091565b346101435761019f610279610270366004610207565b93929092610931565b604051918291826001600160e01b0319909116815260200190565b90816101209103126101435790565b90916060828403126101435781356001600160401b038111610143576102ce8461016b928501610294565b9360406102de82602087016101cb565b94016101cb565b346101435761019f6103016102fb3660046102a3565b91610954565b6040519182918290815260200190565b909182601f83011215610143578135916001600160401b03831161014357602001926020830284011161014357565b906060828203126101435781356001600160401b0381116101435781610367918401610311565b92909360208201356001600160401b0381116101435783610389918401610311565b92909360408201356001600160401b038111610143576102569201610311565b34610143576103c86103bc366004610340565b94939093929192610a64565b604051005b600091031261014357565b6103e33660046103cd565b6103c8610bae565b91906040838203126101435761016b9060206102de82866101b8565b34610143576103c861041a3660046103eb565b90610cb3565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761045757604052565b610420565b9061015561046960405190565b9283610436565b6001600160401b03811161045757602090601f01601f19160190565b0190565b90826000939282370152565b909291926104b16104ac82610470565b61045c565b938185528183011161014357610155916020850190610490565b9080601f830112156101435781602061016b9335910161049c565b919091604081840312610143576104fd83826101b8565b9260208201356001600160401b0381116101435761016b92016104cb565b6103c86105293660046104e6565b90610cdd565b346101435761053f3660046103cd565b61019f610301610d2a565b61016b916008021c6001600160a01b031690565b9061016b915461054a565b61016b60008061055e565b61016e906101a3565b6020810192916101559190610574565b346101435761059d3660046103cd565b61019f6105a8610569565b6040519182918261057d565b906105c16104ac83610470565b918252565b6105d060056105b4565b640352e302e360dc1b602082015290565b61016b6105c6565b61016b6105e1565b61016b6105e9565b60005b83811061060c5750506000910152565b81810151838201526020016105fc565b61063d61064660209361048c93610631815190565b80835293849260200190565b958691016105f9565b601f01601f191690565b602080825261016b9291019061061c565b34610143576106713660046103cd565b61019f61067c6105f1565b60405191829182610650565b61016b906101a3906001600160a01b031682565b61016b90610688565b61016b9061069c565b61016e906106a5565b60208101929161015591906106ae565b34610143576106d73660046103cd565b61019f6106e2610d34565b604051918291826106b7565b916060838303126101435761070382846101b8565b9261071183602083016101cb565b9260408201356001600160401b0381116101435761025692016101d8565b34610143576103c86107423660046106ee565b92919091610d58565b9160a0838303126101435761076082846101b8565b9261076e83602083016101b8565b9260408201356001600160401b038111610143578161078e918401610311565b92909360608201356001600160401b03811161014357836107b0918401610311565b92909360808201356001600160401b0381116101435761025692016101d8565b346101435761019f6102796107e636600461074b565b96959095949194939293610d6e565b34610143576108053660046103cd565b61019f610301610dab565b906020828203126101435761016b916101b8565b34610143576103c8610837366004610810565b61103b565b346101435761084c3660046103cd565b61019f610301611088565b91909160a0818403126101435761086e83826101b8565b9261087c81602084016101b8565b9261088a82604085016101cb565b9261089883606083016101cb565b9260808201356001600160401b0381116101435761025692016101d8565b346101435761019f6102796108cc366004610857565b949390939291926110c5565b630a85bd0160e11b6001600160e01b0319821614908115610916575b81156108fe575090565b6301ffc9a760e01b91506001600160e01b0319161490565b6001600160e01b03198116630271189760e51b1491506108f4565b505050505061093e600090565b50630a85bd0160e11b90565b3561016b816101c5565b929161098060206109796101559461096a600090565b5061097361112b565b87611177565b950161094a565b50611219565b61016b61016b61016b9290565b1561099a57565b60405162461bcd60e51b815260206004820152601360248201527277726f6e67206172726179206c656e6774687360681b6044820152606490fd5b0390fd5b634e487b7160e01b600052603260045260246000fd5b91908110156109ff576020020190565b6109d9565b3561016b816101af565b903590601e19368290030182121561014357018035906001600160401b038211610143576020019136829003831361014357565b908210156109ff5760206102569202810190610a0e565b61016b91369161049c565b909194929395610a726112aa565b8295610a88858089149081610b79575b50610993565b85600096610a9c610a9889610986565b9190565b03610b10575050610aac85610986565b865b811015610b0657610aff81610af98a610af3610ae1848b610adb610ad6610aae9a8e8e6109ef565b610a04565b94610a42565b610aed8d939293610986565b92610a59565b916112f4565b60010190565b9050610aac565b5095505050505050565b939291909795610b1f90610986565b875b811015610b6e57610b6781610af98b8a610af3610b61858d610adb610b5c8f9b8f9c8f610ad6610b219f8490610b56936109ef565b996109ef565b61094a565b90610a59565b9050610b1f565b509650505050505050565b905087610b866000610986565b8114918215610b98575b505038610a82565b9150143880610b90565b6040513d6000823e3d90fd5b610bbe610bb9610d34565b6106a5565b63b760faf9610bcc306106a5565b823b1561014357610bfe92610bf3600093610be660405190565b9586948593849360e01b90565b83526004830161057d565b039134905af18015610c2957610c115750565b610155906000610c218183610436565b8101906103cd565b610ba2565b9061015591610c3b61135b565b610c5f565b916020610155929493610c5b60408201966000830190610574565b0152565b610c6a610bb9610d34565b91823b1561014357610ca29260009283610c8360405190565b809681958294610c9763205c287860e01b90565b845260048401610c40565b03925af18015610c2957610c115750565b9061015591610c2e565b9061015591610cca6113a3565b9061015591610cd88161141a565b611423565b9061015591610cbd565b61016b90610cf36114f3565b610d21565b61016b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc610986565b5061016b610cf8565b61016b6000610ce7565b7f000000000000000000000000000000000000000000000000000000000000000090565b9161015593610af391610d696112aa565b610a59565b5050505050505050610d7e600090565b5063bc197c8160e01b90565b90505190610155826101c5565b906020828203126101435761016b91610d8a565b610de26020610dbb610bb9610d34565b610dc4306106a5565b90610dce60405190565b938492839182916370a0823160e01b610bf3565b03915afa908115610c2957600091610df8575090565b61016b915060203d602011610e1a575b610e128183610436565b810190610d97565b503d610e08565b61016b9060401c60ff1690565b61016b9054610e21565b61016b905b6001600160401b031690565b61016b9054610e38565b610e3d61016b61016b9290565b906001600160401b03905b9181191691161790565b610e3d61016b61016b926001600160401b031690565b90610e9b61016b610ea292610e75565b8254610e60565b9055565b9060ff60401b9060401b610e6b565b90610ec561016b610ea292151590565b8254610ea6565b61016e90610e53565b6020810192916101559190610ecc565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a009081610f21610f1b610f1783610e2e565b1590565b91610e49565b90600092610f2e84610e53565b6001600160401b038416148061102b575b600193610f5b610f4e86610e53565b916001600160401b031690565b149081611007575b155b9081610ffe575b50610fec57610f959082610f8c86610f8387610e53565b98019788610e8b565b610fdd57611032565b610f9e57505050565b610fcc610fd8927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d294610eb5565b60405191829182610ed5565b0390a1565b610fe78487610eb5565b611032565b60405163f92ee8a960e01b8152600490fd5b15905038610f6c565b9050610f65611015306106a5565b3b611022610a9888610986565b14919050610f63565b5081610f3f565b61015590611555565b61015590610ee5565b61105161016b61016b9290565b6001600160c01b031690565b61016e90611044565b91602061015592949361108160408201966000830190610574565b019061105d565b610de26020600061109a610bb9610d34565b6110a3306106a5565b6040518095819482936110ba6335567e1a60e01b90565b845260048401611066565b5050505050506110d3600090565b5063f23a6e6160e01b90565b156110e657565b60405162461bcd60e51b815260206004820152601c60248201527f6163636f756e743a206e6f742066726f6d20456e747279506f696e74000000006044820152606490fd5b61015561114161113c610bb9610d34565b6101a3565b61114a336101a3565b146110df565b61016b906101a3565b61016b9054611150565b61016b6001610986565b61016b6000610986565b906111df61113c6111bd6111e59361118d600090565b507f19457468657265756d205369676e6564204d6573736167653a0a333200000000600052601c52603c60002090565b6111d9610b616111cd6000611159565b96610100810190610a0e565b906115ce565b916101a3565b036111f25761016b61116d565b61016b611163565b3d15611214576112093d6105b4565b903d6000602084013e565b606090565b6112236000610986565b810361122c5750565b6000809161123c610bb9336106a5565b82199161124860405190565b9182800393f1506112576111fa565b50565b1561126157565b60405162461bcd60e51b8152806109d5600482016020808252818101527f6163636f756e743a206e6f74204f776e6572206f7220456e747279506f696e74604082015260600190565b6112b861113c610bb9610d34565b6112c1336101a3565b1480156112d2575b6101559061125a565b506101556112e361113c6000611159565b6112ec336101a3565b1490506112c9565b916000928392602083519301915af161131361130e6111fa565b911590565b61131a5750565b602081519101fd5b1561132957565b60405162461bcd60e51b815260206004820152600a60248201526937b7363c9037bbb732b960b11b6044820152606490fd5b61136861113c6000611159565b611371336101a3565b148015611382575b61015590611322565b5061015561139261113c306106a5565b61139b336101a3565b149050611379565b6113ac306106a5565b7f0000000000000000000000000000000000000000000000000000000000000000906113da6111df836101a3565b149081156113fc575b506113ea57565b60405163703e46dd60e11b8152600490fd5b90506114126111df61140c6115e4565b926101a3565b1415386113e3565b5061015561135b565b90611430610bb9836106a5565b90602061143c60405190565b6352d1902d60e01b815292839060049082905afa600092816114d2575b5061148c57505060016114695750565b6109d59061147660405190565b634c9c8ce360e01b81529182916004830161057d565b90929161149a61016b610cf8565b84036114ab576101559293506115fa565b6109d5846114b860405190565b632a87526960e21b81529182916004830190815260200190565b6114ec91935060203d602011610e1a57610e128183610436565b9138611459565b6114fc306106a5565b6115286111df7f00000000000000000000000000000000000000000000000000000000000000006101a3565b036113ea57565b906001600160a01b0390610e6b565b9061154e61016b610ea2926106a5565b825461152f565b61156090600061153e565b7f000000000000000000000000000000000000000000000000000000000000000061159d6115976115916000611159565b926106a5565b916106a5565b907f47e55c76e7a6f1fd8996a1da8008c1ea29699cca35e7bcd057f2dec313b6e5de6115c860405190565b600090a3565b61016b916115db91611679565b90929192611719565b61016b60006115f461016b610cf8565b01611159565b90611604826117e2565b61160d826106a5565b7fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b61163760405190565b600090a2805161164a610a986000610986565b11156116595761125791611831565b505061015561180d565b6101a361016b61016b9290565b61016b90611663565b90600091611685825190565b611692610a986041610986565b036116bc576116b592506020820151906060604084015193015160001a90611888565b9192909190565b5090506116d96116d46116cf6000611670565b925190565b610986565b909160029190565b634e487b7160e01b600052602160045260246000fd5b6004111561170157565b6116e1565b90610155826116f7565b61016b90610986565b6117236000611706565b61172c82611706565b03611735575050565b61173f6001611706565b61174882611706565b0361175f5760405163f645eedf60e01b8152600490fd5b6117696002611706565b61177282611706565b036117a0576109d561178383611710565b60405163fce698f760e01b81529182916004830190815260200190565b6117b36117ad6003611706565b91611706565b146117bb5750565b6109d5906117c860405190565b6335e2f38360e21b81529182916004830190815260200190565b803b6117f1610a986000610986565b146114695761015590600061180761016b610cf8565b0161153e565b6118176000610986565b341161181f57565b60405163b398979f60e01b8152600490fd5b60008061016b93611840606090565b50602081519101845af46118526111fa565b91611943565b610c5b61015594611881606094989795611877608086019a6000870152565b60ff166020850152565b6040830152565b909161189384611710565b6118b5610a986fa2a8918ca85bafe22016d0b997e4df60600160ff1b03610986565b1161192f57906118d7602094600094936118ce60405190565b94859485611858565b838052039060015afa15610c29576000516000916118f483611670565b6118fd816101a3565b611906846101a3565b1461191b575061191583610986565b91929190565b91509161192790610986565b909160019190565b50505061193c6000611670565b9160039190565b9061194e57506119a5565b815161195d610a986000610986565b148061198f575b61196c575090565b6109d59061197960405190565b639996b31560e01b81529182916004830161057d565b50803b61199f610a986000610986565b14611964565b80516119b4610a986000610986565b11156119c257805190602001fd5b604051630a12f52160e11b8152600490fdfea2646970667358221220b1fd2358528e65d999331e9c0368269f23f75bf6915610f5568a7e54ae6b375064736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "anEntryPoint";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [];
        readonly name: "ECDSAInvalidSignature";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "length";
            readonly type: "uint256";
        }];
        readonly name: "ECDSAInvalidSignatureLength";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "ECDSAInvalidSignatureS";
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
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotInitializing";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "UUPSUnauthorizedCallContext";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "slot";
            readonly type: "bytes32";
        }];
        readonly name: "UUPSUnsupportedProxiableUUID";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "version";
            readonly type: "uint64";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "contract IEntryPoint";
            readonly name: "entryPoint";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "SimpleAccountInitialized";
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
        readonly name: "addDeposit";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "entryPoint";
        readonly outputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "dest";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "func";
            readonly type: "bytes";
        }];
        readonly name: "execute";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "dest";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "value";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "func";
            readonly type: "bytes[]";
        }];
        readonly name: "executeBatch";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getDeposit";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getNonce";
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
            readonly name: "anOwner";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        }, {
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155BatchReceived";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
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
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC1155Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
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
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "onERC721Received";
        readonly outputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "pure";
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
        readonly name: "proxiableUUID";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "upgradeToAndCall";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "nonce";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "initCode";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes32";
                readonly name: "accountGasLimits";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint256";
                readonly name: "preVerificationGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes32";
                readonly name: "gasFees";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "paymasterAndData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PackedUserOperation";
            readonly name: "userOp";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32";
            readonly name: "userOpHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "missingAccountFunds";
            readonly type: "uint256";
        }];
        readonly name: "validateUserOp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "validationData";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "withdrawAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "withdrawDepositTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): SimpleAccountInterface;
    static connect(address: string, runner?: ContractRunner | null): SimpleAccount;
}
export {};

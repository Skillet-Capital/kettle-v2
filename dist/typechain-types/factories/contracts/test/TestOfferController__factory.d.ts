import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { TestOfferController, TestOfferControllerInterface } from "../../../contracts/test/TestOfferController";
type TestOfferControllerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestOfferController__factory extends ContractFactory {
    constructor(...args: TestOfferControllerConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<TestOfferController & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): TestOfferController__factory;
    static readonly bytecode = "0x60806040523461001a57604051612564610020823961256490f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063017d0ae01461011257806308a8e4a31461010d578063406eedd6146101085780634ae25a86146101035780635cf39d01146100fe578063627cdcb9146100f9578063715018a6146100f4578063754e71c5146100ef57806379ba5097146100ea5780637ecebe00146100e55780637f99d691146100e05780638129fc1c146100db5780638da5cb5b146100d6578063cee72578146100d1578063e30c3978146100cc5763f2fde38b0361013657610603565b6105e8565b6105cd565b610591565b610560565b610545565b610515565b6104d9565b6104b7565b610429565b610411565b6103e4565b610317565b6102d4565b610251565b61020d565b6001600160a01b031690565b90565b61012f81610117565b0361013657565b600080fd5b9050359061014882610126565b565b8061012f565b905035906101488261014a565b919060408382031261013657610123906020610179828661013b565b9401610150565b61012390610117906001600160a01b031682565b61012390610180565b61012390610194565b906101b09061019d565b600052602052604060002090565b6101236101236101239290565b906101b0906101be565b610123916008021c81565b9061012391546101d5565b610204610123926101ff600093603a6101a6565b6101cb565b6101e0565b9052565b346101365761023961022961022336600461015d565b906101eb565b6040519182918290815260200190565b0390f35b906020828203126101365761012391610150565b346101365761023961022961026736600461023d565b610632565b909182601f83011215610136578135916001600160401b03831161013657602001926020830284011161013657565b919091604081840312610136576102b2838261013b565b9260208201356001600160401b038111610136576102d0920161026c565b9091565b34610136576102ed6102e736600461029b565b916106df565b604051005b906020828203126101365781356001600160401b038111610136576102d0920161026c565b34610136576102ed61032a3660046102f2565b906106ea565b90816102809103126101365790565b909182601f83011215610136578135916001600160401b03831161013657602001926001830284011161013657565b909161030082840312610136576103858383610150565b926103938160208501610330565b926103a2826102a08301610150565b926102c08201356001600160401b03811161013657836103c391840161033f565b9290936102e08201356001600160401b038111610136576102d0920161026c565b34610136576102396102296103fa36600461036e565b95949094939193610728565b600091031261013657565b3461013657610421366004610406565b6102ed610736565b3461013657610439366004610406565b6102ed610777565b90816101e09103126101365790565b919061024083820312610136576104678184610150565b926104758260208301610441565b926102008201356001600160401b038111610136578361049691840161033f565b9290936102208201356001600160401b038111610136576102d0920161026c565b34610136576102396102296104cd366004610450565b9493909392919261077f565b34610136576104e9366004610406565b6102ed61078d565b90602082820312610136576101239161013b565b60006102046101239260076101a6565b346101365761023961022961052b3660046104f1565b610505565b90610280828203126101365761012391610330565b346101365761023961022961055b366004610530565b6107dd565b3461013657610570366004610406565b6102ed610a1b565b61020990610117565b6020810192916101489190610578565b34610136576105a1366004610406565b6102396105ac610a36565b60405191829182610581565b906101e0828203126101365761012391610441565b34610136576102396102296105e33660046105b8565b610a63565b34610136576105f8366004610406565b6102396105ac610a6c565b34610136576102ed6106163660046104f1565b610b0e565b906101b0565b6101239081565b6101239054610621565b61064961012391610641600090565b50603b61061b565b610628565b90610148929161065c610b17565b610696565b634e487b7160e01b600052603260045260246000fd5b9190811015610687576020020190565b610661565b356101238161014a565b9282919060005b845b8110156106d7576106d0816106ca6106c36106be61069f958989610677565b61068c565b8933610b56565b60010190565b905061069d565b509350505050565b90610148929161064e565b909190829160005b835b8110156107215761071a816106ca6107136106be6106f4958a89610677565b3333610b56565b90506106f2565b5092505050565b610123969594939290610c4f565b61014833610e9d565b610747610b17565b610148610765565b6101176101236101239290565b6101239061074f565b610148610772600061075c565b610f33565b61014861073f565b610123959493929190610f62565b33610796610a6c565b6107a86107a283610117565b91610117565b036107b65761014890610f33565b6107d9906107c360405190565b63118cdaa760e01b815291829160048301610581565b0390fd5b6101239061110c565b6101239060401c5b60ff1690565b61012390546107e6565b610123905b6001600160401b031690565b61012390546107fe565b6108036101236101239290565b906001600160401b03905b9181191691161790565b610803610123610123926001600160401b031690565b906108616101236108689261083b565b8254610826565b9055565b9060ff60401b9060401b610831565b9061088b61012361086892151590565b825461086c565b61020990610819565b6020810192916101489190610892565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00806108e66108e06108dc836107f4565b1590565b9161080f565b6000916108f283610819565b6001600160401b03831614806109f3575b60019261091f61091285610819565b916001600160401b031690565b1490816109cb575b155b90816109c2575b506109b0578061094c8461094385610819565b96019586610851565b6109a1575b6109596109fa565b61096257505050565b61099061099c927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29461087b565b6040519182918261089b565b0390a1565b6109ab828561087b565b610951565b60405163f92ee8a960e01b8152600490fd5b15905038610930565b90506109296109d93061019d565b3b6109ea6109e6876101be565b9190565b14919050610927565b5080610903565b610a026111ec565b610a0a611202565b610a12611263565b61014833610f33565b6101486108ab565b61012390610117565b6101239054610a23565b61012360007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610a2c565b6101239061126b565b6101236000610a5d6112ff565b61014890610a85610b17565b610ab0565b906001600160a01b0390610831565b90610aa96101236108689261019d565b8254610a8a565b610ac4816000610abe6112ff565b01610a99565b610add610ad7610ad2610a36565b61019d565b9161019d565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700610b0860405190565b600090a3565b61014890610a79565b610b1f610a36565b3390610b2d6107a283610117565b036107b65750565b9060001990610831565b90610b4f610123610868926101be565b8254610b35565b610b8a610b84610b9092949394610ad2610b7060016101be565b610b7f876101ff8a603a6101a6565b610b3f565b9361019d565b916101be565b917f3d4f9f1802e8d452c853ecb7e67f0b2952a80ab67afd1bbe07e7b94fd46cb778610bbb60405190565b600090a4565b3561012381610126565b0190565b6002111561013657565b634e487b7160e01b600052602160045260246000fd5b60021115610bf957565b610bd9565b9061014882610bef565b3561012381610bcf565b610123620186a06101be565b634e487b7160e01b600052601160045260246000fd5b9190610c3f565b9290565b8203918211610c4a57565b610c1e565b91969590929394610c5e600090565b5060808801610c6c81610bc1565b610c816107a2610c7c600061075c565b610117565b14159081610e70575b50610e3c57610cb29260a08901610cac6040610ca583610c08565b920161068c565b90611323565b610100850192610cc46080850161068c565b610ccc610c12565b908110908115610e21575b50610e0f57610ce58661110c565b92610d2960408598610d236060820195610cfe87610bc1565b95610d0c610240850161068c565b96610260850197610d1c8961068c565b918c6113c9565b01610c08565b610d3c610d366000610bfe565b91610bfe565b03610dd6575050610d526101236040850161068c565b81118015610dbf575b610dad57610d84602093610d7f610d7661064986603b61061b565b9586920161068c565b610c34565b8111610d9b5761014892610b7f910191603b61061b565b60405163cfe9d93160e01b8152600490fd5b604051635697666160e01b8152600490fd5b50610dcf6101236060850161068c565b8110610d5b565b9092506101489350610b7f9150610e09610e03610dfc610df660016101be565b95610bc1565b603a6101a6565b9161068c565b906101cb565b604051636a43f8d160e01b8152600490fd5b9050610e356109e6610c3b60a0880161068c565b1138610cd7565b60405162461bcd60e51b815260206004820152600c60248201526b24b73b30b634b22a30b5b2b960a11b6044820152606490fd5b610e7a9150610bc1565b610e866107a233610117565b141538610c8a565b6000198114610c4a5760010190565b610eca610b8a610eae8360076101a6565b92610ad2610ec3610ebe86610628565b610e8e565b8095610b3f565b907fa82a649bbd060c9099cd7b7326e2b0dc9e9af0836480e0f849dc9eaa79710b3b610b0860405190565b916001600160a01b0360089290920291821b911b610831565b9190610f1f6101236108689361019d565b908354610ef5565b61014891600091610f0e565b61014890610f4b600080610f456112ff565b01610f27565b611428565b80151561012f565b3561012381610f50565b919594939160808201610f7481610bc1565b610f846107a2610c7c600061075c565b14159081611022575b50610e3c5761014894610b7f93610fa96108dc60208601610f58565b611004575b505050610ff1610fbd8261126b565b9384976060840195610fce87610bc1565b946101c0610fdf6101a0830161068c565b910195610feb8761068c565b926113c9565b610e09610e03610dfc610df660016101be565b61101a9260a08501610cac6040610ca583610c08565b388080610fae565b61102c9150610bc1565b6110386107a233610117565b141538610f8d565b61012390610bfe565b61020990611040565b99979593919c9b9a98969492909c6101808b019d60008c01611072919052565b60208b0161107f91611049565b151560408a01526060890161109391611049565b608088016110a091610578565b60a087016110ad91610578565b60c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761110757604052565b6110d0565b6111d6602061111b6004610628565b6111ca61112785610c08565b94611133848201610f58565b9061114060408201610c08565b90606081019161114f83610bc1565b61115b60808401610bc1565b61116760a085016114e0565b906111756101008601611571565b92611183610200870161161a565b946111b46106496111ad6111a76102606111a06102408d0161068c565b9b0161068c565b9a610bc1565b60076101a6565b986111be60405190565b9e8f9d8e019c8d611052565b908103825203826110e6565b6111e86111e1825190565b9160200190565b2090565b610148611202565b90610b4f6101236108689290565b61014861123f61125461123861124d61123161124661121f611ceb565b60069c959a93969c98919294986111f4565b60056111f4565b60046111f4565b60036111f4565b60026111f4565b60016111f4565b60006111f4565b610148611d6d565b61014861125b565b6111d6602061127a6006610628565b6111ca61128685610c08565b94611292848201610f58565b9061129f60408201610c08565b9060608101916112ae83610bc1565b6112ba60808401610bc1565b6112c660a085016114e0565b906112d46101008601611dc0565b926112e2610160870161161a565b946111b46106496111ad6111a76101c06111a06101a08d0161068c565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b939093611333610d366001610bfe565b0361139c57906108dc929161135361134d611384966101be565b926101be565b61137261135f60405190565b60208101928352918290604082016111ca565b61137d6111e1825190565b2092611dfc565b61138a57565b604051631037b7f560e11b8152600490fd5b5090506113ac6109e66113b19390565b141590565b6113b757565b60405163c1ab6dc160e01b8152600490fd5b93816113d89394969295612055565b4211611416576113f0916101ff61064992603a6101a6565b6113fd6109e660016101be565b1461140457565b6040516305c934c360e01b8152600490fd5b604051639cb1308760e01b8152600490fd5b611462610ad77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610ad28461145c83610a2c565b92610a99565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0610b0860405190565b61012f81610a23565b356101238161148d565b6102099061019d565b6114dc610148946114d26060949897956114c8608086019a6000870152565b6020850190611049565b60408301906114a0565b0152565b6111d66114ed6001610628565b6114f683610c08565b906111ca611512604061150b60208801611496565b960161068c565b6040519586946020860194856114a9565b9694929099989795939161012088019a6000890161153f919052565b6020880161154c916114a0565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b6111d661157e6003610628565b61158783611496565b906111ca6115976020860161068c565b946115a46040820161068c565b906115b16060820161068c565b6115bd6080830161068c565b6115c960a0840161068c565b916115e260e06115db60c0870161068c565b950161068c565b946115ec60405190565b9a8b9960208b01998a611523565b9081526060810193926101489290916040916114dc906020830190610578565b6111d66116276002610628565b916116366020610ca583610bc1565b926111ca61164360405190565b9485936020850193846115fa565b60196010600f600c600d600195611677816c08a92a06e626488dedac2d2dc5609b1b9052565b01611690816b1cdd1c9a5b99c81b985b594b60a21b9052565b016116ac816e1cdd1c9a5b99c81d995c9cda5bdb8b608a1b9052565b016116c9816f1d5a5b9d0c8d4d8818da185a5b92590b60821b9052565b016116ef81781859191c995cdcc81d995c9a599e5a5b99d0dbdb9d1c9858dd603a1b9052565b01610bcb81602960f81b9052565b60405190610148826020810161171281611651565b908103825203836110e6565b60126013600f600b600194611740816a086ded8d8c2e8cae4c2d8560ab1b9052565b0161175c816e1d5a5b9d0e0818dc9a5d195c9a584b608a1b9052565b0161177c81721859191c995cdcc818dbdb1b1958dd1a5bdb8b606a1b9052565b016116ef81713ab4b73a191a9b1034b232b73a34b334b2b960711b9052565b6040519061014882602081016117128161171e565b600c601260096001936117ce816808ccacaa8cae4dae6560bb1b9052565b016117ed81711859191c995cdcc81c9958da5c1a595b9d0b60721b9052565b016116ef816b75696e74323536207261746560a01b9052565b604051906101488260208101611712816117b0565b601360116014600d601280600f8581600199611848816e098dec2dc9ecccccae4a8cae4dae65608b1b9052565b0161186681701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b01611882816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b016118a181711d5a5b9d0c8d4d881b585e105b5bdd5b9d0b60721b9052565b016118c081711d5a5b9d0c8d4d881b5a5b905b5bdd5b9d0b60721b9052565b016118da816c1d5a5b9d0c8d4d881c985d194b609a1b9052565b016118fb81731d5a5b9d0c8d4d88191959985d5b1d14985d194b60621b9052565b0161191981701d5a5b9d0c8d4d88191d5c985d1a5bdb8b607a1b9052565b016116ef81721d5a5b9d0c8d4d8819dc9858d954195c9a5bd9606a1b9052565b6040519061014882602081016117128161181b565b60005b8381106119615750506000910152565b8181015183820152602001611951565b610bcb61198992602092611983815190565b94859290565b9384910161194e565b91611b10611b10926001600d8060138160156016600e80600b6101239f9e81600a80926119cb8169098dec2dc9ecccccae4560b31b9052565b016119e3816a1d5a5b9d0e081ada5b990b60aa1b9052565b016119fa8169189bdbdb081cdbd99d0b60b21b9052565b01611a12816a1d5a5b9d0e081cda59194b60aa1b9052565b01611a2d816d1859191c995cdcc81b585ad95c8b60921b9052565b01611a48816d1859191c995cdcc81d185ad95c8b60921b9052565b01611a6b817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b01611a8d8174131bd85b93d999995c95195c9b5cc81d195c9b5ccb605a1b9052565b01611aa7816c11995955195c9b5cc81999594b609a1b9052565b01611ac781721d5a5b9d0c8d4d88195e1c1a5c985d1a5bdb8b606a1b9052565b01611ae1816c1d5a5b9d0c8d4d881cd85b1d0b609a1b9052565b01611afb816c75696e74323536206e6f6e636560981b9052565b01611b0981602960f81b9052565b0190611971565b90611971565b9061014891939293611712611b2a60405190565b958693602085019384611992565b600e600f601180600194611b5f817009ac2e4d6cae89ecccccae4a8cae4dae65607b1b9052565b01611b7d81701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b01611b99816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b016116ef816d75696e743235362072656261746560901b9052565b60405190610148826020810161171281611b38565b91611b10611b10926001600d8060138160176016600e80600b6101239f9e81600c600a92611c05816b09ac2e4d6cae89ecccccae4560a31b9052565b01611c1d816a1d5a5b9d0e081ada5b990b60aa1b9052565b01611c348169189bdbdb081cdbd99d0b60b21b9052565b01611c4c816a1d5a5b9d0e081cda59194b60aa1b9052565b01611c67816d1859191c995cdcc81b585ad95c8b60921b9052565b01611c82816d1859191c995cdcc81d185ad95c8b60921b9052565b01611ca5817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b01611a8d817613585c9ad95d13d999995c95195c9b5cc81d195c9b5ccb604a1b9052565b9061014891939293611712611cdd60405190565b958693602085019384611bc9565b611cf36116fd565b611cfe6111e1825190565b2090611d0861179b565b8051602082012091611d18611806565b8051602082012092611d28611939565b926111d6611d44611d37865190565b6020870120958585611b16565b611d4f6111e1825190565b2093611d59611bb4565b90611d62825190565b602083012094611cc9565b611d786108dc61224c565b611d7e57565b604051631afcd79f60e31b8152600490fd5b6114dc61014894611db9606094989795611daf608086019a6000870152565b60208501906114a0565b6040830152565b6111d6611dcd6005610628565b611dd683611496565b906111ca611deb604061150b6020880161068c565b604051958694602086019485611d90565b611e1792936109e692610c3b92611e11600090565b50612275565b1490565b90939293848311610136578411610136578101920390565b359060208110611e41575090565b611e5390600019906020036008021b90565b1690565b6101237f64926492649264926492649264926492649264926492649264926492649264926101be565b90610148611e8d60405190565b92836110e6565b6001600160401b03811161110757602090601f01601f19160190565b90826000939282370152565b90929192611ed1611ecc82611e94565b611e80565b938185528183011161013657610148916020850190611eb0565b610123913691611ebc565b9080601f830112156101365781602061012393359101611ebc565b9160608383031261013657611f26828461013b565b9260208101356001600160401b0381116101365783611f46918301611ef6565b9260408201356001600160401b038111610136576101239201611ef6565b90611f71611ecc83611e94565b918252565b3d15611f9057611f853d611f64565b903d6000602084013e565b606090565b611fb6611fbf602093610bcb93611faa815190565b80835293849260200190565b9586910161194e565b601f01601f191690565b602080825261012392910190611f95565b6001600160e01b0319811661012f565b9050519061014882611fda565b906020828203126101365761012391611fea565b90815260406020820181905261012392910190611f95565b6040513d6000823e3d90fd5b6120486120426101239263ffffffff1690565b60e01b90565b6001600160e01b03191690565b90612061606092612331565b938060209361208c6120868361207f612079896101be565b82610c34565b868a611e1b565b90611e33565b61209a6109e6610123611e57565b0361223b576120db6102d06120c96120ed946120e3946120b8600090565b50506120c3896101be565b90610c34565b6120d360006101be565b80968a611e1b565b810190611f11565b939092909161019d565b90843b146121ef575b50505b813b6121086109e660006101be565b11612126575061014893604084359385013594013560f81c916123ec565b8294935061213a610ad2612164949361019d565b631626ba7e9461214960405190565b8095819482936121598a60e01b90565b84526004840161200b565b03915afa9283156121ea576000936121af575b50506121886120486121969261202f565b916001600160e01b03191690565b0361219d57565b604051638baa579f60e01b8152600490fd5b6121969293506121db612188928261204893903d106121e3575b6121d381836110e6565b810190611ff7565b939250612177565b503d6121c9565b612023565b816000929183878194519301915af161220e612209611f76565b911590565b61221857806120f6565b6107d99061222560405190565b639d0d6e2d60e01b815291829160048301611fc9565b50506122479084611eeb565b6120f9565b6101237ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006107f4565b61227f60006101be565b925b828410156122b1576122a46122ab9161229e6106be878787610677565b9061249d565b9360010190565b92612281565b9250505090565b6122c26006611f64565b654b6574746c6560d01b602082015290565b6101236122b8565b6101236122d4565b6122ee6001611f64565b603160f81b602082015290565b6101236122e4565b6101236122fb565b61231e6123186101239290565b60f01b90565b6001600160f01b03191690565b01918252565b6111d66123756123416000610628565b61234c6101236122dc565b6123576111e1825190565b20612363610123612303565b61236e6111e1825190565b209161250a565b61238061190161230b565b6111ca61238c60405190565b9485936020850193846020939261232b60028361232b8895610bcb976001600160f01b0319169052565b6107ee6101236101239290565b6114dc61014894611db96060949897956123e2608086019a6000870152565b60ff166020850152565b9391906123f9601b6123b6565b60ff8316141580612487575b6124755761242460009360209561241b60405190565b948594856123c3565b838052039060015afa156121ea5760005190612443610c7c600061075c565b61244c83610117565b1491821561245d575b505061219d57565b61246c9192506107a290610117565b14153880612455565b604051630424f48960e41b8152600490fd5b50612492601c6123b6565b60ff83161415612405565b818110156124b8579061012391600052602052604060002090565b61012391600052602052604060002090565b90959492610148946124fc612503926124f56080966124ee60a088019c6000890152565b6020870152565b6040850152565b6060830152565b0190610578565b916111d6916111ca61251b3061019d565b60405195869460208601944692866124ca56fea264697066735822122086418c374ae2c2b11f756da5fb6854e762280c93726032151c0b756cef2cbd8e64736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "err";
            readonly type: "bytes";
        }];
        readonly name: "ERC6492DeployFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InsufficientOffer";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidCriteria";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidLoanAmount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidRate";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidSignature";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidToken";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidVParameter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotInitializing";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OfferExpired";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OfferUnavailable";
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
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }];
        readonly name: "NonceIncremented";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "salt";
            readonly type: "uint256";
        }];
        readonly name: "OfferCancelled";
        readonly type: "event";
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
        readonly name: "OwnershipTransferStarted";
        readonly type: "event";
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
        readonly name: "acceptOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "offerHash";
            readonly type: "bytes32";
        }];
        readonly name: "amountTaken";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "salts";
            readonly type: "uint256[]";
        }];
        readonly name: "cancelOffers";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "salts";
            readonly type: "uint256[]";
        }];
        readonly name: "cancelOffersForUser";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "cancelledOrFulfilled";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "enum OfferKind";
                readonly name: "kind";
                readonly type: "uint8";
            }, {
                readonly internalType: "bool";
                readonly name: "soft";
                readonly type: "bool";
            }, {
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "maker";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "taker";
                readonly type: "address";
            }, {
                readonly components: readonly [{
                    readonly internalType: "enum Criteria";
                    readonly name: "criteria";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "contract IERC721";
                    readonly name: "collection";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "identifier";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Collateral";
                readonly name: "collateral";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "currency";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "maxAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "minAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "defaultRate";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "duration";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "gracePeriod";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct LoanOfferTerms";
                readonly name: "terms";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "recipient";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct FeeTerms";
                readonly name: "fee";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint256";
                readonly name: "expiration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "salt";
                readonly type: "uint256";
            }];
            readonly internalType: "struct LoanOffer";
            readonly name: "offer";
            readonly type: "tuple";
        }];
        readonly name: "hashLoanOffer";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "enum OfferKind";
                readonly name: "kind";
                readonly type: "uint8";
            }, {
                readonly internalType: "bool";
                readonly name: "soft";
                readonly type: "bool";
            }, {
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "maker";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "taker";
                readonly type: "address";
            }, {
                readonly components: readonly [{
                    readonly internalType: "enum Criteria";
                    readonly name: "criteria";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "contract IERC721";
                    readonly name: "collection";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "identifier";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Collateral";
                readonly name: "collateral";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "currency";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rebate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct MarketOfferTerms";
                readonly name: "terms";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "recipient";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct FeeTerms";
                readonly name: "fee";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint256";
                readonly name: "expiration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "salt";
                readonly type: "uint256";
            }];
            readonly internalType: "struct MarketOffer";
            readonly name: "offer";
            readonly type: "tuple";
        }];
        readonly name: "hashMarketOffer";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "incrementNonce";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly name: "pendingOwner";
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
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum OfferKind";
                readonly name: "kind";
                readonly type: "uint8";
            }, {
                readonly internalType: "bool";
                readonly name: "soft";
                readonly type: "bool";
            }, {
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "maker";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "taker";
                readonly type: "address";
            }, {
                readonly components: readonly [{
                    readonly internalType: "enum Criteria";
                    readonly name: "criteria";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "contract IERC721";
                    readonly name: "collection";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "identifier";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Collateral";
                readonly name: "collateral";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "currency";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "maxAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "minAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "defaultRate";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "duration";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "gracePeriod";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct LoanOfferTerms";
                readonly name: "terms";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "recipient";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct FeeTerms";
                readonly name: "fee";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint256";
                readonly name: "expiration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "salt";
                readonly type: "uint256";
            }];
            readonly internalType: "struct LoanOffer";
            readonly name: "offer";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes32[]";
            readonly name: "proof";
            readonly type: "bytes32[]";
        }];
        readonly name: "takeLoanOffer";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum OfferKind";
                readonly name: "kind";
                readonly type: "uint8";
            }, {
                readonly internalType: "bool";
                readonly name: "soft";
                readonly type: "bool";
            }, {
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "maker";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "taker";
                readonly type: "address";
            }, {
                readonly components: readonly [{
                    readonly internalType: "enum Criteria";
                    readonly name: "criteria";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "contract IERC721";
                    readonly name: "collection";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "identifier";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct Collateral";
                readonly name: "collateral";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "currency";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rebate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct MarketOfferTerms";
                readonly name: "terms";
                readonly type: "tuple";
            }, {
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "recipient";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "rate";
                    readonly type: "uint256";
                }];
                readonly internalType: "struct FeeTerms";
                readonly name: "fee";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint256";
                readonly name: "expiration";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "salt";
                readonly type: "uint256";
            }];
            readonly internalType: "struct MarketOffer";
            readonly name: "offer";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "signature";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes32[]";
            readonly name: "proof";
            readonly type: "bytes32[]";
        }];
        readonly name: "takeMarketOffer";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
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
    }];
    static createInterface(): TestOfferControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): TestOfferController;
}
export {};

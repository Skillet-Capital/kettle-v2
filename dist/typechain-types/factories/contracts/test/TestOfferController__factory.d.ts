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
    static readonly bytecode = "0x60806040523461001a576040516124a461002082396124a490f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063017d0ae01461011257806308a8e4a31461010d578063406eedd6146101085780634ae25a86146101035780635cf39d01146100fe578063627cdcb9146100f9578063715018a6146100f4578063754e71c5146100ef57806379ba5097146100ea5780637ecebe00146100e55780637f99d691146100e05780638129fc1c146100db5780638da5cb5b146100d6578063cee72578146100d1578063e30c3978146100cc5763f2fde38b0361013657610603565b6105e8565b6105cd565b610591565b610560565b610545565b610515565b6104d9565b6104b7565b610429565b610411565b6103e4565b610317565b6102d4565b610251565b61020d565b6001600160a01b031690565b90565b61012f81610117565b0361013657565b600080fd5b9050359061014882610126565b565b8061012f565b905035906101488261014a565b919060408382031261013657610123906020610179828661013b565b9401610150565b61012390610117906001600160a01b031682565b61012390610180565b61012390610194565b906101b09061019d565b600052602052604060002090565b6101236101236101239290565b906101b0906101be565b610123916008021c81565b9061012391546101d5565b610204610123926101ff600093603a6101a6565b6101cb565b6101e0565b9052565b346101365761023961022961022336600461015d565b906101eb565b6040519182918290815260200190565b0390f35b906020828203126101365761012391610150565b346101365761023961022961026736600461023d565b610632565b909182601f83011215610136578135916001600160401b03831161013657602001926020830284011161013657565b919091604081840312610136576102b2838261013b565b9260208201356001600160401b038111610136576102d0920161026c565b9091565b34610136576102ed6102e736600461029b565b916106df565b604051005b906020828203126101365781356001600160401b038111610136576102d0920161026c565b34610136576102ed61032a3660046102f2565b906106ea565b90816102809103126101365790565b909182601f83011215610136578135916001600160401b03831161013657602001926001830284011161013657565b909161030082840312610136576103858383610150565b926103938160208501610330565b926103a2826102a08301610150565b926102c08201356001600160401b03811161013657836103c391840161033f565b9290936102e08201356001600160401b038111610136576102d0920161026c565b34610136576102396102296103fa36600461036e565b95949094939193610728565b600091031261013657565b3461013657610421366004610406565b6102ed610736565b3461013657610439366004610406565b6102ed610777565b90816101e09103126101365790565b919061024083820312610136576104678184610150565b926104758260208301610441565b926102008201356001600160401b038111610136578361049691840161033f565b9290936102208201356001600160401b038111610136576102d0920161026c565b34610136576102396102296104cd366004610450565b9493909392919261077f565b34610136576104e9366004610406565b6102ed61078d565b90602082820312610136576101239161013b565b60006102046101239260076101a6565b346101365761023961022961052b3660046104f1565b610505565b90610280828203126101365761012391610330565b346101365761023961022961055b366004610530565b6107dd565b3461013657610570366004610406565b6102ed610a1b565b61020990610117565b6020810192916101489190610578565b34610136576105a1366004610406565b6102396105ac610a36565b60405191829182610581565b906101e0828203126101365761012391610441565b34610136576102396102296105e33660046105b8565b610a63565b34610136576105f8366004610406565b6102396105ac610a6c565b34610136576102ed6106163660046104f1565b610b0e565b906101b0565b6101239081565b6101239054610621565b61064961012391610641600090565b50603b61061b565b610628565b90610148929161065c610b17565b610696565b634e487b7160e01b600052603260045260246000fd5b9190811015610687576020020190565b610661565b356101238161014a565b9282919060005b845b8110156106d7576106d0816106ca6106c36106be61069f958989610677565b61068c565b8933610b56565b60010190565b905061069d565b509350505050565b90610148929161064e565b909190829160005b835b8110156107215761071a816106ca6107136106be6106f4958a89610677565b3333610b56565b90506106f2565b5092505050565b610123969594939290610c4f565b61014833610e1b565b610747610b17565b610148610765565b6101176101236101239290565b6101239061074f565b610148610772600061075c565b610eb1565b61014861073f565b610123959493929190610ee0565b33610796610a6c565b6107a86107a283610117565b91610117565b036107b65761014890610eb1565b6107d9906107c360405190565b63118cdaa760e01b815291829160048301610581565b0390fd5b61012390611047565b6101239060401c5b60ff1690565b61012390546107e6565b610123905b6001600160401b031690565b61012390546107fe565b6108036101236101239290565b906001600160401b03905b9181191691161790565b610803610123610123926001600160401b031690565b906108616101236108689261083b565b8254610826565b9055565b9060ff60401b9060401b610831565b9061088b61012361086892151590565b825461086c565b61020990610819565b6020810192916101489190610892565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00806108e66108e06108dc836107f4565b1590565b9161080f565b6000916108f283610819565b6001600160401b03831614806109f3575b60019261091f61091285610819565b916001600160401b031690565b1490816109cb575b155b90816109c2575b506109b0578061094c8461094385610819565b96019586610851565b6109a1575b6109596109fa565b61096257505050565b61099061099c927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29461087b565b6040519182918261089b565b0390a1565b6109ab828561087b565b610951565b60405163f92ee8a960e01b8152600490fd5b15905038610930565b90506109296109d93061019d565b3b6109ea6109e6876101be565b9190565b14919050610927565b5080610903565b610a02611127565b610a0a61113d565b610a1261119e565b61014833610eb1565b6101486108ab565b61012390610117565b6101239054610a23565b61012360007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610a2c565b610123906111a6565b6101236000610a5d61123a565b61014890610a85610b17565b610ab0565b906001600160a01b0390610831565b90610aa96101236108689261019d565b8254610a8a565b610ac4816000610abe61123a565b01610a99565b610add610ad7610ad2610a36565b61019d565b9161019d565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700610b0860405190565b600090a3565b61014890610a79565b610b1f610a36565b3390610b2d6107a283610117565b036107b65750565b9060001990610831565b90610b4f610123610868926101be565b8254610b35565b610b8a610b84610b9092949394610ad2610b7060016101be565b610b7f876101ff8a603a6101a6565b610b3f565b9361019d565b916101be565b917f3d4f9f1802e8d452c853ecb7e67f0b2952a80ab67afd1bbe07e7b94fd46cb778610bbb60405190565b600090a4565b6002111561013657565b634e487b7160e01b600052602160045260246000fd5b60021115610beb57565b610bcb565b9061014882610be1565b3561012381610bc1565b610123620186a06101be565b3561012381610126565b634e487b7160e01b600052601160045260246000fd5b9190610c3b565b9290565b8203918211610c4657565b610c1a565b0190565b94610c8292979691939495610c62600090565b5060a08901610c7c6040610c7583610bfa565b920161068c565b9061125e565b610100850192610c946080850161068c565b610c9c610c04565b908110908115610df1575b50610ddf57610cb586611047565b92610cf960408598610cf36060820195610cce87610c10565b95610cdc610240850161068c565b96610260850197610cec8961068c565b918c611304565b01610bfa565b610d0c610d066000610bf0565b91610bf0565b03610da6575050610d226101236040850161068c565b81118015610d8f575b610d7d57610d54602093610d4f610d4661064986603b61061b565b9586920161068c565b610c30565b8111610d6b5761014892610b7f910191603b61061b565b60405163cfe9d93160e01b8152600490fd5b604051635697666160e01b8152600490fd5b50610d9f6101236060850161068c565b8110610d2b565b9092506101489350610b7f9150610dd9610dd3610dcc610dc660016101be565b95610c10565b603a6101a6565b9161068c565b906101cb565b604051636a43f8d160e01b8152600490fd5b9050610e056109e6610c3760a0880161068c565b1138610ca7565b6000198114610c465760010190565b610e48610b8a610e2c8360076101a6565b92610ad2610e41610e3c86610628565b610e0c565b8095610b3f565b907fa82a649bbd060c9099cd7b7326e2b0dc9e9af0836480e0f849dc9eaa79710b3b610b0860405190565b916001600160a01b0360089290920291821b911b610831565b9190610e9d6101236108689361019d565b908354610e73565b61014891600091610e8c565b61014890610ec9600080610ec361123a565b01610ea5565b611363565b80151561012f565b3561012381610ece565b610b7f92969561014895610ef2600090565b50610f026108dc60208601610ed6565b610f5d575b505050610f4a610f16826111a6565b9384976060840195610f2787610c10565b946101c0610f386101a0830161068c565b910195610f448761068c565b92611304565b610dd9610dd3610dcc610dc660016101be565b610f739260a08501610c7c6040610c7583610bfa565b388080610f07565b61012390610bf0565b61020990610f7b565b99979593919c9b9a98969492909c6101808b019d60008c01610fad919052565b60208b01610fba91610f84565b151560408a015260608901610fce91610f84565b60808801610fdb91610578565b60a08701610fe891610578565b60c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761104257604052565b61100b565b61111160206110566004610628565b61110561106285610bfa565b9461106e848201610ed6565b9061107b60408201610bfa565b90606081019161108a83610c10565b61109660808401610c10565b6110a260a0850161141b565b906110b061010086016114ac565b926110be6102008701611555565b946110ef6106496110e86110e26102606110db6102408d0161068c565b9b0161068c565b9a610c10565b60076101a6565b986110f960405190565b9e8f9d8e019c8d610f8d565b90810382520382611021565b61112361111c825190565b9160200190565b2090565b61014861113d565b90610b4f6101236108689290565b61014861117a61118f61117361118861116c61118161115a611c26565b60069c959a93969c989192949861112f565b600561112f565b600461112f565b600361112f565b600261112f565b600161112f565b600061112f565b610148611ca8565b610148611196565b61111160206111b56006610628565b6111056111c185610bfa565b946111cd848201610ed6565b906111da60408201610bfa565b9060608101916111e983610c10565b6111f560808401610c10565b61120160a0850161141b565b9061120f6101008601611cfb565b9261121d6101608701611555565b946110ef6106496110e86110e26101c06110db6101a08d0161068c565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b93909361126e610d066001610bf0565b036112d757906108dc929161128e6112886112bf966101be565b926101be565b6112ad61129a60405190565b6020810192835291829060408201611105565b6112b861111c825190565b2092611d37565b6112c557565b604051631037b7f560e11b8152600490fd5b5090506112e76109e66112ec9390565b141590565b6112f257565b60405163c1ab6dc160e01b8152600490fd5b93816113139394969295611f90565b42116113515761132b916101ff61064992603a6101a6565b6113386109e660016101be565b1461133f57565b6040516305c934c360e01b8152600490fd5b604051639cb1308760e01b8152600490fd5b61139d610ad77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610ad28461139783610a2c565b92610a99565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0610b0860405190565b61012f81610a23565b35610123816113c8565b6102099061019d565b6114176101489461140d606094989795611403608086019a6000870152565b6020850190610f84565b60408301906113db565b0152565b6111116114286001610628565b61143183610bfa565b9061110561144d6040611446602088016113d1565b960161068c565b6040519586946020860194856113e4565b9694929099989795939161012088019a6000890161147a919052565b60208801611487916113db565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b6111116114b96003610628565b6114c2836113d1565b906111056114d26020860161068c565b946114df6040820161068c565b906114ec6060820161068c565b6114f86080830161068c565b61150460a0840161068c565b9161151d60e061151660c0870161068c565b950161068c565b9461152760405190565b9a8b9960208b01998a61145e565b908152606081019392610148929091604091611417906020830190610578565b6111116115626002610628565b916115716020610c7583610c10565b9261110561157e60405190565b948593602085019384611535565b60196010600f600c600d6001956115b2816c08a92a06e626488dedac2d2dc5609b1b9052565b016115cb816b1cdd1c9a5b99c81b985b594b60a21b9052565b016115e7816e1cdd1c9a5b99c81d995c9cda5bdb8b608a1b9052565b01611604816f1d5a5b9d0c8d4d8818da185a5b92590b60821b9052565b0161162a81781859191c995cdcc81d995c9a599e5a5b99d0dbdb9d1c9858dd603a1b9052565b01610c4b81602960f81b9052565b60405190610148826020810161164d8161158c565b90810382520383611021565b60126013600f600b60019461167b816a086ded8d8c2e8cae4c2d8560ab1b9052565b01611697816e1d5a5b9d0e0818dc9a5d195c9a584b608a1b9052565b016116b781721859191c995cdcc818dbdb1b1958dd1a5bdb8b606a1b9052565b0161162a81713ab4b73a191a9b1034b232b73a34b334b2b960711b9052565b60405190610148826020810161164d81611659565b600c60126009600193611709816808ccacaa8cae4dae6560bb1b9052565b0161172881711859191c995cdcc81c9958da5c1a595b9d0b60721b9052565b0161162a816b75696e74323536207261746560a01b9052565b60405190610148826020810161164d816116eb565b601360116014600d601280600f8581600199611783816e098dec2dc9ecccccae4a8cae4dae65608b1b9052565b016117a181701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b016117bd816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b016117dc81711d5a5b9d0c8d4d881b585e105b5bdd5b9d0b60721b9052565b016117fb81711d5a5b9d0c8d4d881b5a5b905b5bdd5b9d0b60721b9052565b01611815816c1d5a5b9d0c8d4d881c985d194b609a1b9052565b0161183681731d5a5b9d0c8d4d88191959985d5b1d14985d194b60621b9052565b0161185481701d5a5b9d0c8d4d88191d5c985d1a5bdb8b607a1b9052565b0161162a81721d5a5b9d0c8d4d8819dc9858d954195c9a5bd9606a1b9052565b60405190610148826020810161164d81611756565b60005b83811061189c5750506000910152565b818101518382015260200161188c565b610c4b6118c4926020926118be815190565b94859290565b93849101611889565b91611a4b611a4b926001600d8060138160156016600e80600b6101239f9e81600a80926119068169098dec2dc9ecccccae4560b31b9052565b0161191e816a1d5a5b9d0e081ada5b990b60aa1b9052565b016119358169189bdbdb081cdbd99d0b60b21b9052565b0161194d816a1d5a5b9d0e081cda59194b60aa1b9052565b01611968816d1859191c995cdcc81b585ad95c8b60921b9052565b01611983816d1859191c995cdcc81d185ad95c8b60921b9052565b016119a6817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b016119c88174131bd85b93d999995c95195c9b5cc81d195c9b5ccb605a1b9052565b016119e2816c11995955195c9b5cc81999594b609a1b9052565b01611a0281721d5a5b9d0c8d4d88195e1c1a5c985d1a5bdb8b606a1b9052565b01611a1c816c1d5a5b9d0c8d4d881cd85b1d0b609a1b9052565b01611a36816c75696e74323536206e6f6e636560981b9052565b01611a4481602960f81b9052565b01906118ac565b906118ac565b906101489193929361164d611a6560405190565b9586936020850193846118cd565b600e600f601180600194611a9a817009ac2e4d6cae89ecccccae4a8cae4dae65607b1b9052565b01611ab881701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b01611ad4816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b0161162a816d75696e743235362072656261746560901b9052565b60405190610148826020810161164d81611a73565b91611a4b611a4b926001600d8060138160176016600e80600b6101239f9e81600c600a92611b40816b09ac2e4d6cae89ecccccae4560a31b9052565b01611b58816a1d5a5b9d0e081ada5b990b60aa1b9052565b01611b6f8169189bdbdb081cdbd99d0b60b21b9052565b01611b87816a1d5a5b9d0e081cda59194b60aa1b9052565b01611ba2816d1859191c995cdcc81b585ad95c8b60921b9052565b01611bbd816d1859191c995cdcc81d185ad95c8b60921b9052565b01611be0817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b016119c8817613585c9ad95d13d999995c95195c9b5cc81d195c9b5ccb604a1b9052565b906101489193929361164d611c1860405190565b958693602085019384611b04565b611c2e611638565b611c3961111c825190565b2090611c436116d6565b8051602082012091611c53611741565b8051602082012092611c63611874565b92611111611c7f611c72865190565b6020870120958585611a51565b611c8a61111c825190565b2093611c94611aef565b90611c9d825190565b602083012094611c04565b611cb36108dc612187565b611cb957565b604051631afcd79f60e31b8152600490fd5b61141761014894611cf4606094989795611cea608086019a6000870152565b60208501906113db565b6040830152565b611111611d086005610628565b611d11836113d1565b90611105611d2660406114466020880161068c565b604051958694602086019485611ccb565b611d5292936109e692610c3792611d4c600090565b506121b0565b1490565b90939293848311610136578411610136578101920390565b359060208110611d7c575090565b611d8e90600019906020036008021b90565b1690565b6101237f64926492649264926492649264926492649264926492649264926492649264926101be565b90610148611dc860405190565b9283611021565b6001600160401b03811161104257602090601f01601f19160190565b90826000939282370152565b90929192611e0c611e0782611dcf565b611dbb565b938185528183011161013657610148916020850190611deb565b610123913691611df7565b9080601f830112156101365781602061012393359101611df7565b9160608383031261013657611e61828461013b565b9260208101356001600160401b0381116101365783611e81918301611e31565b9260408201356001600160401b038111610136576101239201611e31565b90611eac611e0783611dcf565b918252565b3d15611ecb57611ec03d611e9f565b903d6000602084013e565b606090565b611ef1611efa602093610c4b93611ee5815190565b80835293849260200190565b95869101611889565b601f01601f191690565b602080825261012392910190611ed0565b6001600160e01b0319811661012f565b9050519061014882611f15565b906020828203126101365761012391611f25565b90815260406020820181905261012392910190611ed0565b6040513d6000823e3d90fd5b611f83611f7d6101239263ffffffff1690565b60e01b90565b6001600160e01b03191690565b90611f9c60609261226c565b9380602093611fc7611fc183611fba611fb4896101be565b82610c30565b868a611d56565b90611d6e565b611fd56109e6610123611d92565b03612176576120166102d06120046120289461201e94611ff3600090565b5050611ffe896101be565b90610c30565b61200e60006101be565b80968a611d56565b810190611e4c565b939092909161019d565b90843b1461212a575b50505b813b6120436109e660006101be565b11612061575061014893604084359385013594013560f81c91612327565b82949350612075610ad261209f949361019d565b631626ba7e9461208460405190565b8095819482936120948a60e01b90565b845260048401611f46565b03915afa928315612125576000936120ea575b50506120c3611f836120d192611f6a565b916001600160e01b03191690565b036120d857565b604051638baa579f60e01b8152600490fd5b6120d19293506121166120c39282611f8393903d1061211e575b61210e8183611021565b810190611f32565b9392506120b2565b503d612104565b611f5e565b816000929183878194519301915af1612149612144611eb1565b911590565b6121535780612031565b6107d99061216060405190565b639d0d6e2d60e01b815291829160048301611f04565b50506121829084611e26565b612034565b6101237ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006107f4565b6121ba60006101be565b925b828410156121ec576121df6121e6916121d96106be878787610677565b906123dd565b9360010190565b926121bc565b9250505090565b6121fd6006611e9f565b654b6574746c6560d01b602082015290565b6101236121f3565b61012361220f565b6122296001611e9f565b603160f81b602082015290565b61012361221f565b610123612236565b6122596122536101239290565b60f01b90565b6001600160f01b03191690565b01918252565b6111116122b061227c6000610628565b612287610123612217565b61229261111c825190565b2061229e61012361223e565b6122a961111c825190565b209161244a565b6122bb611901612246565b6111056122c760405190565b948593602085019384602093926122666002836122668895610c4b976001600160f01b0319169052565b6107ee6101236101239290565b61141761014894611cf460609498979561231d608086019a6000870152565b60ff166020850152565b939190612334601b6122f1565b60ff83161415806123c7575b6123b55761235f60009360209561235660405190565b948594856122fe565b838052039060015afa15612125576000519061238361237e600061075c565b610117565b61238c83610117565b1491821561239d575b50506120d857565b6123ac9192506107a290610117565b14153880612395565b604051630424f48960e41b8152600490fd5b506123d2601c6122f1565b60ff83161415612340565b818110156123f8579061012391600052602052604060002090565b61012391600052602052604060002090565b909594926101489461243c6124439261243560809661242e60a088019c6000890152565b6020870152565b6040850152565b6060830152565b0190610578565b916111119161110561245b3061019d565b604051958694602086019446928661240a56fea26469706673582212208e4357ddc882f846857e09f2384bb703ecfdfba5f631c9f3ae193ab83281e42d64736f6c63430008180033";
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

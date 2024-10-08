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
    static readonly bytecode = "0x60806040523461001a5760405161259a610020823961259a90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063017d0ae01461011257806308a8e4a31461010d57806339e797d014610108578063406eedd6146101035780634ae25a86146100fe5780635cf39d01146100f9578063627cdcb9146100f4578063715018a6146100ef57806379ba5097146100ea5780637ecebe00146100e55780637f99d691146100e05780638129fc1c146100db578063877b583f146100d65780638da5cb5b146100d1578063e30c3978146100cc5763f2fde38b0361013657610603565b6105e8565b6105c1565b610586565b610507565b6104ec565b6104bc565b610480565b610468565b610450565b610423565b610356565b610313565b610290565b610251565b61020d565b6001600160a01b031690565b90565b61012f81610117565b0361013657565b600080fd5b9050359061014882610126565b565b8061012f565b905035906101488261014a565b919060408382031261013657610123906020610179828661013b565b9401610150565b61012390610117906001600160a01b031682565b61012390610180565b61012390610194565b906101b09061019d565b600052602052604060002090565b6101236101236101239290565b906101b0906101be565b610123916008021c81565b9061012391546101d5565b610204610123926101ff600093603a6101a6565b6101cb565b6101e0565b9052565b346101365761023961022961022336600461015d565b906101eb565b6040519182918290815260200190565b0390f35b906020828203126101365761012391610150565b346101365761023961022961026736600461023d565b610632565b90816102409103126101365790565b9061024082820312610136576101239161026c565b34610136576102396102296102a636600461027b565b61064e565b909182601f83011215610136578135916001600160401b03831161013657602001926020830284011161013657565b919091604081840312610136576102f1838261013b565b9260208201356001600160401b0381116101365761030f92016102ab565b9091565b346101365761032c6103263660046102da565b916106e8565b604051005b906020828203126101365781356001600160401b0381116101365761030f92016102ab565b346101365761032c610369366004610331565b906106f3565b90816102809103126101365790565b909182601f83011215610136578135916001600160401b03831161013657602001926001830284011161013657565b909161030082840312610136576103c48383610150565b926103d2816020850161036f565b926103e1826102a08301610150565b926102c08201356001600160401b038111610136578361040291840161037e565b9290936102e08201356001600160401b0381116101365761030f92016102ab565b34610136576102396102296104393660046103ad565b95949094939193610731565b600091031261013657565b3461013657610460366004610445565b61032c61073f565b3461013657610478366004610445565b61032c610780565b3461013657610490366004610445565b61032c610788565b90602082820312610136576101239161013b565b60006102046101239260076101a6565b34610136576102396102296104d2366004610498565b6104ac565b9061028082820312610136576101239161036f565b34610136576102396102296105023660046104d7565b6107d8565b3461013657610517366004610445565b61032c610a16565b91906102a083820312610136576105368184610150565b92610544826020830161026c565b926102608201356001600160401b038111610136578361056591840161037e565b9290936102808201356001600160401b0381116101365761030f92016102ab565b346101365761023961022961059c36600461051f565b94939093929192610a1e565b61020990610117565b60208101929161014891906105a8565b34610136576105d1366004610445565b6102396105dc610a3f565b604051918291826105b1565b34610136576105f8366004610445565b6102396105dc610a6c565b346101365761032c610616366004610498565b610b0e565b906101b0565b6101239081565b6101239054610621565b61064961012391610641600090565b50603b61061b565b610628565b61012390610c42565b906101489291610665610d22565b61069f565b634e487b7160e01b600052603260045260246000fd5b9190811015610690576020020190565b61066a565b356101238161014a565b9282919060005b845b8110156106e0576106d9816106d36106cc6106c76106a8958989610680565b610695565b8933610d61565b60010190565b90506106a6565b509350505050565b906101489291610657565b909190829160005b835b81101561072a57610723816106d361071c6106c76106fd958a89610680565b3333610d61565b90506106fb565b5092505050565b610123969594939290610e0d565b61014833610fd9565b610750610d22565b61014861076e565b6101176101236101239290565b61012390610758565b61014861077b6000610765565b61106f565b610148610748565b33610791610a6c565b6107a361079d83610117565b91610117565b036107b1576101489061106f565b6107d4906107be60405190565b63118cdaa760e01b8152918291600483016105b1565b0390fd5b6101239061108c565b6101239060401c5b60ff1690565b61012390546107e1565b610123905b6001600160401b031690565b61012390546107f9565b6107fe6101236101239290565b906001600160401b03905b9181191691161790565b6107fe610123610123926001600160401b031690565b9061085c61012361086392610836565b8254610821565b9055565b9060ff60401b9060401b61082c565b9061088661012361086392151590565b8254610867565b61020990610814565b602081019291610148919061088d565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00806108e16108db6108d7836107ef565b1590565b9161080a565b6000916108ed83610814565b6001600160401b03831614806109ee575b60019261091a61090d85610814565b916001600160401b031690565b1490816109c6575b155b90816109bd575b506109ab57806109478461093e85610814565b9601958661084c565b61099c575b6109546109f5565b61095d57505050565b61098b610997927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d294610876565b60405191829182610896565b0390a1565b6109a68285610876565b61094c565b60405163f92ee8a960e01b8152600490fd5b1590503861092b565b90506109246109d43061019d565b3b6109e56109e1876101be565b9190565b14919050610922565b50806108fe565b6109fd611120565b610a05611136565b610a0d611197565b6101483361106f565b6101486108a6565b61012395949392919061119f565b61012390610117565b6101239054610a2c565b61012360007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610a35565b6101236000610a66611285565b61014890610a85610d22565b610ab0565b906001600160a01b039061082c565b90610aa96101236108639261019d565b8254610a8a565b610ac4816000610abe611285565b01610a99565b610add610ad7610ad2610a3f565b61019d565b9161019d565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700610b0860405190565b600090a3565b61014890610a79565b6002111561013657565b634e487b7160e01b600052602160045260246000fd5b60021115610b4157565b610b21565b9061014882610b37565b3561012381610b17565b80151561012f565b3561012381610b5a565b3561012381610126565b61012390610b46565b61020990610b76565b99979593919c9b9a98969492909c6101808b019d60008c01610ba8919052565b60208b01610bb591610b7f565b151560408a015260608901610bc991610b7f565b60808801610bd6916105a8565b60a08701610be3916105a8565b60c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b03821117610c3d57604052565b610c06565b610d0c6020610c516006610628565b610d00610c5d85610b50565b94610c69848201610b62565b90610c7660408201610b50565b906060810191610c8583610b6c565b610c9160808401610b6c565b610c9d60a085016112fc565b90610cab610100860161137a565b92610cb96101c0870161140a565b94610cea610649610ce3610cdd610220610cd66102008d01610695565b9b01610695565b9a610b6c565b60076101a6565b98610cf460405190565b9e8f9d8e019c8d610b88565b90810382520382610c1c565b610d1e610d17825190565b9160200190565b2090565b610d2a610a3f565b3390610d3861079d83610117565b036107b15750565b906000199061082c565b90610d5a610123610863926101be565b8254610d40565b610d95610d8f610d9b92949394610ad2610d7b60016101be565b610d8a876101ff8a603a6101a6565b610d4a565b9361019d565b916101be565b917f3d4f9f1802e8d452c853ecb7e67f0b2952a80ab67afd1bbe07e7b94fd46cb778610dc660405190565b600090a4565b610123620186a06101be565b634e487b7160e01b600052601160045260246000fd5b9190610df9565b9290565b8203918211610e0457565b610dd8565b0190565b94610e4092979691939495610e20600090565b5060a08901610e3a6040610e3383610b50565b9201610695565b90611441565b610100850192610e5260808501610695565b610e5a610dcc565b908110908115610faf575b50610f9d57610e738661108c565b92610eb760408598610eb16060820195610e8c87610b6c565b95610e9a6102408501610695565b96610260850197610eaa89610695565b918c6114e7565b01610b50565b610eca610ec46000610b46565b91610b46565b03610f64575050610ee061012360408501610695565b81118015610f4d575b610f3b57610f12602093610f0d610f0461064986603b61061b565b95869201610695565b610dee565b8111610f295761014892610d8a910191603b61061b565b60405163cfe9d93160e01b8152600490fd5b604051635697666160e01b8152600490fd5b50610f5d61012360608501610695565b8110610ee9565b9092506101489350610d8a9150610f97610f91610f8a610f8460016101be565b95610b6c565b603a6101a6565b91610695565b906101cb565b604051636a43f8d160e01b8152600490fd5b9050610fc36109e1610df560a08801610695565b1138610e65565b6000198114610e045760010190565b611006610d95610fea8360076101a6565b92610ad2610fff610ffa86610628565b610fca565b8095610d4a565b907fa82a649bbd060c9099cd7b7326e2b0dc9e9af0836480e0f849dc9eaa79710b3b610b0860405190565b916001600160a01b0360089290920291821b911b61082c565b919061105b6101236108639361019d565b908354611031565b6101489160009161104a565b61014890611087600080611081611285565b01611063565b611546565b610d0c602061109b6004610628565b610d006110a785610b50565b946110b3848201610b62565b906110c060408201610b50565b9060608101916110cf83610b6c565b6110db60808401610b6c565b6110e760a085016112fc565b906110f561010086016115f9565b92611103610200870161140a565b94610cea610649610ce3610cdd610260610cd66102408d01610695565b610148611136565b90610d5a6101236108639290565b61014861117361118861116c61118161116561117a611153611d81565b60069c959a93969c9891929498611128565b6005611128565b6004611128565b6003611128565b6002611128565b6001611128565b6000611128565b610148611e03565b61014861118f565b91959490936111b36108d760208701610b62565b611267575b50505061010082016111cc60408201610b62565b61122c575b50610d8a826112196111e561014895610c42565b93849760608401956111f687610b6c565b946102206112076102008301610695565b91019561121387610695565b926114e7565b610f97610f91610f8a610f8460016101be565b61124a6109e1610123606061124360208601610695565b9401610695565b1061125557386111d1565b60405163e962464d60e01b8152600490fd5b61127d9260a08601610e3a6040610e3383610b50565b3880806111b8565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b61012f81610a2c565b35610123816112a9565b6102099061019d565b6112f8610148946112ee6060949897956112e4608086019a6000870152565b6020850190610b7f565b60408301906112bc565b0152565b610d0c6113096001610628565b61131283610b50565b90610d0061132e6040611327602088016112b2565b9601610695565b6040519586946020860194856112c5565b90815260e0810197969590949093909290916020860161135e916112bc565b604085015215156060840152608083015260a082015260c00152565b610d0c6113876005610628565b611390836112b2565b90610d006113a060208601610695565b946113ad60408201610b62565b906113ba60608201610695565b6113d260a06113cb60808501610695565b9301610695565b926113dc60405190565b98899760208901978861133f565b9081526060810193926101489290916040916112f89060208301906105a8565b610d0c6114176002610628565b916114266020610e3383610b6c565b92610d0061143360405190565b9485936020850193846113ea565b939093611451610ec46001610b46565b036114ba57906108d7929161147161146b6114a2966101be565b926101be565b61149061147d60405190565b6020810192835291829060408201610d00565b61149b610d17825190565b2092611e26565b6114a857565b604051631037b7f560e11b8152600490fd5b5090506114ca6109e16114cf9390565b141590565b6114d557565b60405163c1ab6dc160e01b8152600490fd5b93816114f6939496929561207f565b42116115345761150e916101ff61064992603a6101a6565b61151b6109e160016101be565b1461152257565b6040516305c934c360e01b8152600490fd5b604051639cb1308760e01b8152600490fd5b611580610ad77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610ad28461157a83610a35565b92610a99565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0610b0860405190565b9694929099989795939161012088019a600089016115c7919052565b602088016115d4916112bc565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b610d0c6116066003610628565b61160f836112b2565b90610d0061161f60208601610695565b9461162c60408201610695565b9061163960608201610695565b61164560808301610695565b61165160a08401610695565b9161166a60e061166360c08701610695565b9501610695565b9461167460405190565b9a8b9960208b01998a6115ab565b60196010600f600c600d6001956116a8816c08a92a06e626488dedac2d2dc5609b1b9052565b016116c1816b1cdd1c9a5b99c81b985b594b60a21b9052565b016116dd816e1cdd1c9a5b99c81d995c9cda5bdb8b608a1b9052565b016116fa816f1d5a5b9d0c8d4d8818da185a5b92590b60821b9052565b0161172081781859191c995cdcc81d995c9a599e5a5b99d0dbdb9d1c9858dd603a1b9052565b01610e0981602960f81b9052565b60405190610148826020810161174381611682565b90810382520383610c1c565b60126013600f600b600194611771816a086ded8d8c2e8cae4c2d8560ab1b9052565b0161178d816e1d5a5b9d0e0818dc9a5d195c9a584b608a1b9052565b016117ad81721859191c995cdcc818dbdb1b1958dd1a5bdb8b606a1b9052565b0161172081713ab4b73a191a9b1034b232b73a34b334b2b960711b9052565b6040519061014882602081016117438161174f565b600c601260096001936117ff816808ccacaa8cae4dae6560bb1b9052565b0161181e81711859191c995cdcc81c9958da5c1a595b9d0b60721b9052565b01611720816b75696e74323536207261746560a01b9052565b604051906101488260208101611743816117e1565b601360116014600d601280600f8581600199611879816e098dec2dc9ecccccae4a8cae4dae65608b1b9052565b0161189781701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b016118b3816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b016118d281711d5a5b9d0c8d4d881b585e105b5bdd5b9d0b60721b9052565b016118f181711d5a5b9d0c8d4d881b5a5b905b5bdd5b9d0b60721b9052565b0161190b816c1d5a5b9d0c8d4d881c985d194b609a1b9052565b0161192c81731d5a5b9d0c8d4d88191959985d5b1d14985d194b60621b9052565b0161194a81701d5a5b9d0c8d4d88191d5c985d1a5bdb8b607a1b9052565b0161172081721d5a5b9d0c8d4d8819dc9858d954195c9a5bd9606a1b9052565b6040519061014882602081016117438161184c565b60005b8381106119925750506000910152565b8181015183820152602001611982565b610e096119ba926020926119b4815190565b94859290565b9384910161197f565b91611b41611b41926001600d8060138160156016600e80600b6101239f9e81600a80926119fc8169098dec2dc9ecccccae4560b31b9052565b01611a14816a1d5a5b9d0e081ada5b990b60aa1b9052565b01611a2b8169189bdbdb081cdbd99d0b60b21b9052565b01611a43816a1d5a5b9d0e081cda59194b60aa1b9052565b01611a5e816d1859191c995cdcc81b585ad95c8b60921b9052565b01611a79816d1859191c995cdcc81d185ad95c8b60921b9052565b01611a9c817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b01611abe8174131bd85b93d999995c95195c9b5cc81d195c9b5ccb605a1b9052565b01611ad8816c11995955195c9b5cc81999594b609a1b9052565b01611af881721d5a5b9d0c8d4d88195e1c1a5c985d1a5bdb8b606a1b9052565b01611b12816c1d5a5b9d0c8d4d881cd85b1d0b609a1b9052565b01611b2c816c75696e74323536206e6f6e636560981b9052565b01611b3a81602960f81b9052565b01906119a2565b906119a2565b9061014891939293611743611b5b60405190565b9586936020850193846119c3565b600e6016601582600f601180600197611b95817009ac2e4d6cae89ecccccae4a8cae4dae65607b1b9052565b01611bb381701859191c995cdcc818dd5c9c995b98de4b607a1b9052565b01611bcf816e1d5a5b9d0c8d4d88185b5bdd5b9d0b608a1b9052565b01611bea816d189bdbdb081dda5d1a131bd85b8b60921b9052565b01611c0c81741d5a5b9d0c8d4d88189bdc9c9bddd05b5bdd5b9d0b605a1b9052565b01611c2f8175189e5d195ccccc881b1bd85b93d999995c92185cda0b60521b9052565b01611720816d75696e743235362072656261746560901b9052565b60405190610148826020810161174381611b69565b91611b41611b41926001600d8060138160176016600e80600b6101239f9e81600c600a92611c9b816b09ac2e4d6cae89ecccccae4560a31b9052565b01611cb3816a1d5a5b9d0e081ada5b990b60aa1b9052565b01611cca8169189bdbdb081cdbd99d0b60b21b9052565b01611ce2816a1d5a5b9d0e081cda59194b60aa1b9052565b01611cfd816d1859191c995cdcc81b585ad95c8b60921b9052565b01611d18816d1859191c995cdcc81d185ad95c8b60921b9052565b01611d3b817510dbdb1b185d195c985b0818dbdb1b185d195c985b0b60521b9052565b01611abe817613585c9ad95d13d999995c95195c9b5cc81d195c9b5ccb604a1b9052565b9061014891939293611743611d7360405190565b958693602085019384611c5f565b611d8961172e565b611d94610d17825190565b2090611d9e6117cc565b8051602082012091611dae611837565b8051602082012092611dbe61196a565b92610d0c611dda611dcd865190565b6020870120958585611b47565b611de5610d17825190565b2093611def611c4a565b90611df8825190565b602083012094611d5f565b611e0e6108d7612276565b611e1457565b604051631afcd79f60e31b8152600490fd5b611e4192936109e192610df592611e3b600090565b5061229f565b1490565b90939293848311610136578411610136578101920390565b359060208110611e6b575090565b611e7d90600019906020036008021b90565b1690565b6101237f64926492649264926492649264926492649264926492649264926492649264926101be565b90610148611eb760405190565b9283610c1c565b6001600160401b038111610c3d57602090601f01601f19160190565b90826000939282370152565b90929192611efb611ef682611ebe565b611eaa565b938185528183011161013657610148916020850190611eda565b610123913691611ee6565b9080601f830112156101365781602061012393359101611ee6565b9160608383031261013657611f50828461013b565b9260208101356001600160401b0381116101365783611f70918301611f20565b9260408201356001600160401b038111610136576101239201611f20565b90611f9b611ef683611ebe565b918252565b3d15611fba57611faf3d611f8e565b903d6000602084013e565b606090565b611fe0611fe9602093610e0993611fd4815190565b80835293849260200190565b9586910161197f565b601f01601f191690565b602080825261012392910190611fbf565b6001600160e01b0319811661012f565b9050519061014882612004565b906020828203126101365761012391612014565b90815260406020820181905261012392910190611fbf565b6040513d6000823e3d90fd5b61207261206c6101239263ffffffff1690565b60e01b90565b6001600160e01b03191690565b9061208b60609261235b565b93806020936120b66120b0836120a96120a3896101be565b82610dee565b868a611e45565b90611e5d565b6120c46109e1610123611e81565b036122655761210561030f6120f36121179461210d946120e2600090565b50506120ed896101be565b90610dee565b6120fd60006101be565b80968a611e45565b810190611f3b565b939092909161019d565b90843b14612219575b50505b813b6121326109e160006101be565b11612150575061014893604084359385013594013560f81c9161241d565b82949350612164610ad261218e949361019d565b631626ba7e9461217360405190565b8095819482936121838a60e01b90565b845260048401612035565b03915afa928315612214576000936121d9575b50506121b26120726121c092612059565b916001600160e01b03191690565b036121c757565b604051638baa579f60e01b8152600490fd5b6121c09293506122056121b2928261207293903d1061220d575b6121fd8183610c1c565b810190612021565b9392506121a1565b503d6121f3565b61204d565b816000929183878194519301915af1612238612233611fa0565b911590565b6122425780612120565b6107d49061224f60405190565b639d0d6e2d60e01b815291829160048301611ff3565b50506122719084611f15565b612123565b6101237ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006107ef565b6122a960006101be565b925b828410156122db576122ce6122d5916122c86106c7878787610680565b906124d3565b9360010190565b926122ab565b9250505090565b6122ec6006611f8e565b654b6574746c6560d01b602082015290565b6101236122e2565b6101236122fe565b6123186001611f8e565b603160f81b602082015290565b61012361230e565b610123612325565b6123486123426101239290565b60f01b90565b6001600160f01b03191690565b01918252565b610d0c61239f61236b6000610628565b612376610123612306565b612381610d17825190565b2061238d61012361232d565b612398610d17825190565b2091612540565b6123aa611901612335565b610d006123b660405190565b948593602085019384602093926123556002836123558895610e09976001600160f01b0319169052565b6107e96101236101239290565b6112f86101489461241660609498979561240c608086019a6000870152565b60ff166020850152565b6040830152565b93919061242a601b6123e0565b60ff83161415806124bd575b6124ab5761245560009360209561244c60405190565b948594856123ed565b838052039060015afa1561221457600051906124796124746000610765565b610117565b61248283610117565b14918215612493575b50506121c757565b6124a291925061079d90610117565b1415388061248b565b604051630424f48960e41b8152600490fd5b506124c8601c6123e0565b60ff83161415612436565b818110156124ee579061012391600052602052604060002090565b61012391600052602052604060002090565b90959492610148946125326125399261252b60809661252460a088019c6000890152565b6020870152565b6040850152565b6060830152565b01906105a8565b91610d0c91610d006125513061019d565b604051958694602086019446928661250056fea2646970667358221220da9490a73b993a8249aff5608efe1b437282149ccf2433f0ac9487ddfae1a78364736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "BidCannotBorrow";
        readonly type: "error";
    }, {
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
                readonly internalType: "enum OfferType";
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
                readonly internalType: "enum OfferType";
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
                    readonly internalType: "bool";
                    readonly name: "withLoan";
                    readonly type: "bool";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "borrowAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "loanOfferHash";
                    readonly type: "bytes32";
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
                readonly internalType: "enum OfferType";
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
                readonly internalType: "enum OfferType";
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
                    readonly internalType: "bool";
                    readonly name: "withLoan";
                    readonly type: "bool";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "borrowAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "loanOfferHash";
                    readonly type: "bytes32";
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
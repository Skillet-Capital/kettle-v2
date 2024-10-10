import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { LendingController, LendingControllerInterface } from "../../contracts/LendingController";
type LendingControllerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class LendingController__factory extends ContractFactory {
    constructor(...args: LendingControllerConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<LendingController & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): LendingController__factory;
    static readonly bytecode = "0x60806040523461001a5760405161228f610020823961228f90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063050c67d914610192578063106642c21461018d578063150b7a021461018857806316da76901461018357806326c8fbfb1461017e5780632b98ce5c146101795780634f05811014610174578063715018a61461016f57806379ba50971461016a57806383c0e1c714610165578063850b5198146101605780638da5cb5b1461015b578063afb2dcbe14610156578063b784036914610151578063bb57e30f1461014c578063c63f605214610147578063cbdca30714610142578063ddf1e4571461013d578063de335b2e14610138578063df71edce14610133578063e30c39781461012e578063f2fde38b14610129578063fd91d7cd146101245763ff88e5ac036101a25761097d565b610962565b61093e565b610923565b610907565b6108c9565b610887565b61086e565b610823565b6107ca565b610756565b610726565b6106c5565b6106aa565b610677565b610632565b61061a565b6105ff565b6105cc565b6105b1565b610563565b6104f6565b61040b565b61021a565b60009103126101a257565b600080fd5b6101bc916008021c5b6001600160a01b031690565b90565b906101bc91546101a7565b6101bc6000806101bf565b6101bc906101b0906001600160a01b031682565b6101bc906101d5565b6101bc906101e9565b610204906101f2565b9052565b60208101929161021891906101fb565b565b346101a25761022a366004610197565b6102416102356101ca565b60405191829182610208565b0390f35b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761027c57604052565b610245565b9061021861028e60405190565b928361025b565b61029e816101b0565b036101a257565b9050359061021882610295565b6101bc906101b0565b61029e816102b2565b90503590610218826102bb565b8061029e565b90503590610218826102d1565b919091610180818403126101a2576103cf610300610180610281565b9361030b81846102a5565b855261031a81602085016102c4565b602086015261032c81604085016102d7565b604086015261033e81606085016102c4565b606086015261035081608085016102d7565b60808601526103628160a085016102d7565b60a08601526103748160c085016102d7565b60c08601526103868160e085016102d7565b60e086015261010061039a828286016102d7565b908601526101206103ad828286016102a5565b908601526101406103c0828286016102d7565b908601526101608093016102d7565b90830152565b90610180828203126101a2576101bc916102e4565b908152606081019392610218929091604091610407906020830152565b0152565b346101a2576102416104266104213660046103d5565b610995565b604051919391938493846103ea565b6001600160401b03811161027c57602090601f01601f19160190565b90826000939282370152565b9092919261047261046d82610435565b610281565b93818552818301116101a257610218916020850190610451565b9080601f830112156101a2578160206101bc9335910161045d565b906080828203126101a2576104bc81836102a5565b926104ca82602085016102a5565b926104d883604083016102d7565b9260608201356001600160401b0381116101a2576101bc920161048c565b346101a25761024161051561050c3660046104a7565b929190916109cd565b604051918291826001600160e01b0319909116815260200190565b90816101809103126101a25790565b91906101a0838203126101a2576101bc90602061055c82866102d7565b9401610530565b346101a25761024161057f61057936600461053f565b90610ccc565b6040519182918290815260200190565b6101bc916008021c81565b906101bc915461058f565b6101bc6000600361059a565b346101a2576105c1366004610197565b61024161057f6105a5565b346101a2576105e56105df36600461053f565b90610cd8565b604051005b90610180828203126101a2576101bc91610530565b346101a25761024161057f6106153660046105ea565b610cf8565b346101a25761062a366004610197565b6105e5610d4a565b346101a257610642366004610197565b6105e5610d52565b906020828203126101a2576101bc916102d7565b610204906101b0565b602081019291610218919061065e565b346101a25761024161069261068d36600461064a565b610d9e565b60405191829182610667565b6101bc600060016101bf565b346101a2576106ba366004610197565b61024161023561069e565b346101a2576106d5366004610197565b610241610692610da7565b9190610200838203126101a2576106f781846102d7565b9261070582602083016102d7565b926101bc61071684604085016102a5565b93608061055c82606087016102a5565b346101a2576105e56107393660046106e0565b939290926111b7565b906020828203126101a2576101bc916102a5565b346101a2576105e5610769366004610742565b611210565b90816102809103126101a25790565b9190610300838203126101a25761079481846102d7565b926107a282602083016102d7565b926101bc6107b384604085016102a5565b9360806107c382606087016102a5565b940161076e565b346101a25761024161057f6107e036600461077d565b93929092611562565b6101bc6101bc6101bc9290565b90610800906107e9565b600052602052604060002090565b600061081e6101bc9260046107f6565b61059a565b346101a25761024161057f61083936600461064a565b61080e565b90916060828403126101a2576101bc61085784846102c4565b93604061086782602087016102d7565b94016102a5565b346101a2576105e561088136600461083e565b916115f3565b346101a2576105e561089a36600461053f565b90611676565b90916060828403126101a2576101bc6108b984846102a5565b93604061086782602087016102a5565b346101a2576105e56108dc3660046108a0565b916118c1565b91906101a0838203126101a2576101bc9061018061090082866102e4565b94016102d7565b346101a25761024161042661091d3660046108e2565b906118cc565b346101a257610933366004610197565b6102416106926118d6565b346101a2576105e5610951366004610742565b611948565b6101bc600060026101bf565b346101a257610972366004610197565b610241610692610956565b346101a2576105e561099036600461064a565b611979565b6109a0904290611982565b9192909190565b6109c06109ba6101bc9263ffffffff1690565b60e01b90565b6001600160e01b03191690565b505050506109d9600090565b506101bc63150b7a026109a7565b91906109fa6109f683836119c7565b1590565b610a07576101bc92610a1d565b604051636946eab760e01b8152600490fd5b0390fd5b9190610a28826119f9565b610a35576101bc92610b0e565b604051632e42ba1f60e01b8152600490fd5b6101bc9036906102e4565b6101bc90546102b2565b356101bc816102bb565b356101bc816102d1565b634e487b7160e01b600052601160045260246000fd5b91908201809211610a9357565b610a70565b61040761021894610ac4606094989795610aba608086019a60008701906101fb565b602085019061065e565b604083019061065e565b6040513d6000823e3d90fd5b356101bc81610295565b6040906104076102189496959396610b046060840198600085019061065e565b602083019061065e565b5090610b23610b1c82610a47565b4290611982565b90610b39610b346000969496610a52565b6101f2565b6307940ee7926060860191610b4d83610a5c565b610b6b610b5988611a52565b93610b6660808b01610a66565b610a86565b91803b156101a257610b94600088610ba18296610b8760405190565b9889978896879560e01b90565b8552339060048601610a98565b03925af18015610c9b57610cb6575b50610bc7610bc1610b346000610a52565b91610a5c565b90610bd56101208701610ada565b93813b156101a2576000610b9491610bf18296610b8760405190565b03925af18015610c9b57610ca0575b50610c10610b3460208401610a5c565b610c19306101f2565b90610c2f6040610c2886610ada565b9501610a66565b90803b156101a257610c639460008094610c4860405190565b97889586948593632142170760e11b5b855260048501610ae4565b03925af1918215610c9b576101bc92610c7d575b50611b05565b610c95906000610c8d818361025b565b810190610197565b38610c77565b610ace565b610cb0906000610c8d818361025b565b38610c00565b610cc6906000610c8d818361025b565b38610bb0565b6101bc919060006109e7565b6109f682610ce5926119c7565b610a0757610cf2906119f9565b610a3557565b610d0d6101bc91610d07600090565b50610a47565b611bb1565b610d1a611bef565b610218610d38565b6101b06101bc6101bc9290565b6101bc90610d22565b610218610d456000610d2f565b611c4b565b610218610d12565b33610d5b6118d6565b610d6d610d67836101b0565b916101b0565b03610d7b5761021890611c4b565b610a1990610d8860405190565b63118cdaa760e01b815291829160048301610667565b6101bc90611a52565b6101bc60007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610a52565b93929190610dea610de56002610a52565b6101b0565b610df3336101b0565b03610e015761021894610e20565b604051632e60f98560e11b8152600490fd5b91908203918211610a9357565b9193909293610e31610b1c83610a47565b92919390610e4e610e4188611a52565b94610b6660808501610a66565b94808710156110ae575084861115610fd257610e6d610b346000610a52565b956307940ee7966060840195610e8287610a5c565b823b156101a2578692610ead60008c610eb88d8397610ea060405190565b998a988997889660e01b90565b865260048601610a98565b03925af18015610c9b57610fbc575b50610ed28682610e13565b92610ee0610b346000610a52565b610f01610120610eef89610a5c565b930198610efb8a610ada565b94610e13565b813b156101a25760008a610f2a610ead938397610f1d60405190565b9b8c988997889660e01b90565b03925af1928315610c9b57610f4493610fa6575b50610e13565b610f63610f5d610f57610b346000610a52565b93610a5c565b93610ada565b90823b156101a257600094610f8d8692610ead94610f8060405190565b9a8b988997889660e01b90565b03925af1918215610c9b5761021892610c7d5750611b05565b610fb6906000610c8d818361025b565b38610f3e565b610fcc906000610c8d818361025b565b38610ec7565b91610fe5610b3460009795939697610a52565b936307940ee7966060870195610ffa87610a5c565b813b156101a257600091610ead838c611017888b610f1d60405190565b03925af1928315610c9b5761103093610fa65750610e13565b9061103e610b346000610a52565b61104785610a5c565b90803b156101a257610ead6000896110658d978397610ea060405190565b03925af18015610c9b57611098575b50610f6361012061109161108b610b346000610a52565b94610a5c565b9401610ada565b6110a8906000610c8d818361025b565b38611074565b90916110c4610b3460009a959a98979698610a52565b946307940ee79760608301966110d988610a5c565b90803b156101a257610ead60008c8f966110f8908397610ea060405190565b03925af18015610c9b576111a1575b50611115610b346000610a52565b9061112c61012061112588610a5c565b9201610ada565b91803b156101a257610ead60008a61114a8e988397610f8060405190565b03925af1918215610c9b5761116f9261118b575b50610efb61108b610b346000610a52565b823b156101a257600094610f8d8692610ead94610f8060405190565b61119b906000610c8d818361025b565b3861115e565b6111b1906000610c8d818361025b565b38611107565b9061021894939291610dd4565b610218906111d0611bef565b611205565b906001600160a01b03905b9181191691161790565b906111fa6101bc611201926101f2565b82546111d5565b9055565b6102189060026111ea565b610218906111c4565b949392919061122b610de56002610a52565b611234336101b0565b03610e01576101bc9561139a565b6101bc610180610281565b90610204906101b0565b90610204906102b2565b6101bc9081565b6101bc9054611261565b90600019906111e0565b9061128c6101bc611201926107e9565b8254611272565b9061128c6101bc6112019290565b9160206102189294936104076040820196600083019061065e565b9061016080610218936112d76000820151600086019061065e565b6112e9602082015160208601906101fb565b6112f860408201516040860152565b61130a606082015160608601906101fb565b61131960808201516080860152565b61132860a082015160a0860152565b61133760c082015160c0860152565b61134660e082015160e0860152565b611357610100820151610100860152565b61136b61012082015161012086019061065e565b61137c610140820151610140860152565b0151910152565b9081526101a08101929161021891602001906112bc565b50929493919290916113ae60c08201610a5c565b926101008201906113be82610a5c565b906113cb60808401610a66565b906113d860a08501610a66565b926113e560c08601610a66565b9460e0016113f290610a66565b6102009096019661140288610ada565b9760200161140f90610a66565b98611418611242565b9c611423908e61124d565b6114309060208e01611257565b60408c01526114429060608c01611257565b60808a015260a089015260c088015260e087015261010086015261146a90610120860161124d565b61014084015261147c42610160850152565b6114866003611268565b9261149560018501600361127c565b8361149f82611bb1565b6114aa8260046107f6565b906114b491611293565b6114be6001610a52565b6114c7906101f2565b803b156101a257816000916114ff95836114e060405190565b8098819582946114f46340c10f1960e01b90565b8452600484016112a1565b03925af1928315610c9b577fc82fbaf335c9b58bd42afc21885963def0be9748bbcaf92b17a8051fa9e3b2de9361154c575b5061154761153e60405190565b92839283611383565b0390a1565b61155c906000610c8d818361025b565b38611531565b6101bc94939291906000611219565b9190611580610de56002610a52565b611589336101b0565b03610e01576102189261159b906101f2565b906115a5306101f2565b91803b156101a2576115d293600080946115be60405190565b96879586948593632142170760e11b610c58565b03925af18015610c9b576115e35750565b610218906000610c8d818361025b565b906102189291611571565b9061160c6109f682846119c7565b610a0757610218916116206109f6836119f9565b61166457611633610b3460208401610a5c565b61163c306101f2565b9061164b6040610c2885611a52565b90803b156101a257610f8d9460008094610c4860405190565b60405163374871bf60e01b8152600490fd5b90610218916115fe565b6101bc9060401c5b60ff1690565b6101bc9054611680565b6101bc905b6001600160401b031690565b6101bc9054611698565b61169d6101bc6101bc9290565b906001600160401b03906111e0565b61169d6101bc6101bc926001600160401b031690565b906116f56101bc611201926116cf565b82546116c0565b9060ff60401b9060401b6111e0565b9061171b6101bc61120192151590565b82546116fc565b610204906116b3565b6020810192916102189190611722565b917ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0092839061177561176f6109f68461168e565b926116a9565b92600094611782866116b3565b6001600160401b038616148061187e575b6001956117af6117a2886116b3565b916001600160401b031690565b149081611856575b155b908161184d575b5061183b576117e992846117e0886117d7896116b3565b9a01998a6116e5565b61182c57611885565b6117f257505050565b611820611547927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29461170b565b6040519182918261172b565b611836868961170b565b611885565b60405163f92ee8a960e01b8152600490fd5b159050386117c0565b90506117b9611864306101f2565b3b6118756118718a6107e9565b9190565b149190506117b7565b5083611793565b90610b3461189f6118a693610b346118ad96610d45611c70565b60006111ea565b60016111ea565b6102186118ba60016107e9565b600361127c565b90610218929161173b565b6109a09190611982565b6101bc6000610dce611c78565b610218906118ef611bef565b6119038160006118fd611c78565b016111ea565b611917611911610b34610da7565b916101f2565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270061194260405190565b600090a3565b610218906118e3565b61195e610de56002610a52565b611967336101b0565b03610e01576102189061021890611b05565b61021890611951565b6109a09190611992608082015190565b61016082015160e0830151906119aa61014085015190565b926119c160c06119bb60a088015190565b96015190565b95611c9c565b6118716101bc610d0d6119ef6119ea6119f5956119e2600090565b5060046107f6565b611268565b94610a47565b1490565b611a2c90611a1f610100611a25611a136101608501610a66565b611a1f60e08601610a66565b90610a86565b9201610a66565b421190565b9050519061021882610295565b906020828203126101a2576101bc91611a31565b6020611a8f91611a60600090565b50611a6e610b346001610a52565b604051938492839182916331a9108f60e11b83526004830190815260200190565b03915afa908115610c9b57600091611aa5575090565b6101bc915060203d602011611ac7575b611abf818361025b565b810190611a3e565b503d611ab5565b9160001960089290920291821b911b6111e0565b9190611af16101bc6112019390565b908354611ace565b61021891600091611ae2565b611b12610b346001610a52565b90813b156101a2576000611b2560405190565b630852cd8d60e31b815260048101839052928390602490829084905af1908115610c9b577fb3225085671eed0596cb3a88aa67874383e680234c3cea848d93bb9c6cbf83d59261154792611b8a575b5061057f6000611b858360046107f6565b611af9565b611b9a906000610c8d818361025b565b38611b74565b6101808101929161021891906112bc565b611bd9611bbd60405190565b8092611bcd602083019182611ba0565b9081038252038261025b565b611beb611be4825190565b9160200190565b2090565b611bf7610da7565b3390611c05610d67836101b0565b03610d7b5750565b916001600160a01b0360089290920291821b911b6111e0565b9190611c376101bc611201936101f2565b908354611c0d565b61021891600091611c26565b61021890611c63600080611c5d611c78565b01611c3f565b611d21565b610218611d86565b610218611c68565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b81959192611d129597611cfc95611cbd8484611cb6600090565b9c89611de0565b9950611ccc6101bc8285610a86565b841115611d155780611cf0610efb9685611ce9611cf69582610a86565b918a611de0565b93610a86565b91611de0565b610b66611d0a848396610e13565b918294610a86565b92565b5050610efb9284611de0565b611d5b6119117f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610b3484611d5583610a52565b926111ea565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e061194260405190565b611d916109f6611e4a565b611d9757565b604051631afcd79f60e31b8152600490fd5b8181029291600160ff1b81146000831216610a93578184051490151715610a9357565b6101bc6a1a1601fc4ea7109e0000006107e9565b611e45611e3f91611e3f611e39611e33611e25611e0e611e09611e099a6101bc9c610f3e600090565b6107e9565b611e1f670de0b6b3a76400006107e9565b90611da9565b611e2d611dcc565b90611e73565b926107e9565b94611edb565b90611f13565b611fa1565b6101bc7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061168e565b670de0b6b3a7640000810290670de0b6b3a764000082051482151516156101a2570590565b81810292918115918404141715610a9357565b6101bc6127106107e9565b634e487b7160e01b600052601260045260246000fd5b8115611ed6570490565b611eb6565b611e09611f056101bc92611eed600090565b50611eff670de0b6b3a76400006107e9565b90611e98565b611f0d611eab565b90611ecc565b6000198114600160ff1b8314166101a2578181029181830514901517156101a257670de0b6b3a7640000900590565b6116886101bc6101bc9290565b6101bc90611f636118716101bc9460ff1690565b901b90565b8115611ed6570590565b6101bc90611f866118716101bc9460ff1690565b901d90565b6101bc90611f9c6118716101bc9490565b901c90565b611fb4680248ce36a70cb26b3e196107e9565b81131561224e57611fcd680755bf798b4a1bf1e56107e9565b81121561221a57611fde604e611f42565b611fe791611f4f565b611ff66503782dace9d96107e9565b611fff91611f68565b6120096060611f42565b6120138183611f4f565b91816bb17217f7d1cf79abc9e3b3989361202c856107e9565b61203591611f68565b6120426001605f1b6107e9565b019061204d91611f72565b92612057906107e9565b830290039080806120746c10fe68e7fd37d0007b713f76506107e9565b840184029061208291611f72565b6120996d02d16720577bd19bf614176fe9ea6107e9565b018084016120b46d04a4fd9f2a8b96949216d2255a6c6107e9565b900302906120c191611f72565b6120d96e0587f503bb6ea29d25fcb7401964506107e9565b0182026120f66d360d7aeea093263ecc6e0ecb291760621b6107e9565b0191818080806121126c240c330e9fb2d9cbaf0fd5aafc6107e9565b850385029061212091611f72565b6121376d0277594991cfc85f6e2461837cd96107e9565b0184029061214491611f72565b61215b6d1a521255e34f6a5061b25ef1c9c46107e9565b6121689291038402611f72565b61217f6db1bbb201f443cf962f1a1d3db4a56107e9565b0182029061218c91611f72565b6121a46e02c72388d9f74f51a9331fed693f156107e9565b900302906121b191611f72565b6121c96e05180bb14799ab47a8a8cb2a527d576107e9565b016121d491056107e9565b6121f274029d9dc38563c32e5c2f6dc192ee70ef65f9978af36107e9565b02906121fe60c36107e9565b03612208906107e9565b61221191611f8b565b6101bc906107e9565b60405162461bcd60e51b815260206004820152600c60248201526b4558505f4f564552464c4f5760a01b6044820152606490fd5b506101bc60006107e956fea2646970667358221220e1a39a2046c07a217bda586c589101015bc749dd59acbe5ffa668a14e1ec35d764736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidLien";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "LienIsCurrent";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "LienIsDefaulted";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotInitializing";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OnlyKettle";
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
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }];
        readonly name: "LienClosed";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly indexed: false;
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "LienOpened";
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
        readonly name: "LENDER_RECEIPT";
        readonly outputs: readonly [{
            readonly internalType: "contract ILenderReceipt";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "conduitController";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "receipt";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "__LendingController_init";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "acceptOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "claim";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }];
        readonly name: "closeLien";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "primaryPayer";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "residualPayerOrRecipient";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "closeLienWithPayments";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "computeCurrentDebt";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "debt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "interest";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
        readonly name: "computeDebtAt";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "debt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "interest";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "conduit";
        readonly outputs: readonly [{
            readonly internalType: "contract ITransferConduit";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }];
        readonly name: "currentLender";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "hashLien";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "kettle";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "lienIndex";
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
        readonly name: "liens";
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
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "principal";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "lender";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "borrower";
            readonly type: "address";
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
        }];
        readonly name: "openLien";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [{
            readonly internalType: "contract IERC721";
            readonly name: "collection";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }];
        readonly name: "releaseCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
            readonly name: "lienId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_kettle";
            readonly type: "address";
        }];
        readonly name: "setKettle";
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
            readonly internalType: "uint256";
            readonly name: "lienId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "borrower";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "tokenId";
                readonly type: "uint256";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "principal";
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
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Lien";
            readonly name: "lien";
            readonly type: "tuple";
        }];
        readonly name: "verifyLienIsCurrent";
        readonly outputs: readonly [];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): LendingControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): LendingController;
}
export {};

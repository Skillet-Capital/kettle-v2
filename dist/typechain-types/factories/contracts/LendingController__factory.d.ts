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
    static readonly bytecode = "0x60806040523461001a57604051612293610020823961229390f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063050c67d914610192578063106642c21461018d578063150b7a021461018857806316da76901461018357806326c8fbfb1461017e5780632b98ce5c146101795780634f05811014610174578063715018a61461016f57806379ba50971461016a57806383c0e1c714610165578063850b5198146101605780638da5cb5b1461015b578063afb2dcbe14610156578063b784036914610151578063bb57e30f1461014c578063c63f605214610147578063cbdca30714610142578063d782a0801461013d578063ddf1e45714610138578063de335b2e14610133578063df71edce1461012e578063e30c397814610129578063f2fde38b146101245763fd91d7cd036101a25761097b565b610957565b61093c565b610920565b6108e2565b6108a0565b610887565b61086e565b610823565b6107ca565b610756565b610726565b6106c5565b6106aa565b610677565b610632565b61061a565b6105ff565b6105cc565b6105b1565b610563565b6104f6565b61040b565b61021a565b60009103126101a257565b600080fd5b6101bc916008021c5b6001600160a01b031690565b90565b906101bc91546101a7565b6101bc6000806101bf565b6101bc906101b0906001600160a01b031682565b6101bc906101d5565b6101bc906101e9565b610204906101f2565b9052565b60208101929161021891906101fb565b565b346101a25761022a366004610197565b6102416102356101ca565b60405191829182610208565b0390f35b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b0382111761027c57604052565b610245565b9061021861028e60405190565b928361025b565b61029e816101b0565b036101a257565b9050359061021882610295565b6101bc906101b0565b61029e816102b2565b90503590610218826102bb565b8061029e565b90503590610218826102d1565b919091610180818403126101a2576103cf610300610180610281565b9361030b81846102a5565b855261031a81602085016102c4565b602086015261032c81604085016102d7565b604086015261033e81606085016102c4565b606086015261035081608085016102d7565b60808601526103628160a085016102d7565b60a08601526103748160c085016102d7565b60c08601526103868160e085016102d7565b60e086015261010061039a828286016102d7565b908601526101206103ad828286016102a5565b908601526101406103c0828286016102d7565b908601526101608093016102d7565b90830152565b90610180828203126101a2576101bc916102e4565b908152606081019392610218929091604091610407906020830152565b0152565b346101a2576102416104266104213660046103d5565b610996565b604051919391938493846103ea565b6001600160401b03811161027c57602090601f01601f19160190565b90826000939282370152565b9092919261047261046d82610435565b610281565b93818552818301116101a257610218916020850190610451565b9080601f830112156101a2578160206101bc9335910161045d565b906080828203126101a2576104bc81836102a5565b926104ca82602085016102a5565b926104d883604083016102d7565b9260608201356001600160401b0381116101a2576101bc920161048c565b346101a25761024161051561050c3660046104a7565b929190916109ce565b604051918291826001600160e01b0319909116815260200190565b90816101809103126101a25790565b91906101a0838203126101a2576101bc90602061055c82866102d7565b9401610530565b346101a25761024161057f61057936600461053f565b90610ccd565b6040519182918290815260200190565b6101bc916008021c81565b906101bc915461058f565b6101bc6000600361059a565b346101a2576105c1366004610197565b61024161057f6105a5565b346101a2576105e56105df36600461053f565b90610cd9565b604051005b90610180828203126101a2576101bc91610530565b346101a25761024161057f6106153660046105ea565b610cf9565b346101a25761062a366004610197565b6105e5610d4b565b346101a257610642366004610197565b6105e5610d53565b906020828203126101a2576101bc916102d7565b610204906101b0565b602081019291610218919061065e565b346101a25761024161069261068d36600461064a565b610d9f565b60405191829182610667565b6101bc600060016101bf565b346101a2576106ba366004610197565b61024161023561069e565b346101a2576106d5366004610197565b610241610692610da8565b9190610200838203126101a2576106f781846102d7565b9261070582602083016102d7565b926101bc61071684604085016102a5565b93608061055c82606087016102a5565b346101a2576105e56107393660046106e0565b939290926111b8565b906020828203126101a2576101bc916102a5565b346101a2576105e5610769366004610742565b611211565b90816102809103126101a25790565b9190610300838203126101a25761079481846102d7565b926107a282602083016102d7565b926101bc6107b384604085016102a5565b9360806107c382606087016102a5565b940161076e565b346101a25761024161057f6107e036600461077d565b93929092611563565b6101bc6101bc6101bc9290565b90610800906107e9565b600052602052604060002090565b600061081e6101bc9260046107f6565b61059a565b346101a25761024161057f61083936600461064a565b61080e565b90916060828403126101a2576101bc61085784846102c4565b93604061086782602087016102d7565b94016102a5565b346101a2576105e561088136600461083e565b916115f4565b346101a2576105e561089a36600461053f565b90611629565b346101a2576105e56108b336600461053f565b906116ab565b90916060828403126101a2576101bc6108d284846102a5565b93604061086782602087016102a5565b346101a2576105e56108f53660046108b9565b916118f6565b91906101a0838203126101a2576101bc9061018061091982866102e4565b94016102d7565b346101a2576102416104266109363660046108fb565b90611901565b346101a25761094c366004610197565b61024161069261190b565b346101a2576105e561096a366004610742565b61197d565b6101bc600060026101bf565b346101a25761098b366004610197565b61024161069261096f565b6109a1904290611986565b9192909190565b6109c16109bb6101bc9263ffffffff1690565b60e01b90565b6001600160e01b03191690565b505050506109da600090565b506101bc63150b7a026109a8565b91906109fb6109f783836119cb565b1590565b610a08576101bc92610a1e565b604051636946eab760e01b8152600490fd5b0390fd5b9190610a29826119fd565b610a36576101bc92610b0f565b604051632e42ba1f60e01b8152600490fd5b6101bc9036906102e4565b6101bc90546102b2565b356101bc816102bb565b356101bc816102d1565b634e487b7160e01b600052601160045260246000fd5b91908201809211610a9457565b610a71565b61040761021894610ac5606094989795610abb608086019a60008701906101fb565b602085019061065e565b604083019061065e565b6040513d6000823e3d90fd5b356101bc81610295565b6040906104076102189496959396610b056060840198600085019061065e565b602083019061065e565b5090610b24610b1d82610a48565b4290611986565b90610b3a610b356000969496610a53565b6101f2565b6307940ee7926060860191610b4e83610a5d565b610b6c610b5a88611a56565b93610b6760808b01610a67565b610a87565b91803b156101a257610b95600088610ba28296610b8860405190565b9889978896879560e01b90565b8552339060048601610a99565b03925af18015610c9c57610cb7575b50610bc8610bc2610b356000610a53565b91610a5d565b90610bd66101208701610adb565b93813b156101a2576000610b9591610bf28296610b8860405190565b03925af18015610c9c57610ca1575b50610c11610b3560208401610a5d565b610c1a306101f2565b90610c306040610c2986610adb565b9501610a67565b90803b156101a257610c649460008094610c4960405190565b97889586948593632142170760e11b5b855260048501610ae5565b03925af1918215610c9c576101bc92610c7e575b50611b09565b610c96906000610c8e818361025b565b810190610197565b38610c78565b610acf565b610cb1906000610c8e818361025b565b38610c01565b610cc7906000610c8e818361025b565b38610bb1565b6101bc919060006109e8565b6109f782610ce6926119cb565b610a0857610cf3906119fd565b610a3657565b610d0e6101bc91610d08600090565b50610a48565b611bb5565b610d1b611bf3565b610218610d39565b6101b06101bc6101bc9290565b6101bc90610d23565b610218610d466000610d30565b611c4f565b610218610d13565b33610d5c61190b565b610d6e610d68836101b0565b916101b0565b03610d7c5761021890611c4f565b610a1a90610d8960405190565b63118cdaa760e01b815291829160048301610667565b6101bc90611a56565b6101bc60007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610a53565b93929190610deb610de66002610a53565b6101b0565b610df4336101b0565b03610e025761021894610e21565b604051632e60f98560e11b8152600490fd5b91908203918211610a9457565b9193909293610e32610b1d83610a48565b92919390610e4f610e4288611a56565b94610b6760808501610a67565b94808710156110af575084861115610fd357610e6e610b356000610a53565b956307940ee7966060840195610e8387610a5d565b823b156101a2578692610eae60008c610eb98d8397610ea160405190565b998a988997889660e01b90565b865260048601610a99565b03925af18015610c9c57610fbd575b50610ed38682610e14565b92610ee1610b356000610a53565b610f02610120610ef089610a5d565b930198610efc8a610adb565b94610e14565b813b156101a25760008a610f2b610eae938397610f1e60405190565b9b8c988997889660e01b90565b03925af1928315610c9c57610f4593610fa7575b50610e14565b610f64610f5e610f58610b356000610a53565b93610a5d565b93610adb565b90823b156101a257600094610f8e8692610eae94610f8160405190565b9a8b988997889660e01b90565b03925af1918215610c9c5761021892610c7e5750611b09565b610fb7906000610c8e818361025b565b38610f3f565b610fcd906000610c8e818361025b565b38610ec8565b91610fe6610b3560009795939697610a53565b936307940ee7966060870195610ffb87610a5d565b813b156101a257600091610eae838c611018888b610f1e60405190565b03925af1928315610c9c5761103193610fa75750610e14565b9061103f610b356000610a53565b61104885610a5d565b90803b156101a257610eae6000896110668d978397610ea160405190565b03925af18015610c9c57611099575b50610f6461012061109261108c610b356000610a53565b94610a5d565b9401610adb565b6110a9906000610c8e818361025b565b38611075565b90916110c5610b3560009a959a98979698610a53565b946307940ee79760608301966110da88610a5d565b90803b156101a257610eae60008c8f966110f9908397610ea160405190565b03925af18015610c9c576111a2575b50611116610b356000610a53565b9061112d61012061112688610a5d565b9201610adb565b91803b156101a257610eae60008a61114b8e988397610f8160405190565b03925af1918215610c9c576111709261118c575b50610efc61108c610b356000610a53565b823b156101a257600094610f8e8692610eae94610f8160405190565b61119c906000610c8e818361025b565b3861115f565b6111b2906000610c8e818361025b565b38611108565b9061021894939291610dd5565b610218906111d1611bf3565b611206565b906001600160a01b03905b9181191691161790565b906111fb6101bc611202926101f2565b82546111d6565b9055565b6102189060026111eb565b610218906111c5565b949392919061122c610de66002610a53565b611235336101b0565b03610e02576101bc9561139b565b6101bc610180610281565b90610204906101b0565b90610204906102b2565b6101bc9081565b6101bc9054611262565b90600019906111e1565b9061128d6101bc611202926107e9565b8254611273565b9061128d6101bc6112029290565b9160206102189294936104076040820196600083019061065e565b9061016080610218936112d86000820151600086019061065e565b6112ea602082015160208601906101fb565b6112f960408201516040860152565b61130b606082015160608601906101fb565b61131a60808201516080860152565b61132960a082015160a0860152565b61133860c082015160c0860152565b61134760e082015160e0860152565b611358610100820151610100860152565b61136c61012082015161012086019061065e565b61137d610140820151610140860152565b0151910152565b9081526101a08101929161021891602001906112bd565b50929493919290916113af60c08201610a5d565b926101008201906113bf82610a5d565b906113cc60808401610a67565b906113d960a08501610a67565b926113e660c08601610a67565b9460e0016113f390610a67565b6102009096019661140388610adb565b9760200161141090610a67565b98611419611243565b9c611424908e61124e565b6114319060208e01611258565b60408c01526114439060608c01611258565b60808a015260a089015260c088015260e087015261010086015261146b90610120860161124e565b61014084015261147d42610160850152565b6114876003611269565b9261149660018501600361127d565b836114a082611bb5565b6114ab8260046107f6565b906114b591611294565b6114bf6001610a53565b6114c8906101f2565b803b156101a2578160009161150095836114e160405190565b8098819582946114f56340c10f1960e01b90565b8452600484016112a2565b03925af1928315610c9c577fc82fbaf335c9b58bd42afc21885963def0be9748bbcaf92b17a8051fa9e3b2de9361154d575b5061154861153f60405190565b92839283611384565b0390a1565b61155d906000610c8e818361025b565b38611532565b6101bc9493929190600061121a565b9190611581610de66002610a53565b61158a336101b0565b03610e02576102189261159c906101f2565b906115a6306101f2565b91803b156101a2576115d393600080946115bf60405190565b96879586948593632142170760e11b610c59565b03925af18015610c9c576115e45750565b610218906000610c8e818361025b565b906102189291611572565b9061160d610de66002610a53565b611616336101b0565b03610e0257610218916102189150611b09565b90610218916115ff565b906116416109f782846119cb565b610a0857610218916116556109f7836119fd565b61169957611668610b3560208401610a5d565b611671306101f2565b906116806040610c2985611a56565b90803b156101a257610f8e9460008094610c4960405190565b60405163374871bf60e01b8152600490fd5b9061021891611633565b6101bc9060401c5b60ff1690565b6101bc90546116b5565b6101bc905b6001600160401b031690565b6101bc90546116cd565b6116d26101bc6101bc9290565b906001600160401b03906111e1565b6116d26101bc6101bc926001600160401b031690565b9061172a6101bc61120292611704565b82546116f5565b9060ff60401b9060401b6111e1565b906117506101bc61120292151590565b8254611731565b610204906116e8565b6020810192916102189190611757565b917ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a009283906117aa6117a46109f7846116c3565b926116de565b926000946117b7866116e8565b6001600160401b03861614806118b3575b6001956117e46117d7886116e8565b916001600160401b031690565b14908161188b575b155b9081611882575b506118705761181e92846118158861180c896116e8565b9a01998a61171a565b611861576118ba565b61182757505050565b611855611548927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d294611740565b60405191829182611760565b61186b8689611740565b6118ba565b60405163f92ee8a960e01b8152600490fd5b159050386117f5565b90506117ee611899306101f2565b3b6118aa6118a68a6107e9565b9190565b149190506117ec565b50836117c8565b90610b356118d46118db93610b356118e296610d46611c74565b60006111eb565b60016111eb565b6102186118ef60016107e9565b600361127d565b906102189291611770565b6109a19190611986565b6101bc6000610dcf611c7c565b61021890611924611bf3565b611938816000611932611c7c565b016111eb565b61194c611946610b35610da8565b916101f2565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270061197760405190565b600090a3565b61021890611918565b6109a19190611996608082015190565b61016082015160e0830151906119ae61014085015190565b926119c560c06119bf60a088015190565b96015190565b95611ca0565b6118a66101bc610d0e6119f36119ee6119f9956119e6600090565b5060046107f6565b611269565b94610a48565b1490565b611a3090611a23610100611a29611a176101608501610a67565b611a2360e08601610a67565b90610a87565b9201610a67565b421190565b9050519061021882610295565b906020828203126101a2576101bc91611a35565b6020611a9391611a64600090565b50611a72610b356001610a53565b604051938492839182916331a9108f60e11b83526004830190815260200190565b03915afa908115610c9c57600091611aa9575090565b6101bc915060203d602011611acb575b611ac3818361025b565b810190611a42565b503d611ab9565b9160001960089290920291821b911b6111e1565b9190611af56101bc6112029390565b908354611ad2565b61021891600091611ae6565b611b16610b356001610a53565b90813b156101a2576000611b2960405190565b630852cd8d60e31b815260048101839052928390602490829084905af1908115610c9c577fb3225085671eed0596cb3a88aa67874383e680234c3cea848d93bb9c6cbf83d59261154892611b8e575b5061057f6000611b898360046107f6565b611afd565b611b9e906000610c8e818361025b565b38611b78565b6101808101929161021891906112bd565b611bdd611bc160405190565b8092611bd1602083019182611ba4565b9081038252038261025b565b611bef611be8825190565b9160200190565b2090565b611bfb610da8565b3390611c09610d68836101b0565b03610d7c5750565b916001600160a01b0360089290920291821b911b6111e1565b9190611c3b6101bc611202936101f2565b908354611c11565b61021891600091611c2a565b61021890611c67600080611c61611c7c565b01611c43565b611d25565b610218611d8a565b610218611c6c565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b81959192611d169597611d0095611cc18484611cba600090565b9c89611de4565b9950611cd06101bc8285610a87565b841115611d195780611cf4610efc9685611ced611cfa9582610a87565b918a611de4565b93610a87565b91611de4565b610b67611d0e848396610e14565b918294610a87565b92565b5050610efc9284611de4565b611d5f6119467f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610b3584611d5983610a53565b926111eb565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e061197760405190565b611d956109f7611e4e565b611d9b57565b604051631afcd79f60e31b8152600490fd5b8181029291600160ff1b81146000831216610a94578184051490151715610a9457565b6101bc6a1a1601fc4ea7109e0000006107e9565b611e49611e4391611e43611e3d611e37611e29611e12611e0d611e0d9a6101bc9c610f3f600090565b6107e9565b611e23670de0b6b3a76400006107e9565b90611dad565b611e31611dd0565b90611e77565b926107e9565b94611edf565b90611f17565b611fa5565b6101bc7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006116c3565b670de0b6b3a7640000810290670de0b6b3a764000082051482151516156101a2570590565b81810292918115918404141715610a9457565b6101bc6127106107e9565b634e487b7160e01b600052601260045260246000fd5b8115611eda570490565b611eba565b611e0d611f096101bc92611ef1600090565b50611f03670de0b6b3a76400006107e9565b90611e9c565b611f11611eaf565b90611ed0565b6000198114600160ff1b8314166101a2578181029181830514901517156101a257670de0b6b3a7640000900590565b6116bd6101bc6101bc9290565b6101bc90611f676118a66101bc9460ff1690565b901b90565b8115611eda570590565b6101bc90611f8a6118a66101bc9460ff1690565b901d90565b6101bc90611fa06118a66101bc9490565b901c90565b611fb8680248ce36a70cb26b3e196107e9565b81131561225257611fd1680755bf798b4a1bf1e56107e9565b81121561221e57611fe2604e611f46565b611feb91611f53565b611ffa6503782dace9d96107e9565b61200391611f6c565b61200d6060611f46565b6120178183611f53565b91816bb17217f7d1cf79abc9e3b39893612030856107e9565b61203991611f6c565b6120466001605f1b6107e9565b019061205191611f76565b9261205b906107e9565b830290039080806120786c10fe68e7fd37d0007b713f76506107e9565b840184029061208691611f76565b61209d6d02d16720577bd19bf614176fe9ea6107e9565b018084016120b86d04a4fd9f2a8b96949216d2255a6c6107e9565b900302906120c591611f76565b6120dd6e0587f503bb6ea29d25fcb7401964506107e9565b0182026120fa6d360d7aeea093263ecc6e0ecb291760621b6107e9565b0191818080806121166c240c330e9fb2d9cbaf0fd5aafc6107e9565b850385029061212491611f76565b61213b6d0277594991cfc85f6e2461837cd96107e9565b0184029061214891611f76565b61215f6d1a521255e34f6a5061b25ef1c9c46107e9565b61216c9291038402611f76565b6121836db1bbb201f443cf962f1a1d3db4a56107e9565b0182029061219091611f76565b6121a86e02c72388d9f74f51a9331fed693f156107e9565b900302906121b591611f76565b6121cd6e05180bb14799ab47a8a8cb2a527d576107e9565b016121d891056107e9565b6121f674029d9dc38563c32e5c2f6dc192ee70ef65f9978af36107e9565b029061220260c36107e9565b0361220c906107e9565b61221591611f8f565b6101bc906107e9565b60405162461bcd60e51b815260206004820152600c60248201526b4558505f4f564552464c4f5760a01b6044820152606490fd5b506101bc60006107e956fea264697066735822122011b1d53e1d0ddc5eac5e18d30b7e5fb7c089cf5500a88ac78ccb167feca82ecd64736f6c63430008180033";
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
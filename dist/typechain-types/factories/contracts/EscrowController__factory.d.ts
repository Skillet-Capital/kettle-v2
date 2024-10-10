import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { EscrowController, EscrowControllerInterface } from "../../contracts/EscrowController";
type EscrowControllerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class EscrowController__factory extends ContractFactory {
    constructor(...args: EscrowControllerConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<EscrowController & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): EscrowController__factory;
    static readonly bytecode = "0x60806040523461001a57604051611d796100208239611d7990f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063012f52ee146101a25780630d6680871461019d5780631730b63914610198578063187de095146101935780632811e6bb1461018e5780633b77664214610189578063490b4846146101845780634b4687b51461017f57806353ae97391461017a57806355d8525e146101755780635cc4a592146101705780636ba2700e1461016b578063715018a61461016657806379ba5097146101615780638b176b011461015c5780638da5cb5b14610157578063ae04d45d14610152578063b78403691461014d578063c22e54a114610148578063e30c397814610143578063ea05a8c61461013e578063f2fde38b14610139578063f4be779c14610134578063f8b963b11461012f5763fd91d7cd036101b0576108f3565b6108b7565b610880565b610858565b610840565b610811565b6107f6565b6107ce565b6107b6565b61078f565b61075a565b610704565b6106ec565b6106d3565b6106b4565b61063d565b6105df565b61058f565b610551565b610524565b6104ca565b6104a0565b610452565b610275565b61022f565b805b036101b057565b600080fd5b905035906101c2826101a7565b565b906020828203126101b0576101d8916101b5565b90565b6101d86101d86101d89290565b906101f2906101db565b600052602052604060002090565b6101d8916008021c81565b906101d89154610200565b60006102266101d89260046101e8565b61020b565b9052565b346101b05761025a61024a6102453660046101c4565b610216565b6040519182918290815260200190565b0390f35b60009103126101b057565b6101d86000600261020b565b346101b05761028536600461025e565b61025a61024a610269565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176102c857604052565b610290565b906101c26102da60405190565b92836102a6565b600211156101b057565b905035906101c2826102e1565b6001600160a01b031690565b6101a9816102f8565b905035906101c282610304565b6101d8906102f8565b6101a98161031a565b905035906101c282610323565b9190916101a0818403126101b0576104376103556101a06102cd565b9361036081846102eb565b855261036f81602085016101b5565b602086015261038181604085016101b5565b6040860152610393816060850161030d565b60608601526103a5816080850161030d565b60808601526103b78160a0850161032c565b60a08601526103c98160c0850161032c565b60c08601526103db8160e0850161030d565b60e08601526101006103ef828286016101b5565b90860152610120610402828286016101b5565b90860152610140610415828286016101b5565b90860152610160610428828286016101b5565b908601526101808093016101b5565b90830152565b906101a0828203126101b0576101d891610339565b346101b05761025a61024a61046836600461043d565b61090e565b90816101a09103126101b05790565b91906101c0838203126101b0576101d890602061049982866101b5565b940161046d565b346101b0576104b96104b336600461047c565b90610bad565b604051005b6101d86000600161020b565b346101b0576104da36600461025e565b61025a61024a6104be565b8015156101a9565b905035906101c2826104e5565b90916101e0828403126101b0576101d861051484846104ed565b93604061049982602087016101b5565b346101b0576104b96105373660046104fa565b91610d6f565b906020828203126101b0576101d89161030d565b346101b0576104b961056436600461053d565b61100d565b6101d8916008021c5b60ff1690565b906101d89154610569565b6101d860006003610578565b346101b05761059f36600461025e565b61025a6105aa610583565b60405191829182901515815260200190565b91906040838203126101b0576101d89060206105d8828661030d565b94016104ed565b346101b0576104b96105f23660046105bc565b90611037565b6101d8906102f8906001600160a01b031682565b6101d8906105f8565b6101d89061060c565b906101f290610615565b60006106386101d892600761061e565b610578565b346101b05761025a6105aa61065336600461053d565b610628565b90816101e09103126101b05790565b9190610260838203126101b05761067e81846101b5565b9261068c82602083016101b5565b926101d861069d846040850161030d565b9360806106ad826060870161030d565b9401610658565b346101b05761025a61024a6106ca366004610667565b93929092611491565b346101b0576104b96106e63660046105bc565b906114bc565b346101b0576106fc36600461025e565b6104b96114f9565b346101b05761071436600461025e565b6104b9611501565b610200818303126101b05761073182826101b5565b926101d861074284602085016101b5565b936101e0610753826040870161046d565b940161030d565b346101b0576104b961076d36600461071c565b92919091611908565b61022b906102f8565b6020810192916101c29190610776565b346101b05761079f36600461025e565b61025a6107aa611914565b6040519182918261077f565b346101b0576104b96107c93660046101c4565b611958565b346101b0576104b96107e136600461053d565b6119a3565b60006106386101d892600661061e565b346101b05761025a6105aa61080c36600461053d565b6107e6565b346101b05761082136600461025e565b61025a6107aa6119ac565b906020828203126101b0576101d8916104ed565b346101b0576104b961085336600461082c565b6119d0565b346101b0576104b961086b36600461053d565b611a38565b60006106386101d89260056101e8565b346101b05761025a6105aa6108963660046101c4565b610870565b91906040838203126101b0576101d89060206105d882866101b5565b346101b0576104b96108ca36600461089b565b90611a5d565b6101d8916008021c6102f8565b906101d891546108d0565b6101d86000806108dd565b346101b05761090336600461025e565b61025a6107aa6108e8565b6101d890611a67565b6101d8903690610339565b6101d89081565b6101d89054610922565b9061096b61094082610917565b6109666109626101d861095c6109578860046101e8565b610929565b93611a67565b9190565b141590565b610978576101c2916109b6565b60405163c4c3834b60e01b8152600490fd5b0390fd5b634e487b7160e01b600052601160045260246000fd5b919082018092116109b157565b61098e565b906109e16109c382610917565b6109db6101806109d561016084015190565b92015190565b906109a4565b42106109f0576101c291610aad565b6040516320fd4dff60e11b8152600490fd5b356101d881610323565b356101d881610304565b356101d8816101a7565b905051906101c2826104e5565b906020828203126101b0576101d891610a20565b9160206101c2929493610a5c60408201966000830190610776565b0152565b6040513d6000823e3d90fd5b9160001960089290920291821b911b5b9181191691161790565b9190610a956101d8610a9d9390565b908354610a6c565b9055565b6101c291600091610a86565b6020610b1c92610ac7610ac260c08301610a02565b610615565b610af1610ad660608401610a0c565b926109db610140610aea6101008401610a16565b9201610a16565b916000610afd60405190565b809781958294610b1163a9059cbb60e01b90565b845260048401610a41565b03925af1918215610ba857610b4b92610b7b575b50610b466000610b418360046101e8565b610aa1565b6101db565b7fc16ec4190afc7dd9e0b0c866bd421d7ea070f2395fcee05567614d63fac17940610b7560405190565b600090a2565b610b9c9060203d602011610ba1575b610b9481836102a6565b810190610a2d565b610b30565b503d610b8a565b610a60565b906101c291610933565b906101c29291610bc5611aa5565b9190610bea610bd383610917565b6109666109626101d861095c6109578760046101e8565b610978576101c29291908215610d1f5760c08201610c0a610ac282610a02565b9263a9059cbb936020610c1f60808401610a0c565b610c2c6101408501610a16565b92610b11600089610c4c610c3f60405190565b9788968795869460e01b90565b03925af18015610ba857602093610c6c92610ac292610d04575b50610a02565b610b116000610c8a610100610c8360608701610a0c565b9501610a16565b96610ca4610c9760405190565b9889968795869460e01b90565b03925af1908115610ba857610cd392610ccd92610b7b57505b610b466000610b418360046101e8565b91151590565b907f36d81b3901a7af2fb3e1c438bb2a725ba9b55ddf607a668abf262b0c41885679610cfe60405190565b600090a3565b610d1a90863d8811610ba157610b9481836102a6565b610c66565b602082610ac7610ac260c0610d349601610a02565b03925af1908115610ba857610cd392610ccd92610d52575b50610cbd565b610d6a9060203d602011610ba157610b9481836102a6565b610d4c565b906101c29291610bb7565b6101d89060401c610572565b6101d89054610d7a565b6101d8905b67ffffffffffffffff1690565b6101d89054610d90565b610d956101d86101d89290565b9067ffffffffffffffff90610a7c565b610d956101d86101d89267ffffffffffffffff1690565b90610df06101d8610a9d92610dc9565b8254610db9565b9060ff60401b9060401b610a7c565b90610e166101d8610a9d92151590565b8254610df7565b61022b90610dac565b6020810192916101c29190610e1d565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a009081610e72610e6c610e6883610d86565b1590565b91610da2565b90600092610e7f84610dac565b67ffffffffffffffff84161480610f7e575b600193610eae610ea086610dac565b9167ffffffffffffffff1690565b149081610f5a575b155b9081610f51575b50610f3f57610ee89082610edf86610ed687610dac565b98019788610de0565b610f3057610fc6565b610ef157505050565b610f1f610f2b927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d294610e06565b60405191829182610e26565b0390a1565b610f3a8487610e06565b610fc6565b60405163f92ee8a960e01b8152600490fd5b15905038610ebf565b9050610eb8610f6830610615565b3b610f75610962886101db565b14919050610eb6565b5081610e91565b9060001990610a7c565b90610f9f6101d8610a9d926101db565b8254610f85565b9060ff90610a7c565b90610fbf6101d8610a9d92151590565b8254610fa6565b610fd790610fd2611acb565b611b11565b610feb610fe460016101db565b6001610f8f565b611001610ffa621275006101db565b6002610f8f565b6101c260016003610faf565b6101c290610e36565b906101c291611023611aa5565b906110326101c292600661061e565b610faf565b906101c291611016565b6101d8905461031a565b949392919061106261105d6000611041565b6102f8565b61106b336102f8565b03611079576101d895611227565b604051632e60f98560e11b8152600490fd5b6101d890610572565b6101d8905461108b565b634e487b7160e01b600052602160045260246000fd5b600211156110be57565b61109e565b906101c2826110b4565b356101d8816102e1565b6101d86101a06102cd565b9061022b906110c3565b9061022b906102f8565b9061022b9061031a565b90610f9f6101d8610a9d9290565b60001981146109b15760010190565b6101d8906110c3565b61022b9061111d565b61022b90610615565b90610180806101c29361115360008201516000860190611126565b61116260208201516020860152565b61117160408201516040860152565b61118360608201516060860190610776565b61119560808201516080860190610776565b6111a760a082015160a086019061112f565b6111b960c082015160c086019061112f565b6111cb60e082015160e0860190610776565b6111dc610100820151610100860152565b6111ed610120820151610120860152565b6111fe610140820151610140860152565b61120f610160820151610160860152565b0151910152565b6101a0810192916101c29190611138565b50949392916112366003611094565b6113ed575b611247604085016110cd565b9360a081019361125960c08301610a02565b9460400161126690610a16565b9461010083019061127682610a02565b9160200161128390610a16565b93610160019261129284610a0c565b9360200161129f90610a16565b956112aa6002610929565b986112b36110d7565b9a6112be908c6110e2565b6112c98d60208d0152565b60408b01526112db9060608b016110ec565b6112e89060808a016110ec565b6112f59060a089016110f6565b6113029060c088016110f6565b61130f9060e087016110ec565b61010085015261012084015261014083015261132d42610160840152565b61018082015261133d6001610929565b6001810161134c906001610f8f565b9261135682611a67565b6113606001610929565b61136b9060046101e8565b9061137591611100565b6113809060056101e8565b600161138b91610faf565b6113956001610929565b61139e8161110e565b6113a9906001610f8f565b6113b2906101db565b906113bc60405190565b6113c7819282611216565b037fe84a4b534d3937a04b6b6bd66f19ac78b67ec1302dea22805fe7a316ab90b7b891a2565b604084016113fa816110cd565b61140d61140760016110c3565b916110c3565b148061147a575b61146857611421906110cd565b61142e61140760006110c3565b148061144c575b1561123b57604051637c5e0f3b60e01b8152600490fd5b50611463610e6861145e83600761061e565b611094565b611435565b604051630175613f60e51b8152600490fd5b5061148c610e6861145e86600661061e565b611414565b6101d89493929190600061104b565b906101c2916114ad611aa5565b906110326101c292600761061e565b906101c2916114a0565b6114ce611aa5565b6101c26114ec565b6102f86101d86101d89290565b6101d8906114d6565b6101c2610fd260006114e3565b6101c26114c6565b3361150a6119ac565b61151c611516836102f8565b916102f8565b0361152a576101c290611b11565b61098a9061153760405190565b63118cdaa760e01b81529182916004830161077f565b906101c293929161155c611aa5565b92919061158261156b83610917565b6109666109626101d861095c6109578a60046101e8565b610978576101c2936115d1565b604090610a5c6101c294969593966115af60608401986000850190610776565b6020830190610776565b6101d86127106101db565b919082039182116109b157565b90926000929190803b6115e6610962866101db565b146118f657610ac26115f791610615565b60a08301611628602061160c610ac284610a02565b6040519283918291906302f6229560e11b83526004830161077f565b0381865afa908115610ba8576000916118d7575b501561185957610ac261164e91610a02565b61165a60608501610a0c565b90823b156101b05761168e92869283899361167460405190565b96879586948593636361ddf360e11b85526004850161158f565b03925af18015610ba85761182d575b505b61010082016116ad81610a16565b80916101208501906116be82610a16565b6116ca610962896101db565b1161177f575b505050826020916116ff6116ec610ac260c061170a9801610a02565b916109db610140610c8360808701610a0c565b9186610afd60405190565b03925af18015610ba8576117379361173193610b4692611762575b50610b418360046101e8565b916101db565b907fa465a1fee99eb9fb08a22b000dcdbb13d227aea872015d53c785fa44f2350e9d610cfe60405190565b61177a9060203d602011610ba157610b9481836102a6565b611725565b6117f0959293506117af6020926117a161179b6117b694610a16565b91610a16565b6117a96115b9565b91611b53565b80946115c4565b926117c6610ac260c08501610a02565b6117d260e08501610a0c565b886117dc60405190565b809981958294610b1163a9059cbb60e01b90565b03925af1918215610ba85761170a94602093611812575b8295508193506116d0565b61182890843d8611610ba157610b9481836102a6565b611807565b61184c90843d8611611852575b61184481836102a6565b81019061025e565b3861169d565b503d61183a565b61186d9150610ac2610ac2610ac292610a02565b61187960608401610a0c565b90803b156101b0578585916118a6938361189260405190565b809681958294610b116340c10f1960e01b90565b03925af18015610ba8576118bb575b5061169f565b6118d190843d86116118525761184481836102a6565b386118b5565b6118f0915060203d602011610ba157610b9481836102a6565b3861163c565b604051632ba6469960e01b8152600490fd5b906101c293929161154d565b6101d860007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01611041565b6101c29061194d611aa5565b6101c2906002610f8f565b6101c290611941565b6101c29061196d611aa5565b611998565b906001600160a01b0390610a7c565b906119916101d8610a9d92610615565b8254611972565b6101c2906000611981565b6101c290611961565b6101d8600061193b611c6e565b6101c2906119c5611aa5565b6101c2906003610faf565b6101c2906119b9565b6101c2906119e5611aa5565b6119f98160006119f3611c6e565b01611981565b611a0d611a07610ac2611914565b91610615565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700610cfe60405190565b6101c2906119d9565b906101c291611a4e611aa5565b906110326101c29260056101e8565b906101c291611a41565b611a8f611a7360405190565b8092611a83602083019182611216565b908103825203826102a6565b611aa1611a9a825190565b9160200190565b2090565b611aad611914565b3390611abb611516836102f8565b0361152a5750565b6101c2611c92565b6101c2611ac3565b916001600160a01b0360089290920291821b911b610a7c565b9190611afd6101d8610a9d93610615565b908354611ad3565b6101c291600091611aec565b6101c290611b29600080611b23611c6e565b01611b05565b611cb5565b634e487b7160e01b600052601260045260246000fd5b8115611b4e570490565b611b2e565b90600092611b6082840290565b9260001983820984808210910303611b7860006101db565b8114611c5f5780831115611c4d5782611bd694611bc3936101d8985009808603951090036001611bb084611bac60006101db565b0390565b8416808095049604938060000304010290565b1791611bd6611bda82611bd660036101db565b0290565b611bac611731611c47611c38611c29611c1a611c0b600297611bfb896101db565b18611bd68b8202611bac8b6101db565b611bd68a8202611bac8a6101db565b611bd6898202611bac896101db565b611bd6888202611bac886101db565b611bd6878202611bac876101db565b80950290565b60405163227bc15360e01b8152600490fd5b50509190506101d89250611b44565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b611c9d610e68611d1a565b611ca357565b604051631afcd79f60e31b8152600490fd5b611cef611a077f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610ac284611ce983611041565b92611981565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0610cfe60405190565b6101d87ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610d8656fea2646970667358221220d7d030812d7fcf82e1c3a49d4f7da663093693bf6b8fa12f305932d6e0ea719364736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "EscrowLocked";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidAssetFactory";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidEscrow";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidInitialization";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "MathOverflowedMulDiv";
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
        readonly inputs: readonly [];
        readonly name: "SellerNotAskWhitelisted";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "SellerNotBidWhitelisted";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }];
        readonly name: "EscrowClaimed";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "placeholder";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "identifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "buyer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "seller";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "rebate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "lockTime";
                readonly type: "uint256";
            }];
            readonly indexed: false;
            readonly internalType: "struct Escrow";
            readonly name: "escrow";
            readonly type: "tuple";
        }];
        readonly name: "EscrowOpened";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly indexed: true;
            readonly internalType: "bool";
            readonly name: "rebateReturned";
            readonly type: "bool";
        }];
        readonly name: "EscrowRejected";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "EscrowSettled";
        readonly type: "event";
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
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "maker";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "bool";
            readonly name: "whitelisted";
            readonly type: "bool";
        }];
        readonly name: "SellerWhitelisted";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "__EscrowController_init";
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
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "placeholder";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "identifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "buyer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "seller";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "rebate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "lockTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Escrow";
            readonly name: "escrow";
            readonly type: "tuple";
        }];
        readonly name: "claimEscrow";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "escrowIndex";
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
        readonly name: "escrowedTokens";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "escrows";
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
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "placeholder";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "identifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "buyer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "seller";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "rebate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "lockTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Escrow";
            readonly name: "escrow";
            readonly type: "tuple";
        }];
        readonly name: "hashEscrow";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_hash";
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
        readonly name: "lockTime";
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
            readonly name: "placeholder";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "rebate";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "buyer";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "seller";
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
        readonly name: "openEscrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "escrowId";
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
            readonly internalType: "bool";
            readonly name: "returnRebate";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "placeholder";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "identifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "buyer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "seller";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "rebate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "lockTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Escrow";
            readonly name: "escrow";
            readonly type: "tuple";
        }];
        readonly name: "rejectEscrow";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "escrowed";
            readonly type: "bool";
        }];
        readonly name: "setEscrowedToken";
        readonly outputs: readonly [];
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
            readonly internalType: "uint256";
            readonly name: "time";
            readonly type: "uint256";
        }];
        readonly name: "setLockTime";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bool";
            readonly name: "_whitelistOnly";
            readonly type: "bool";
        }];
        readonly name: "setWhitelistOnly";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "escrowId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum Side";
                readonly name: "side";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "placeholder";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "identifier";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "buyer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "seller";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC721";
                readonly name: "collection";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "currency";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "fee";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "rebate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "timestamp";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "lockTime";
                readonly type: "uint256";
            }];
            readonly internalType: "struct Escrow";
            readonly name: "escrow";
            readonly type: "tuple";
        }, {
            readonly internalType: "address";
            readonly name: "assetFactory";
            readonly type: "address";
        }];
        readonly name: "settleEscrow";
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
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "whitelisted";
            readonly type: "bool";
        }];
        readonly name: "whitelistBidTaker";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "whitelistOnly";
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
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "whitelisted";
            readonly type: "bool";
        }];
        readonly name: "whitelistedAskMaker";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "whitelistedAskMakers";
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "whitelistedBidTakers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): EscrowControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): EscrowController;
}
export {};

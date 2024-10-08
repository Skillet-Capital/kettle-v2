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
    static readonly bytecode = "0x60806040523461001a57604051611d796100208239611d7990f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063012f52ee146101a25780630d6680871461019d5780631730b63914610198578063187de095146101935780632811e6bb1461018e578063347b7a52146101895780633b77664214610184578063490b48461461017f5780634b4687b51461017a57806353ae97391461017557806355d8525e146101705780636ba2700e1461016b578063715018a61461016657806379ba5097146101615780638b176b011461015c5780638da5cb5b14610157578063ae04d45d14610152578063b78403691461014d578063c22e54a114610148578063e30c397814610143578063ea05a8c61461013e578063f2fde38b14610139578063f4be779c14610134578063f8b963b11461012f5763fd91d7cd036101b0576108f3565b6108b7565b610880565b610858565b610840565b610811565b6107f6565b6107ce565b6107b6565b61078f565b61075a565b610704565b6106ec565b6106d3565b6106b8565b61065a565b61060a565b6105cc565b61059f565b610541565b6104ca565b6104a0565b610452565b610275565b61022f565b805b036101b057565b600080fd5b905035906101c2826101a7565b565b906020828203126101b0576101d8916101b5565b90565b6101d86101d86101d89290565b906101f2906101db565b600052602052604060002090565b6101d8916008021c81565b906101d89154610200565b60006102266101d89260046101e8565b61020b565b9052565b346101b05761025a61024a6102453660046101c4565b610216565b6040519182918290815260200190565b0390f35b60009103126101b057565b6101d86000600261020b565b346101b05761028536600461025e565b61025a61024a610269565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176102c857604052565b610290565b906101c26102da60405190565b92836102a6565b600211156101b057565b905035906101c2826102e1565b6001600160a01b031690565b6101a9816102f8565b905035906101c282610304565b6101d8906102f8565b6101a98161031a565b905035906101c282610323565b9190916101a0818403126101b0576104376103556101a06102cd565b9361036081846102eb565b855261036f81602085016101b5565b602086015261038181604085016101b5565b6040860152610393816060850161030d565b60608601526103a5816080850161030d565b60808601526103b78160a0850161032c565b60a08601526103c98160c0850161032c565b60c08601526103db8160e0850161030d565b60e08601526101006103ef828286016101b5565b90860152610120610402828286016101b5565b90860152610140610415828286016101b5565b90860152610160610428828286016101b5565b908601526101808093016101b5565b90830152565b906101a0828203126101b0576101d891610339565b346101b05761025a61024a61046836600461043d565b61090e565b90816101a09103126101b05790565b91906101c0838203126101b0576101d890602061049982866101b5565b940161046d565b346101b0576104b96104b336600461047c565b90610bad565b604051005b6101d86000600161020b565b346101b0576104da36600461025e565b61025a61024a6104be565b90816102409103126101b05790565b91906102c0838203126101b05761050b81846101b5565b9261051982602083016101b5565b926101d861052a846040850161030d565b93608061053a826060870161030d565b94016104e5565b346101b05761025a61024a6105573660046104f4565b9392909261104c565b8015156101a9565b905035906101c282610560565b90916101e0828403126101b0576101d861058f8484610568565b93604061049982602087016101b5565b346101b0576104b96105b2366004610575565b91611213565b906020828203126101b0576101d89161030d565b346101b0576104b96105df3660046105b8565b61146c565b6101d8916008021c5b60ff1690565b906101d891546105e4565b6101d8600060036105f3565b346101b05761061a36600461025e565b61025a6106256105fe565b60405191829182901515815260200190565b91906040838203126101b0576101d8906020610653828661030d565b9401610568565b346101b0576104b961066d366004610637565b90611496565b6101d8906102f8906001600160a01b031682565b6101d890610673565b6101d890610687565b906101f290610690565b60006106b36101d8926007610699565b6105f3565b346101b05761025a6106256106ce3660046105b8565b6106a3565b346101b0576104b96106e6366004610637565b906114bc565b346101b0576106fc36600461025e565b6104b96114f9565b346101b05761071436600461025e565b6104b9611501565b610200818303126101b05761073182826101b5565b926101d861074284602085016101b5565b936101e0610753826040870161046d565b940161030d565b346101b0576104b961076d36600461071c565b92919091611908565b61022b906102f8565b6020810192916101c29190610776565b346101b05761079f36600461025e565b61025a6107aa611914565b6040519182918261077f565b346101b0576104b96107c93660046101c4565b611958565b346101b0576104b96107e13660046105b8565b6119a3565b60006106b36101d8926006610699565b346101b05761025a61062561080c3660046105b8565b6107e6565b346101b05761082136600461025e565b61025a6107aa6119ac565b906020828203126101b0576101d891610568565b346101b0576104b961085336600461082c565b6119d0565b346101b0576104b961086b3660046105b8565b611a38565b60006106b36101d89260056101e8565b346101b05761025a6106256108963660046101c4565b610870565b91906040838203126101b0576101d890602061065382866101b5565b346101b0576104b96108ca36600461089b565b90611a5d565b6101d8916008021c6102f8565b906101d891546108d0565b6101d86000806108dd565b346101b05761090336600461025e565b61025a6107aa6108e8565b6101d890611a67565b6101d8903690610339565b6101d89081565b6101d89054610922565b9061096b61094082610917565b6109666109626101d861095c6109578860046101e8565b610929565b93611a67565b9190565b141590565b610978576101c2916109b6565b60405163c4c3834b60e01b8152600490fd5b0390fd5b634e487b7160e01b600052601160045260246000fd5b919082018092116109b157565b61098e565b906109e16109c382610917565b6109db6101806109d561016084015190565b92015190565b906109a4565b42106109f0576101c291610aad565b6040516320fd4dff60e11b8152600490fd5b356101d881610323565b356101d881610304565b356101d8816101a7565b905051906101c282610560565b906020828203126101b0576101d891610a20565b9160206101c2929493610a5c60408201966000830190610776565b0152565b6040513d6000823e3d90fd5b9160001960089290920291821b911b5b9181191691161790565b9190610a956101d8610a9d9390565b908354610a6c565b9055565b6101c291600091610a86565b6020610b1c92610ac7610ac260c08301610a02565b610690565b610af1610ad660608401610a0c565b926109db610140610aea6101008401610a16565b9201610a16565b916000610afd60405190565b809781958294610b1163a9059cbb60e01b90565b845260048401610a41565b03925af1918215610ba857610b4b92610b7b575b50610b466000610b418360046101e8565b610aa1565b6101db565b7fc16ec4190afc7dd9e0b0c866bd421d7ea070f2395fcee05567614d63fac17940610b7560405190565b600090a2565b610b9c9060203d602011610ba1575b610b9481836102a6565b810190610a2d565b610b30565b503d610b8a565b610a60565b906101c291610933565b6101d8905461031a565b9493929190610bd8610bd36000610bb7565b6102f8565b610be1336102f8565b03610bef576101d895610dde565b604051632e60f98560e11b8152600490fd5b6101d8906105ed565b6101d89054610c01565b634e487b7160e01b600052602160045260246000fd5b60021115610c3457565b610c14565b906101c282610c2a565b356101d8816102e1565b6101d86101a06102cd565b9061022b90610c39565b9061022b906102f8565b9061022b9061031a565b9060001990610a7c565b90610c906101d8610a9d926101db565b8254610c76565b90610c906101d8610a9d9290565b9060ff90610a7c565b90610cbe6101d8610a9d92151590565b8254610ca5565b60001981146109b15760010190565b6101d890610c39565b61022b90610cd4565b61022b90610690565b90610180806101c293610d0a60008201516000860190610cdd565b610d1960208201516020860152565b610d2860408201516040860152565b610d3a60608201516060860190610776565b610d4c60808201516080860190610776565b610d5e60a082015160a0860190610ce6565b610d7060c082015160c0860190610ce6565b610d8260e082015160e0860190610776565b610d93610100820151610100860152565b610da4610120820151610120860152565b610db5610140820151610140860152565b610dc6610160820151610160860152565b0151910152565b6101a0810192916101c29190610cef565b5094939291610ded6003610c0a565b610fa4575b610dfe60408501610c43565b9360a0810193610e1060c08301610a02565b94604001610e1d90610a16565b94610100830190610e2d82610a02565b91602001610e3a90610a16565b936101c00192610e4984610a0c565b93602001610e5690610a16565b95610e616002610929565b98610e6a610c4d565b9a610e75908c610c58565b610e808d60208d0152565b60408b0152610e929060608b01610c62565b610e9f9060808a01610c62565b610eac9060a08901610c6c565b610eb99060c08801610c6c565b610ec69060e08701610c62565b610100850152610120840152610140830152610ee442610160840152565b610180820152610ef46001610929565b60018101610f03906001610c80565b92610f0d82611a67565b610f176001610929565b610f229060046101e8565b90610f2c91610c97565b610f379060056101e8565b6001610f4291610cae565b610f4c6001610929565b610f5581610cc5565b610f60906001610c80565b610f69906101db565b90610f7360405190565b610f7e819282610dcd565b037fe84a4b534d3937a04b6b6bd66f19ac78b67ec1302dea22805fe7a316ab90b7b891a2565b60408401610fb181610c43565b610fc4610fbe6001610c39565b91610c39565b1480611035575b61102357610fd890610c43565b610fe5610fbe6000610c39565b1480611003575b15610df257604051637c5e0f3b60e01b8152600490fd5b5061101e61101a611015836007610699565b610c0a565b1590565b610fec565b604051630175613f60e51b8152600490fd5b5061104761101a611015866006610699565b610fcb565b6101d894939291906000610bc1565b906101c29291611069611aa5565b919061108e61107783610917565b6109666109626101d861095c6109578760046101e8565b610978576101c292919082156111c35760c082016110ae610ac282610a02565b9263a9059cbb9360206110c360808401610a0c565b6110d06101408501610a16565b92610b116000896110f06110e360405190565b9788968795869460e01b90565b03925af18015610ba85760209361111092610ac2926111a8575b50610a02565b610b11600061112e61010061112760608701610a0c565b9501610a16565b9661114861113b60405190565b9889968795869460e01b90565b03925af1908115610ba8576111779261117192610b7b57505b610b466000610b418360046101e8565b91151590565b907f36d81b3901a7af2fb3e1c438bb2a725ba9b55ddf607a668abf262b0c418856796111a260405190565b600090a3565b6111be90863d8811610ba157610b9481836102a6565b61110a565b602082610ac7610ac260c06111d89601610a02565b03925af1908115610ba85761117792611171926111f6575b50611161565b61120e9060203d602011610ba157610b9481836102a6565b6111f0565b906101c2929161105b565b6101d89060401c6105ed565b6101d8905461121e565b6101d8905b67ffffffffffffffff1690565b6101d89054611234565b6112396101d86101d89290565b9067ffffffffffffffff90610a7c565b6112396101d86101d89267ffffffffffffffff1690565b906112946101d8610a9d9261126d565b825461125d565b9060ff60401b9060401b610a7c565b906112ba6101d8610a9d92151590565b825461129b565b61022b90611250565b6020810192916101c291906112c1565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00908161131261130c61101a8361122a565b91611246565b9060009261131f84611250565b67ffffffffffffffff8416148061141e575b60019361134e61134086611250565b9167ffffffffffffffff1690565b1490816113fa575b155b90816113f1575b506113df57611388908261137f8661137687611250565b98019788611284565b6113d057611425565b61139157505050565b6113bf6113cb927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2946112aa565b604051918291826112ca565b0390a1565b6113da84876112aa565b611425565b60405163f92ee8a960e01b8152600490fd5b1590503861135f565b905061135861140830610690565b3b611415610962886101db565b14919050611356565b5081611331565b61143690611431611acb565b611b11565b61144a61144360016101db565b6001610c80565b611460611459621275006101db565b6002610c80565b6101c260016003610cae565b6101c2906112da565b906101c291611482611aa5565b906114916101c2926006610699565b610cae565b906101c291611475565b906101c2916114ad611aa5565b906114916101c2926007610699565b906101c2916114a0565b6114ce611aa5565b6101c26114ec565b6102f86101d86101d89290565b6101d8906114d6565b6101c261143160006114e3565b6101c26114c6565b3361150a6119ac565b61151c611516836102f8565b916102f8565b0361152a576101c290611b11565b61098a9061153760405190565b63118cdaa760e01b81529182916004830161077f565b906101c293929161155c611aa5565b92919061158261156b83610917565b6109666109626101d861095c6109578a60046101e8565b610978576101c2936115d1565b604090610a5c6101c294969593966115af60608401986000850190610776565b6020830190610776565b6101d86127106101db565b919082039182116109b157565b90926000929190803b6115e6610962866101db565b146118f657610ac26115f791610690565b60a08301611628602061160c610ac284610a02565b6040519283918291906302f6229560e11b83526004830161077f565b0381865afa908115610ba8576000916118d7575b501561185957610ac261164e91610a02565b61165a60608501610a0c565b90823b156101b05761168e92869283899361167460405190565b96879586948593636361ddf360e11b85526004850161158f565b03925af18015610ba85761182d575b505b61010082016116ad81610a16565b80916101208501906116be82610a16565b6116ca610962896101db565b1161177f575b505050826020916116ff6116ec610ac260c061170a9801610a02565b916109db61014061112760808701610a0c565b9186610afd60405190565b03925af18015610ba8576117379361173193610b4692611762575b50610b418360046101e8565b916101db565b907fa465a1fee99eb9fb08a22b000dcdbb13d227aea872015d53c785fa44f2350e9d6111a260405190565b61177a9060203d602011610ba157610b9481836102a6565b611725565b6117f0959293506117af6020926117a161179b6117b694610a16565b91610a16565b6117a96115b9565b91611b53565b80946115c4565b926117c6610ac260c08501610a02565b6117d260e08501610a0c565b886117dc60405190565b809981958294610b1163a9059cbb60e01b90565b03925af1918215610ba85761170a94602093611812575b8295508193506116d0565b61182890843d8611610ba157610b9481836102a6565b611807565b61184c90843d8611611852575b61184481836102a6565b81019061025e565b3861169d565b503d61183a565b61186d9150610ac2610ac2610ac292610a02565b61187960608401610a0c565b90803b156101b0578585916118a6938361189260405190565b809681958294610b116340c10f1960e01b90565b03925af18015610ba8576118bb575b5061169f565b6118d190843d86116118525761184481836102a6565b386118b5565b6118f0915060203d602011610ba157610b9481836102a6565b3861163c565b604051632ba6469960e01b8152600490fd5b906101c293929161154d565b6101d860007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610bb7565b6101c29061194d611aa5565b6101c2906002610c80565b6101c290611941565b6101c29061196d611aa5565b611998565b906001600160a01b0390610a7c565b906119916101d8610a9d92610690565b8254611972565b6101c2906000611981565b6101c290611961565b6101d8600061193b611c6e565b6101c2906119c5611aa5565b6101c2906003610cae565b6101c2906119b9565b6101c2906119e5611aa5565b6119f98160006119f3611c6e565b01611981565b611a0d611a07610ac2611914565b91610690565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227006111a260405190565b6101c2906119d9565b906101c291611a4e611aa5565b906114916101c29260056101e8565b906101c291611a41565b611a8f611a7360405190565b8092611a83602083019182610dcd565b908103825203826102a6565b611aa1611a9a825190565b9160200190565b2090565b611aad611914565b3390611abb611516836102f8565b0361152a5750565b6101c2611c92565b6101c2611ac3565b916001600160a01b0360089290920291821b911b610a7c565b9190611afd6101d8610a9d93610690565b908354611ad3565b6101c291600091611aec565b6101c290611b29600080611b23611c6e565b01611b05565b611cb5565b634e487b7160e01b600052601260045260246000fd5b8115611b4e570490565b611b2e565b90600092611b6082840290565b9260001983820984808210910303611b7860006101db565b8114611c5f5780831115611c4d5782611bd694611bc3936101d8985009808603951090036001611bb084611bac60006101db565b0390565b8416808095049604938060000304010290565b1791611bd6611bda82611bd660036101db565b0290565b611bac611731611c47611c38611c29611c1a611c0b600297611bfb896101db565b18611bd68b8202611bac8b6101db565b611bd68a8202611bac8a6101db565b611bd6898202611bac896101db565b611bd6888202611bac886101db565b611bd6878202611bac876101db565b80950290565b60405163227bc15360e01b8152600490fd5b50509190506101d89250611b44565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b611c9d61101a611d1a565b611ca357565b604051631afcd79f60e31b8152600490fd5b611cef611a077f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610ac284611ce983610bb7565b92611981565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06111a260405190565b6101d87ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061122a56fea2646970667358221220c06f8c1ed3e5efdfa5904d8b3c269e8219a6df1759a527722437c039d793300864736f6c63430008180033";
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

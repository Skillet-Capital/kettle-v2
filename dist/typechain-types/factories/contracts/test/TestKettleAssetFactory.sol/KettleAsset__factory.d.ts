import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type { KettleAsset, KettleAssetInterface } from "../../../../contracts/test/TestKettleAssetFactory.sol/KettleAsset";
type KettleAssetConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class KettleAsset__factory extends ContractFactory {
    constructor(...args: KettleAssetConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<KettleAsset & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): KettleAsset__factory;
    static readonly bytecode = "0x60806040523461001a57604051612032610020823961203290f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806301ffc9a7146101b257806306fdde03146101ad578063081812fc146101a8578063095ea7b3146101a35780630ad9d0521461019e57806321a78f681461019957806323b872dd146101945780632d9fff011461018f57806340c10f191461018a57806342842e0e1461018557806342966c681461018057806346d75c8c1461017b5780636352211e1461017657806370a0823114610171578063715018a61461016c5780638da5cb5b1461016757806395d89b4114610162578063a22cb4651461015d578063b88d4fde14610158578063c1fd413714610153578063c45a01551461014e578063c4d66de814610149578063c73e835c14610144578063c87b56dd1461013f578063e985e9c51461013a5763f2fde38b036101ca57610944565b610928565b6108ea565b6108d2565b6108ba565b610893565b610812565b6107f6565b61078e565b61073b565b610720565b610708565b6106dd565b6106ae565b610696565b6105d3565b6105ba565b6105a1565b610586565b610561565b61051d565b6104f6565b610375565b610315565b6102a2565b6101f9565b6001600160e01b031981165b036101ca57565b600080fd5b905035906101dc826101b7565b565b906020828203126101ca576101f2916101cf565b90565b9052565b346101ca5761022761021461020f3660046101de565b61095c565b6040515b91829182901515815260200190565b0390f35b60009103126101ca57565b60005b8381106102495750506000910152565b8181015183820152602001610239565b61027a61028360209361028d9361026e815190565b80835293849260200190565b95869101610236565b601f01601f191690565b0190565b60208082526101f292910190610259565b346101ca576102b236600461022b565b6102276102bd6109b0565b60405191829182610291565b806101c3565b905035906101dc826102c9565b906020828203126101ca576101f2916102cf565b6001600160a01b031690565b6101f5906102f0565b6020810192916101dc91906102fc565b346101ca5761022761033061032b3660046102dc565b6109c3565b60405191829182610305565b6101c3816102f0565b905035906101dc8261033c565b91906040838203126101ca576101f290602061036e8286610345565b94016102cf565b346101ca5761038e610388366004610352565b906109d6565b604051005b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b90600160028304921680156103df575b60208310146103da57565b6103a9565b91607f16916103cf565b805460009392916104066103fc836103bf565b8085529360200190565b9160018116908115610458575060011461041f57505050565b6104329192939450600052602060002090565b916000925b8184106104445750500190565b805484840152602090930192600101610437565b92949550505060ff1916825215156020020190565b906101f2916103e9565b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176104ae57604052565b610477565b906101dc6104cd926104c460405190565b9384809261046d565b038361048d565b906000106104e5576101f2906104b3565b610393565b6101f2600060026104d4565b346101ca5761050636600461022b565b6102276102bd6104ea565b6101f2600060036104d4565b346101ca5761052d36600461022b565b6102276102bd610511565b90916060828403126101ca576101f26105518484610345565b93604061036e8260208701610345565b346101ca5761038e610574366004610538565b91610b4b565b6101f2600060016104d4565b346101ca5761059636600461022b565b6102276102bd61057a565b346101ca5761038e6105b4366004610352565b90610e1a565b346101ca5761038e6105cd366004610538565b91610e48565b346101ca5761038e6105e63660046102dc565b610eb4565b906101dc6105f860405190565b928361048d565b6001600160401b0381116104ae57602090601f01601f19160190565b90826000939282370152565b9092919261063c610637826105ff565b6105eb565b93818552818301116101ca576101dc91602085019061061b565b9080601f830112156101ca578160206101f293359101610627565b906020828203126101ca5781356001600160401b0381116101ca576101f29201610656565b346101ca5761038e6106a9366004610671565b6110a9565b346101ca576102276103306106c43660046102dc565b6110b2565b906020828203126101ca576101f291610345565b346101ca576102276106f86106f33660046106c9565b6110fa565b6040519182918290815260200190565b346101ca5761071836600461022b565b61038e611179565b346101ca5761073036600461022b565b610227610330611181565b346101ca5761074b36600461022b565b6102276102bd6111aa565b8015156101c3565b905035906101dc82610756565b91906040838203126101ca576101f29060206107878286610345565b940161075e565b346101ca5761038e6107a136600461076b565b906111b7565b906080828203126101ca576107bc8183610345565b926107ca8260208501610345565b926107d883604083016102cf565b9260608201356001600160401b0381116101ca576101f29201610656565b346101ca5761038e6108093660046107a7565b929190916111c2565b346101ca5761038e610825366004610671565b6111f0565b6101f2916008021c6001600160a01b031690565b906101f2915461082a565b6101f260008061083e565b6101f2906102f0906001600160a01b031682565b6101f290610854565b6101f290610868565b6101f590610871565b6020810192916101dc919061087a565b346101ca576108a336600461022b565b6102276108ae610849565b60405191829182610883565b346101ca5761038e6108cd3660046106c9565b61149f565b346101ca5761038e6108e5366004610671565b6114bf565b346101ca576102276102bd6109003660046102dc565b611531565b91906040838203126101ca576101f29060206109218286610345565b9401610345565b346101ca5761022761021461093e366004610905565b906115bd565b346101ca5761038e6109573660046106c9565b611645565b6380ac58cd60e01b6001600160e01b031982161490811561098c575b8115610982575090565b6101f2915061164e565b6001600160e01b03198116635b5e139f60e01b149150610978565b6101f2906104b3565b6101f260006109bd61166c565b016109a7565b6101f2906109d081611690565b506116ea565b6101dc91339161170f565b6101f2906102f0565b6101f290546109e1565b905051906101dc82610756565b906020828203126101ca576101f2916109f4565b6040513d6000823e3d90fd5b15610a2857565b60405162461bcd60e51b815260206004820152600f60248201526e10d3d395149050d517d313d0d2d151608a1b6044820152606490fd5b0390fd5b9160206101dc929493610a7e604082019660008301906102fc565b0152565b15610a8957565b60405162461bcd60e51b815260206004820152600c60248201526b1513d2d15397d313d0d2d15160a21b6044820152606490fd5b610a7e6101dc94610ae9606094989795610adf608086019a60008701906102fc565b60208501906102fc565b60408301906102fc565b15610afa57565b60405162461bcd60e51b815260206004820152602360248201527f4e4f545f415554484f52495a45445f4f50455241544f525f4f525f5452414e536044820152622322a960e91b6064820152608490fd5b90610b5e610b5960006109ea565b610871565b91610b6830610871565b926020610b7460405190565b918290633507505d60e21b82528180610b908960048301610305565b03915afa908115610d2757610bb491610baf91600091610de657501590565b610a21565b610bc1610b5960006109ea565b6020610bcc60405190565b9182906329b8cdb760e11b82528180610be98a8a60048401610a63565b03915afa908115610d2757610c0d91610c0891600091610de657501590565b610a82565b610c1a610b5960006109ea565b6020610c2560405190565b91829063027cf93b60e31b82528180610c413360048301610305565b03915afa908115610d2757600091610dc7575b508015610d42575b610c6590610af3565b610c7084838361174a565b610c7d610b5960006109ea565b803b156101ca576000610c8f60405190565b91829063913874b760e01b8252818381610caf8b8a8a8d60048601610abd565b03925af18015610d2757610d2c575b50610ccc610b5960006109ea565b90813b156101ca5760008094610cfe610ce460405190565b978896879586946303ef802b60e11b865260048601610abd565b03925af18015610d2757610d0f5750565b6101dc906000610d1f818361048d565b81019061022b565b610a15565b610d3c906000610d1f818361048d565b38610cbe565b50610d50610b5960006109ea565b6020610d5b60405190565b918290633160ff3b60e21b82528180610d7a8a89898c60048601610abd565b03915afa8015610d2757610c6591600091610d98575b509050610c5c565b610dba915060203d602011610dc0575b610db2818361048d565b810190610a01565b38610d90565b503d610da8565b610de0915060203d602011610dc057610db2818361048d565b38610c54565b610dff915060203d602011610dc057610db2818361048d565b1590565b906101dc91610e106117db565b906101dc91611822565b906101dc91610e03565b90610e31610637836105ff565b918252565b6101f26000610e24565b6101f2610e36565b90916101dc92610e56610e40565b926111c2565b15610e6357565b60405162461bcd60e51b8152602060048201526024808201527f4b6574746c6541737365743a2063616c6c6572206973206e6f7420746865206f6044820152633bb732b960e11b6064820152608490fd5b6101dc90610edb610ecc610ec7836110b2565b6102f0565b610ed5336102f0565b14610e5c565b611834565b6101dc90610eec6117db565b61109e565b9160001960089290920291821b911b5b9181191691161790565b6101f26101f26101f29290565b9190610f296101f2610f3193610f0b565b908354610ef1565b9055565b6101dc91600091610f18565b818110610f4c575050565b80610f5a6000600193610f35565b01610f41565b9190601f8111610f6f57505050565b610f816101dc93600052602060002090565b906020601f840181900483019310610fa3575b6020601f909101040190610f41565b9091508190610f94565b9060001960089091021c191690565b81610fc691610fad565b906002021790565b90610fd7815190565b906001600160401b0382116104ae57610ffa82610ff485546103bf565b85610f60565b602090601f831160011461102857610f3192916000918361101d575b5050610fbc565b015190503880611016565b601f1983169161103d85600052602060002090565b9260005b81811061107c57509160029391856001969410611062575b50505002019055565b611072910151601f841690610fad565b9055388080611059565b91936020600181928787015181550195019201611041565b906101dc91610fce565b6101dc906002611094565b6101dc90610ee0565b6101f290611690565b6102f06101f26101f29290565b6101f2906110bb565b906110db90610871565b600052602052604060002090565b6101f29081565b6101f290546110e9565b61110261166c565b61110c60006110c8565b611115816102f0565b61111e846102f0565b1461113957506101f291600361113492016110d1565b6110f0565b610a5f9061114660405190565b6322718ad960e21b815291829160048301610305565b6111646117db565b6101dc6101dc61117460006110c8565b61185d565b6101dc61115c565b6101f27f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993006109ea565b6101f260016109bd61166c565b6101dc9190336118f0565b906101dc9392916111d4838383610b4b565b6119ff565b6101dc906111e56117db565b6101dc906001611094565b6101dc906111d9565b6101f29060401c5b60ff1690565b6101f290546111f9565b6101f2905b6001600160401b031690565b6101f29054611211565b6112166101f26101f29290565b906001600160401b0390610f01565b6112166101f26101f2926001600160401b031690565b9061126e6101f2610f3192611248565b8254611239565b9060ff60401b9060401b610f01565b906112946101f2610f3192151590565b8254611275565b6101f59061122c565b6020810192916101dc919061129b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0090816112ec6112e6610dff83611207565b91611222565b906000926112f98461122c565b6001600160401b03841614806113fa575b6001936113266113198661122c565b916001600160401b031690565b1490816113d2575b155b90816113c9575b506113b75761136090826113578661134e8761122c565b9801978861125e565b6113a85761146f565b61136957505050565b6113976113a3927fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d294611284565b604051918291826112a4565b0390a1565b6113b28487611284565b61146f565b60405163f92ee8a960e01b8152600490fd5b15905038611337565b90506113306113e030610871565b3b6113f16113ed88610f0b565b9190565b1491905061132e565b508161130a565b61140b6006610e24565b654b6574746c6560d01b602082015290565b6101f2611401565b61142f6006610e24565b654b4554544c4560d01b602082015290565b6101f2611425565b906001600160a01b0390610f01565b906114686101f2610f3192610871565b8254611449565b6114986101dc9161148f61148161141d565b611489611441565b90611b13565b610b5981611b32565b6000611458565b6101dc906112b4565b6101dc906114b46117db565b6101dc906003611094565b6101dc906114a8565b909291926114d8610637826105ff565b93818552818301116101ca576101dc916020850190610236565b9080601f830112156101ca5781516101f2926020016114c8565b906020828203126101ca5781516001600160401b0381116101ca576101f292016114f2565b60006115779161153f606090565b5061154c610b59836109ea565b61155530610871565b60405180958194829361156c63e9dc637560e01b90565b845260048401610a63565b03915afa908115610d275760009161158d575090565b6101f291503d806000833e6115a2818361048d565b81019061150c565b6101f290611201565b6101f290546115aa565b6101f2916115e16115e6926115d0600090565b5060056115db61166c565b016110d1565b6110d1565b6115b3565b6101dc906115f76117db565b61160160006110c8565b61160a816102f0565b611613836102f0565b1461162257506101dc9061185d565b610a5f9061162f60405190565b631e4fbdf760e01b815291829160048301610305565b6101dc906115eb565b6116686301ffc9a760e01b5b916001600160e01b03191690565b1490565b7f80bb2b638cc20bc4d0a60d66940f3ab4a00c1d7b313497ca82fb0b4ab007930090565b61169981611b3b565b906116a7610ec760006110c8565b6116b0836102f0565b146116b9575090565b610a5f906116c660405190565b637e27328960e01b81529182916004830190815260200190565b906110db90610f0b565b61170a6101f2916116f9600090565b50600461170461166c565b016116e0565b6109ea565b916001916101dc93611b55565b6040906117436101dc949695939661173c606084019860008501906102fc565b6020830152565b01906102fc565b9061175560006110c8565b61175e816102f0565b611767836102f0565b146117b8575061177990833391611cb6565b611782826102f0565b61178b826102f0565b0361179557505050565b610a5f906117a260405190565b6364283d7b60e01b81529384936004850161171c565b610a5f906117c560405190565b633250574960e11b815291829160048301610305565b6117e3611181565b33906117f76117f1836102f0565b916102f0565b036117ff5750565b610a5f9061180c60405190565b63118cdaa760e01b815291829160048301610305565b6101dc9161182e610e40565b91611df9565b61183e60006110c8565b6118556117f161184f838581611cb6565b926102f0565b146116b95750565b61189d6118977f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300610b5984611891836109ea565b92611458565b91610871565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06118c860405190565b80805b0390a3565b9060ff90610f01565b906118e96101f2610f3192151590565b82546118d0565b6118f861166c565b611905610ec760006110c8565b61190e846102f0565b146119685761195e61195883610b5987611953886115e17f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c319960056118cb9a016110d1565b6118d9565b93610871565b9361021860405190565b610a5f8361197560405190565b630b61174360e31b815291829160048301610305565b905051906101dc826101b7565b906020828203126101ca576101f29161198b565b90926119d3906119cc6101f29694610adf608086019760008701906102fc565b6040830152565b6060818403910152610259565b3d156119fa576119ef3d610e24565b903d6000602084013e565b606090565b909291833b611a116113ed6000610f0b565b11611a1d575b50505050565b602091611a2c610b5986610871565b90600033611a56611a3c60405190565b97889687958694630a85bd0160e11b8652600486016119ac565b03925af160009181611acb575b50611ab05750611a77565b38808080611a17565b611a7f6119e0565b90611a88825190565b611a956113ed6000610f0b565b03611aa757610a5f906117c560405190565b50805190602001fd5b611ac0630a85bd0160e11b61165a565b036117b85750611a6e565b611aee91925060203d602011611af5575b611ae6818361048d565b810190611998565b9038611a63565b503d611adc565b906101dc91611b09611e13565b906101dc91611e62565b906101dc91611afc565b6101dc90611b29611e13565b6101dc90611e78565b6101dc90611b1d565b61170a6101f291611b4a600090565b50600261170461166c565b929091611b6061166c565b91808115611c77575b611b86575b50506101dc92916004611b8192016116e0565b611458565b611b8f84611690565b91611b9d610ec760006110c8565b611ba6826102f0565b141580611c5d575b80611c4a575b611c275750611b81926101dc959492600492611bd7575b50925081939450611b6e565b611be090610871565b611be986610871565b611bf285610f0b565b917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925611c1d60405190565b600090a438611bcb565b610a5f90611c3460405190565b63a9fbf51f60e01b815291829160048301610305565b50611c58610dff82856115bd565b611bb4565b50611c67816102f0565b611c70846102f0565b1415611bae565b50611c85610ec760006110c8565b611c8e836102f0565b1415611b69565b9060001990610f01565b90611caf6101f2610f3192610f0b565b8254611c95565b90611d3182611b81836002611cc961166c565b611d1d611cd584611b3b565b9960008b86611ce3836110c8565b93611ced856102f0565b611cf6826102f0565b03611de8575b505050611d08826102f0565b611d118d6102f0565b03611daa575b506102f0565b611d26866102f0565b03611d7857016116e0565b611d46611d4061195885610871565b91610f0b565b917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef611d7160405190565b600090a490565b611da5611d856001610f0b565b611d9f611d9588600386016110d1565b9161028d836110f0565b90611c9f565b611704565b611db690828781611b55565b611de28b611d9f611dd4611dca6001610f0b565b92600388016110d1565b91611dde836110f0565b0390565b38611d17565b611df192611e81565b8b8638611cfc565b906101dc9291611e098282611edc565b6111d460006110c8565b611e1e610dff611f4e565b611e2457565b604051631afcd79f60e31b8152600490fd5b906101dc91611e43611e13565b9060016101dc92611e5c611e5561166c565b9182611094565b01611094565b906101dc91611e36565b6101dc906115f7611e13565b6101dc90611e6c565b611e8f610dff848484611f77565b611e9857505050565b611ea86117f1610ec760006110c8565b03611eba57610a5f826116c660405190565b610a5f611ec660405190565b63177e802f60e01b815292839260048401610a63565b90611ee760006110c8565b91611ef1836102f0565b611efa826102f0565b14611f4157611f0a918391611cb6565b611f166117f1836102f0565b03611f1e5750565b610a5f90611f2b60405190565b6339e3563760e11b815291829160048301610305565b610a5f836117c560405190565b6101f27ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00611207565b90611f85610ec760006110c8565b611f8e826102f0565b14159283611f9d575b50505090565b90919250611faa826102f0565b611fb3846102f0565b14928315611fe8575b508215611fce575b5050388080611f97565b611fe091925061184f6117f1916116ea565b143880611fc4565b611ff591935082906115bd565b9138611fbc56fea26469706673582212204748162d601468a3c7402c2c53dc7219910afe0e8be4c894cb7ff7769b29027464736f6c63430008180033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "ERC721IncorrectOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ERC721InsufficientApproval";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "approver";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidApprover";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidOperator";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidOwner";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidReceiver";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "ERC721InvalidSender";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ERC721NonexistentToken";
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
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "approved";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
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
        readonly name: "OwnershipTransferred";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
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
        readonly inputs: readonly [];
        readonly name: "brand";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "burn";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "contract KettleAssetFactory";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
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
            readonly name: "factoryAddress";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "operator";
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
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "mint";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "model";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
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
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "ref";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
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
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
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
            readonly name: "tokenId";
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
            readonly internalType: "string";
            readonly name: "_brand";
            readonly type: "string";
        }];
        readonly name: "setBrand";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_model";
            readonly type: "string";
        }];
        readonly name: "setModel";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_ref";
            readonly type: "string";
        }];
        readonly name: "setRef";
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
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
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
    static createInterface(): KettleAssetInterface;
    static connect(address: string, runner?: ContractRunner | null): KettleAsset;
}
export {};

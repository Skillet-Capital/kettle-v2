"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferConduit__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "target",
                type: "address",
            },
        ],
        name: "AddressEmptyCode",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "AddressInsufficientBalance",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "channel",
                type: "address",
            },
        ],
        name: "ChannelIsNotOpen",
        type: "error",
    },
    {
        inputs: [],
        name: "FailedInnerCall",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "SafeERC20FailedOperation",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferStarted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "acceptOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "channel",
                type: "address",
            },
        ],
        name: "channelOpen",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pendingOwner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IERC20",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "transferERC20From",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IERC721",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "transferERC721From",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "channel",
                type: "address",
            },
            {
                internalType: "bool",
                name: "open",
                type: "bool",
            },
        ],
        name: "updateChannel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x6080604052346200002657620000146200002b565b604051610a53620002248239610a5390f35b600080fd5b620000363362000038565b565b62000036906200008e565b6200005662000053620000539290565b90565b6001600160a01b031690565b620000539062000043565b620000789062000056565b9052565b6020810192916200003691906200006d565b6200009a600062000062565b620000a58162000056565b620000b08362000056565b14620000c25750620000369062000167565b620000e890620000d160405190565b631e4fbdf760e01b8152918291600483016200007c565b0390fd5b916001600160a01b0360089290920291821b911b5b9181191691161790565b620000539062000056906001600160a01b031682565b62000053906200010b565b620000539062000121565b91906200014c6200005362000155936200012c565b908354620000ec565b9055565b620000369160009162000137565b62000036906200017a6000600162000159565b620001c3565b620000539062000056565b62000053905462000180565b906001600160a01b039062000101565b90620001bb6200005362000155926200012c565b825462000197565b620001f1620001ea620001d760006200018b565b620001e4846000620001a7565b6200012c565b916200012c565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06200021d60405190565b600090a356fe6080604052600436101561001257600080fd5b60003560e01c806307940ee7146100a2578063715018a61461009d57806379ba5097146100985780638da5cb5b14610093578063c2dc04911461008e578063c4e8fcb514610089578063e30c397814610084578063e8023c371461007f5763f2fde38b036100cf576102b5565b610299565b61027e565b610265565b610200565b6101c5565b610190565b610178565b610148565b6001600160a01b031690565b90565b6100b3906100a7565b6100c8816100b6565b036100cf57565b600080fd5b905035906100e1826100bf565b565b6100c8816100a7565b905035906100e1826100e3565b806100c8565b905035906100e1826100f9565b6080818303126100cf5761012082826100d4565b926100b361013184602085016100ec565b93606061014182604087016100ec565b94016100ff565b346100cf5761016461015b36600461010c565b92919091610410565b604051005b0390f35b60009103126100cf57565b346100cf5761018836600461016d565b610164610454565b346100cf576101a036600461016d565b61016461045c565b6101b1906100a7565b9052565b6020810192916100e191906101a8565b346100cf576101d536600461016d565b6101696101e06104b2565b604051918291826101b5565b906020828203126100cf576100b3916100ec565b346100cf5761016961021b6102163660046101ec565b6104bc565b60405191829182901515815260200190565b8015156100c8565b905035906100e18261022d565b91906040838203126100cf576100b390602061025e82866100ec565b9401610235565b346100cf57610164610278366004610242565b90610523565b346100cf5761028e36600461016d565b6101696101e061052d565b346100cf576101646102ac36600461010c565b92919091610653565b346100cf576101646102c83660046101ec565b6106eb565b6100b3906100a7906001600160a01b031682565b6100b3906102cd565b6100b3906102e1565b906102fd906102ea565b600052602052604060002090565b92919061032a61032661031f3360026102f3565b5460ff1690565b1590565b610337576100e1936103b8565b60405162d7a92960e61b81528061035133600483016101b5565b0390fd5b1561035c57565b60405162461bcd60e51b815260206004820152602160248201527f5472616e73666572436f6e647569743a206368616e6e656c206e6f74206f70656044820152603760f91b6064820152608490fd5b6100b36100b36100b39290565b9291906103d16103cc61031f3360026102f3565b610355565b6103da826100a7565b6103e3826100a7565b1480156103fe575b6103f8576100e19361071a565b50505050565b5061040960006103ab565b83146103eb565b906100e193929161030b565b610424610764565b6100e1610442565b6100a76100b36100b39290565b6100b39061042c565b6100e161044f6000610439565b6107c0565b6100e161041c565b3361046561052d565b610477610471836100a7565b916100a7565b03610485576100e1906107c0565b6103519061049260405190565b63118cdaa760e01b8152918291600483016101b5565b6100b390546100b6565b6100b360006104a8565b61031f6100b3916104cb600090565b5060026102f3565b906100e1916104e0610764565b61050f565b9060ff905b9181191691161790565b906105046100b361050b92151590565b82546104e5565b9055565b9061051e6100e19260026102f3565b6104f4565b906100e1916104d3565b6100b360016104a8565b92919061054b61032661031f3360026102f3565b610337576100e1936105cf565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761059057604052565b610558565b6040906105bf6100e194969593966105b5606084019860008501906101a8565b60208301906101a8565b0152565b6040513d6000823e3d90fd5b929091926105dc846100a7565b6105e5846100a7565b146103f8576105f3906102ea565b803b156100cf57610625936000809461060b60405190565b96879586948593632142170760e11b855260048501610595565b03925af1801561064e576106365750565b6100e1906000610646818361056e565b81019061016d565b6105c3565b906100e1939291610537565b6100e19061066b610764565b610696565b906001600160a01b03906104ea565b9061068f6100b361050b926102ea565b8254610670565b6106a181600161067f565b6106ba6106b46106af6104b2565b6102ea565b916102ea565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e227006106e560405190565b600090a3565b6100e19061065f565b61070d6107076100b39263ffffffff1690565b60e01b90565b6001600160e01b03191690565b9061075f906107506100e1956004956107366323b872dd6106f4565b9361074060405190565b9788956020870190815201610595565b6020820181038252038361056e565b6107f6565b61076c6104b2565b339061077a610471836100a7565b036104855750565b916001600160a01b0360089290920291821b911b6104ea565b91906107ac6100b361050b936102ea565b908354610782565b6100e19160009161079b565b6100e1906107d0600060016107b4565b610874565b905051906100e18261022d565b906020828203126100cf576100b3916107d5565b610802610809916102ea565b91826108ba565b805161081c61081860006103ab565b9190565b14159081610850575b5061082d5750565b6103519061083a60405190565b635274afe760e01b8152918291600483016101b5565b61086e9150806020610863610326935190565b8183010191016107e2565b38610825565b61088f6106b461088460006104a8565b6106af84600061067f565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e06106e560405190565b6100b3916108c860006103ab565b91610935565b906100e16108db60405190565b928361056e565b67ffffffffffffffff811161059057602090601f01601f19160190565b9061091161090c836108e2565b6108ce565b918252565b3d15610930576109253d6108ff565b903d6000602084013e565b606090565b9161093f306102ea565b818131106109695750600082819260206100b3969551920190855af1610963610916565b9161098c565b6103519061097660405190565b63cd78605960e01b8152918291600483016101b5565b9061099757506109ee565b81516109a661081860006103ab565b14806109d8575b6109b5575090565b610351906109c260405190565b639996b31560e01b8152918291600483016101b5565b50803b6109e861081860006103ab565b146109ad565b80516109fd61081860006103ab565b1115610a0b57805190602001fd5b604051630a12f52160e11b8152600490fdfea2646970667358221220b6db73f2c1fbeb7179b0a91314d99ccf3b589e99b334f7528cc72c22134d0a4164736f6c63430008180033";
const isSuperArgs = (xs) => xs.length > 1;
class TransferConduit__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.TransferConduit__factory = TransferConduit__factory;
TransferConduit__factory.bytecode = _bytecode;
TransferConduit__factory.abi = _abi;
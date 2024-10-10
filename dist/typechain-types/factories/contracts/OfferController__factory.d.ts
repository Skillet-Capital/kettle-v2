import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { OfferController, OfferControllerInterface } from "../../contracts/OfferController";
type OfferControllerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class OfferController__factory extends ContractFactory {
    constructor(...args: OfferControllerConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<OfferController & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): OfferController__factory;
    static readonly bytecode = "0x60806040523461001a57604051610e606100208239610e6090f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063017d0ae0146100e257806308a8e4a3146100dd578063406eedd6146100d85780634ae25a86146100d3578063627cdcb9146100ce578063715018a6146100c957806379ba5097146100c45780637ecebe00146100bf5780637f99d691146100ba5780638da5cb5b146100b5578063cee72578146100b0578063e30c3978146100ab5763f2fde38b0361010857610465565b61044a565b61042f565b6103d6565b6103bb565b61037c565b610340565b610328565b610310565b6102ec565b6102a8565b610223565b6101df565b6001600160a01b031690565b90565b6001600160a01b0381165b0361010857565b600080fd5b9050359061011a826100f6565b565b80610101565b9050359061011a8261011c565b9190604083820312610108576100f390602061014b828661010d565b9401610122565b6100f3906100e7906001600160a01b031682565b6100f390610152565b6100f390610166565b906101829061016f565b600052602052604060002090565b6100f36100f36100f39290565b9061018290610190565b6100f3916008021c81565b906100f391546101a7565b6101d66100f3926101d1600093603a610178565b61019d565b6101b2565b9052565b346101085761020b6101fb6101f536600461012f565b906101bd565b6040519182918290815260200190565b0390f35b90602082820312610108576100f391610122565b346101085761020b6101fb61023936600461020f565b610494565b909182601f830112156101085781359167ffffffffffffffff831161010857602001926020830284011161010857565b91909160408184031261010857610285838261010d565b92602082013567ffffffffffffffff8111610108576102a4920161023e565b9091565b34610108576102c16102bb36600461026e565b91610541565b604051005b9060208282031261010857813567ffffffffffffffff8111610108576102a4920161023e565b34610108576102c16102ff3660046102c6565b9061054c565b600091031261010857565b3461010857610320366004610305565b6102c161058a565b3461010857610338366004610305565b6102c16105cb565b3461010857610350366004610305565b6102c16105d3565b90602082820312610108576100f39161010d565b60006101d66100f3926007610178565b346101085761020b6101fb610392366004610358565b61036c565b90816102809103126101085790565b9061028082820312610108576100f391610397565b346101085761020b6101fb6103d13660046103a6565b61063a565b34610108576103e6366004610305565b61020b6103f1610656565b604051918291826001600160a01b03909116815260200190565b90816101e09103126101085790565b906101e082820312610108576100f39161040b565b346101085761020b6101fb61044536600461041a565b610683565b346101085761045a366004610305565b61020b6103f161068c565b34610108576102c1610478366004610358565b610738565b90610182565b6100f39081565b6100f39054610483565b6104ab6100f3916104a3600090565b50603b61047d565b61048a565b9061011a92916104be610741565b6104f8565b634e487b7160e01b600052603260045260246000fd5b91908110156104e9576020020190565b6104c3565b356100f38161011c565b9282919060005b845b811015610539576105328161052c6105256105206105019589896104d9565b6104ee565b893361077d565b60010190565b90506104ff565b509350505050565b9061011a92916104b0565b909190829160005b835b8110156105835761057c8161052c610575610520610556958a896104d9565b333361077d565b9050610554565b5092505050565b61011a33610812565b61059b610741565b61011a6105b9565b6100e76100f36100f39290565b6100f3906105a3565b61011a6105c660006105b0565b6108a8565b61011a610593565b336105dc61068c565b6105f76001600160a01b0383165b916001600160a01b031690565b036106055761011a906108a8565b6106369061061260405190565b63118cdaa760e01b8152918291600483016001600160a01b03909116815260200190565b0390fd5b6100f3906109f3565b6100f3906100e7565b6100f39054610643565b6100f360007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b0161064c565b6100f390610ad3565b6100f3600061067d610b67565b61011a906106a5610741565b6106da565b906001600160a01b03905b9181191691161790565b906106cf6100f36106d69261016f565b82546106aa565b9055565b6106ee8160006106e8610b67565b016106bf565b6107076107016106fc610656565b61016f565b9161016f565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270061073260405190565b600090a3565b61011a90610699565b610749610656565b3390610754826105ea565b036106055750565b90600019906106b5565b906107766100f36106d692610190565b825461075c565b6107b16107ab6107b7929493946106fc6107976001610190565b6107a6876101d18a603a610178565b610766565b9361016f565b91610190565b917f3d4f9f1802e8d452c853ecb7e67f0b2952a80ab67afd1bbe07e7b94fd46cb7786107e260405190565b600090a4565b634e487b7160e01b600052601160045260246000fd5b600019811461080d5760010190565b6107e8565b61083f6107b1610823836007610178565b926106fc6108386108338661048a565b6107fe565b8095610766565b907fa82a649bbd060c9099cd7b7326e2b0dc9e9af0836480e0f849dc9eaa79710b3b61073260405190565b916001600160a01b0360089290920291821b911b6106b5565b91906108946100f36106d69361016f565b90835461086a565b61011a91600091610883565b61011a906108c06000806108ba610b67565b0161089c565b610b8b565b6002111561010857565b634e487b7160e01b600052602160045260246000fd5b600211156108ef57565b6108cf565b9061011a826108e5565b356100f3816108c5565b801515610101565b356100f381610908565b356100f3816100f6565b6100f3906108f4565b6101db90610924565b99979593919c9b9a98969492909c6101808b019d60008c01610956919052565b60208b016109639161092d565b151560408a0152606089016109779161092d565b6001600160a01b031660808801526001600160a01b031660a087015260c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176109ee57604052565b6109b6565b610abd6020610a02600461048a565b610ab1610a0e856108fe565b94610a1a848201610910565b90610a27604082016108fe565b906060810191610a368361091a565b610a426080840161091a565b610a4e60a08501610c43565b90610a5c6101008601610cd4565b92610a6a6102008701610d80565b94610a9b6104ab610a94610a8e610260610a876102408d016104ee565b9b016104ee565b9a61091a565b6007610178565b98610aa560405190565b9e8f9d8e019c8d610936565b908103825203826109cc565b610acf610ac8825190565b9160200190565b2090565b610abd6020610ae2600661048a565b610ab1610aee856108fe565b94610afa848201610910565b90610b07604082016108fe565b906060810191610b168361091a565b610b226080840161091a565b610b2e60a08501610c43565b90610b3c6101008601610dee565b92610b4a6101608701610d80565b94610a9b6104ab610a94610a8e6101c0610a876101a08d016104ee565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b610bc56107017f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993006106fc84610bbf8361064c565b926106bf565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e061073260405190565b61010181610643565b356100f381610bf0565b6101db9061016f565b610c3f61011a94610c35606094989795610c2b608086019a6000870152565b602085019061092d565b6040830190610c03565b0152565b610abd610c50600161048a565b610c59836108fe565b90610ab1610c756040610c6e60208801610bf9565b96016104ee565b604051958694602086019485610c0c565b9694929099989795939161012088019a60008901610ca2919052565b60208801610caf91610c03565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b610abd610ce1600361048a565b610cea83610bf9565b90610ab1610cfa602086016104ee565b94610d07604082016104ee565b90610d14606082016104ee565b610d20608083016104ee565b610d2c60a084016104ee565b91610d4560e0610d3e60c087016104ee565b95016104ee565b94610d4f60405190565b9a8b9960208b01998a610c86565b9081526001600160a01b03909116602082015260608101929161011a9160400152565b610abd610d8d600261048a565b91610da36020610d9c8361091a565b92016104ee565b92610ab1610db060405190565b948593602085019384610d5d565b610c3f61011a94610de7606094989795610ddd608086019a6000870152565b6020850190610c03565b6040830152565b610abd610dfb600561048a565b610e0483610bf9565b90610ab1610e196040610c6e602088016104ee565b604051958694602086019485610dbe56fea264697066735822122041acd25c8cd3c4c4fa9b537f0e1becfb96f356e0b9bc709beb3bfeb56b86426964736f6c63430008180033";
    static readonly abi: readonly [{
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
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): OfferControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): OfferController;
}
export {};

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
    static readonly bytecode = "0x60806040523461001a57604051610e9f6100208239610e9f90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063017d0ae0146100e257806308a8e4a3146100dd57806339e797d0146100d8578063406eedd6146100d35780634ae25a86146100ce578063627cdcb9146100c9578063715018a6146100c457806379ba5097146100bf5780637ecebe00146100ba5780637f99d691146100b55780638da5cb5b146100b0578063e30c3978146100ab5763f2fde38b0361010857610465565b61044a565b610415565b6103fa565b6103bb565b61037f565b610367565b61034f565b61032b565b6102e7565b610262565b610223565b6101df565b6001600160a01b031690565b90565b6001600160a01b0381165b0361010857565b600080fd5b9050359061011a826100f6565b565b80610101565b9050359061011a8261011c565b9190604083820312610108576100f390602061014b828661010d565b9401610122565b6100f3906100e7906001600160a01b031682565b6100f390610152565b6100f390610166565b906101829061016f565b600052602052604060002090565b6100f36100f36100f39290565b9061018290610190565b6100f3916008021c81565b906100f391546101a7565b6101d66100f3926101d1600093603a610178565b61019d565b6101b2565b9052565b346101085761020b6101fb6101f536600461012f565b906101bd565b6040519182918290815260200190565b0390f35b90602082820312610108576100f391610122565b346101085761020b6101fb61023936600461020f565b610494565b90816102409103126101085790565b9061024082820312610108576100f39161023e565b346101085761020b6101fb61027836600461024d565b6104b0565b909182601f830112156101085781359167ffffffffffffffff831161010857602001926020830284011161010857565b919091604081840312610108576102c4838261010d565b92602082013567ffffffffffffffff8111610108576102e3920161027d565b9091565b34610108576103006102fa3660046102ad565b9161054a565b604051005b9060208282031261010857813567ffffffffffffffff8111610108576102e3920161027d565b346101085761030061033e366004610305565b90610555565b600091031261010857565b346101085761035f366004610344565b610300610593565b3461010857610377366004610344565b6103006105d4565b346101085761038f366004610344565b6103006105dc565b90602082820312610108576100f39161010d565b60006101d66100f3926007610178565b346101085761020b6101fb6103d1366004610397565b6103ab565b90816102809103126101085790565b9061028082820312610108576100f3916103d6565b346101085761020b6101fb6104103660046103e5565b610643565b3461010857610425366004610344565b61020b61043061065f565b604051918291826001600160a01b03909116815260200190565b346101085761045a366004610344565b61020b61043061068c565b3461010857610300610478366004610397565b610738565b90610182565b6100f39081565b6100f39054610483565b6104ab6100f3916104a3600090565b50603b61047d565b61048a565b6100f39061086f565b9061011a92916104c761094f565b610501565b634e487b7160e01b600052603260045260246000fd5b91908110156104f2576020020190565b6104cc565b356100f38161011c565b9282919060005b845b8110156105425761053b8161053561052e61052961050a9589896104e2565b6104f7565b893361098b565b60010190565b9050610508565b509350505050565b9061011a92916104b9565b909190829160005b835b81101561058c576105858161053561057e61052961055f958a896104e2565b333361098b565b905061055d565b5092505050565b61011a33610a20565b6105a461094f565b61011a6105c2565b6100e76100f36100f39290565b6100f3906105ac565b61011a6105cf60006105b9565b610ab6565b61011a61059c565b336105e561068c565b6106006001600160a01b0383165b916001600160a01b031690565b0361060e5761011a90610ab6565b61063f9061061b60405190565b63118cdaa760e01b8152918291600483016001600160a01b03909116815260200190565b0390fd5b6100f390610ad3565b6100f3906100e7565b6100f3905461064c565b6100f360007f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993005b01610655565b6100f36000610686610b67565b61011a906106a561094f565b6106da565b906001600160a01b03905b9181191691161790565b906106cf6100f36106d69261016f565b82546106aa565b9055565b6106ee8160006106e8610b67565b016106bf565b6107076107016106fc61065f565b61016f565b9161016f565b907f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270061073260405190565b600090a3565b61011a90610699565b6002111561010857565b634e487b7160e01b600052602160045260246000fd5b6002111561076b57565b61074b565b9061011a82610761565b356100f381610741565b801515610101565b356100f381610784565b356100f3816100f6565b6100f390610770565b6101db906107a0565b99979593919c9b9a98969492909c6101808b019d60008c016107d2919052565b60208b016107df916107a9565b151560408a0152606089016107f3916107a9565b6001600160a01b031660808801526001600160a01b031660a087015260c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761086a57604052565b610832565b610939602061087e600661048a565b61092d61088a8561077a565b9461089684820161078c565b906108a36040820161077a565b9060608101916108b283610796565b6108be60808401610796565b6108ca60a08501610bde565b906108d86101008601610c5c565b926108e66101c08701610cef565b946109176104ab61091061090a6102206109036102008d016104f7565b9b016104f7565b9a610796565b6007610178565b9861092160405190565b9e8f9d8e019c8d6107b2565b90810382520382610848565b61094b610944825190565b9160200190565b2090565b61095761065f565b3390610962826105f3565b0361060e5750565b90600019906106b5565b906109846100f36106d692610190565b825461096a565b6109bf6109b96109c5929493946106fc6109a56001610190565b6109b4876101d18a603a610178565b610974565b9361016f565b91610190565b917f3d4f9f1802e8d452c853ecb7e67f0b2952a80ab67afd1bbe07e7b94fd46cb7786109f060405190565b600090a4565b634e487b7160e01b600052601160045260246000fd5b6000198114610a1b5760010190565b6109f6565b610a4d6109bf610a31836007610178565b926106fc610a46610a418661048a565b610a0c565b8095610974565b907fa82a649bbd060c9099cd7b7326e2b0dc9e9af0836480e0f849dc9eaa79710b3b61073260405190565b916001600160a01b0360089290920291821b911b6106b5565b9190610aa26100f36106d69361016f565b908354610a78565b61011a91600091610a91565b61011a90610ace600080610ac8610b67565b01610aaa565b610d2d565b6109396020610ae2600461048a565b61092d610aee8561077a565b94610afa84820161078c565b90610b076040820161077a565b906060810191610b1683610796565b610b2260808401610796565b610b2e60a08501610bde565b90610b3c6101008601610de0565b92610b4a6102008701610cef565b946109176104ab61091061090a6102606109036102408d016104f7565b7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c0090565b6101018161064c565b356100f381610b8b565b6101db9061016f565b610bda61011a94610bd0606094989795610bc6608086019a6000870152565b60208501906107a9565b6040830190610b9e565b0152565b610939610beb600161048a565b610bf48361077a565b9061092d610c106040610c0960208801610b94565b96016104f7565b604051958694602086019485610ba7565b90815260e08101979695909490939092909160208601610c4091610b9e565b604085015215156060840152608083015260a082015260c00152565b610939610c69600561048a565b610c7283610b94565b9061092d610c82602086016104f7565b94610c8f6040820161078c565b90610c9c606082016104f7565b610cb460a0610cad608085016104f7565b93016104f7565b92610cbe60405190565b988997602089019788610c21565b9081526001600160a01b03909116602082015260608101929161011a9160400152565b610939610cfc600261048a565b91610d126020610d0b83610796565b92016104f7565b9261092d610d1f60405190565b948593602085019384610ccc565b610d676107017f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c1993006106fc84610d6183610655565b926106bf565b907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e061073260405190565b9694929099989795939161012088019a60008901610dae919052565b60208801610dbb91610b9e565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b610939610ded600361048a565b610df683610b94565b9061092d610e06602086016104f7565b94610e13604082016104f7565b90610e20606082016104f7565b610e2c608083016104f7565b610e3860a084016104f7565b91610e5160e0610e4a60c087016104f7565b95016104f7565b94610e5b60405190565b9a8b9960208b01998a610d9256fea264697066735822122006e3d71d89119f04185c98b2f889bfdb676d040e4b2d723fbe60413893b9eb0c64736f6c63430008180033";
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

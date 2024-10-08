import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Signatures, SignaturesInterface } from "../../contracts/Signatures";
type SignaturesConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Signatures__factory extends ContractFactory {
    constructor(...args: SignaturesConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Signatures & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Signatures__factory;
    static readonly bytecode = "0x60806040523461001a57604051610739610020823961073990f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806339e797d0146100425780637ecebe001461003d57637f99d691036100565761018f565b610150565b610079565b90816102409103126100565790565b600080fd5b90610240828203126100565761007091610047565b90565b9052565b565b34610056576100a461009461008f36600461005b565b6101aa565b6040519182918290815260200190565b0390f35b6001600160a01b031690565b6001600160a01b0381165b0361005657565b90503590610077826100b4565b9060208282031261005657610070916100c6565b610070906100a8906001600160a01b031682565b610070906100e7565b610070906100fb565b9061011790610104565b600052602052604060002090565b610070916008021c81565b906100709154610125565b600061014b61007092600761010d565b610130565b34610056576100a46100946101663660046100d3565b61013b565b90816102809103126100565790565b9061028082820312610056576100709161016b565b34610056576100a46100946101a536600461017a565b6101b3565b6100709061030b565b610070906103f0565b6100709081565b61007090546101bc565b6002111561005657565b634e487b7160e01b600052602160045260246000fd5b600211156101f757565b6101d7565b90610077826101ed565b35610070816101cd565b8015156100bf565b3561007081610210565b35610070816100b4565b806100bf565b356100708161022c565b610070906101fc565b6100739061023c565b99979593919c9b9a98969492909c6101808b019d60008c0161026e919052565b60208b0161027b91610245565b151560408a01526060890161028f91610245565b6001600160a01b031660808801526001600160a01b031660a087015260c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761030657604052565b6102ce565b6103da602061031a60066101c3565b6103ce61032685610206565b94610332848201610218565b9061033f60408201610206565b90606081019161034e83610222565b61035a60808401610222565b61036660a085016104dd565b90610374610100860161055b565b926103826101c087016105ee565b946103b86103b36103ac6103a661022061039f6102008d01610232565b9b01610232565b9a610222565b600761010d565b6101c3565b986103c260405190565b9e8f9d8e019c8d61024e565b908103825203826102e4565b6103ec6103e5825190565b9160200190565b2090565b6103da60206103ff60046101c3565b6103ce61040b85610206565b94610417848201610218565b9061042460408201610206565b90606081019161043383610222565b61043f60808401610222565b61044b60a085016104dd565b90610459610100860161067a565b9261046761020087016105ee565b946103b86103b36103ac6103a661026061039f6102408d01610232565b6001600160a01b0381166100bf565b3561007081610484565b61007390610104565b6104d9610077946104cf6060949897956104c5608086019a6000870152565b6020850190610245565b604083019061049d565b0152565b6103da6104ea60016101c3565b6104f383610206565b906103ce61050f604061050860208801610493565b9601610232565b6040519586946020860194856104a6565b90815260e0810197969590949093909290916020860161053f9161049d565b604085015215156060840152608083015260a082015260c00152565b6103da61056860056101c3565b61057183610493565b906103ce61058160208601610232565b9461058e60408201610218565b9061059b60608201610232565b6105b360a06105ac60808501610232565b9301610232565b926105bd60405190565b988997602089019788610520565b9081526001600160a01b0390911660208201526060810192916100779160400152565b6103da6105fb60026101c3565b91610611602061060a83610222565b9201610232565b926103ce61061e60405190565b9485936020850193846105cb565b9694929099989795939161012088019a60008901610648919052565b602088016106559161049d565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b6103da61068760036101c3565b61069083610493565b906103ce6106a060208601610232565b946106ad60408201610232565b906106ba60608201610232565b6106c660808301610232565b6106d260a08401610232565b916106eb60e06106e460c08701610232565b9501610232565b946106f560405190565b9a8b9960208b01998a61062c56fea264697066735822122085dd4f6598ec9140f717aecec753793358848a2eb014d5e1b1ec97a4e80ce26964736f6c63430008180033";
    static readonly abi: readonly [{
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
    }];
    static createInterface(): SignaturesInterface;
    static connect(address: string, runner?: ContractRunner | null): Signatures;
}
export {};

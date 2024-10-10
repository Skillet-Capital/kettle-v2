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
    static readonly bytecode = "0x60806040523461001a576040516106fa61002082396106fa90f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c80637ecebe00146100425780637f99d6911461003d5763cee72578036100685761018f565b610150565b6100fd565b6001600160a01b031690565b90565b6001600160a01b0381165b0361006857565b600080fd5b9050359061007a82610056565b565b90602082820312610068576100539161006d565b61005390610047906001600160a01b031682565b61005390610090565b610053906100a4565b906100c0906100ad565b600052602052604060002090565b610053916008021c81565b9061005391546100ce565b60006100f46100539260076100b6565b6100d9565b9052565b346100685761012861011861011336600461007c565b6100e4565b6040519182918290815260200190565b0390f35b90816102809103126100685790565b9061028082820312610068576100539161012c565b346100685761012861011861016636600461013b565b6101aa565b90816101e09103126100685790565b906101e082820312610068576100539161016b565b34610068576101286101186101a536600461017a565b6101b3565b6100539061030b565b610053906103f0565b6100539081565b61005390546101bc565b6002111561006857565b634e487b7160e01b600052602160045260246000fd5b600211156101f757565b6101d7565b9061007a826101ed565b35610053816101cd565b801515610061565b3561005381610210565b3561005381610056565b80610061565b356100538161022c565b610053906101fc565b6100f99061023c565b99979593919c9b9a98969492909c6101808b019d60008c0161026e919052565b60208b0161027b91610245565b151560408a01526060890161028f91610245565b6001600160a01b031660808801526001600160a01b031660a087015260c086015260e08501526101008401526101208301526101408201526101600152565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff82111761030657604052565b6102ce565b6103da602061031a60046101c3565b6103ce61032685610206565b94610332848201610218565b9061033f60408201610206565b90606081019161034e83610222565b61035a60808401610222565b61036660a085016104dd565b90610374610100860161056e565b92610382610200870161061a565b946103b86103b36103ac6103a661026061039f6102408d01610232565b9b01610232565b9a610222565b60076100b6565b6101c3565b986103c260405190565b9e8f9d8e019c8d61024e565b908103825203826102e4565b6103ec6103e5825190565b9160200190565b2090565b6103da60206103ff60066101c3565b6103ce61040b85610206565b94610417848201610218565b9061042460408201610206565b90606081019161043383610222565b61043f60808401610222565b61044b60a085016104dd565b906104596101008601610688565b92610467610160870161061a565b946103b86103b36103ac6103a66101c061039f6101a08d01610232565b6001600160a01b038116610061565b3561005381610484565b6100f9906100ad565b6104d961007a946104cf6060949897956104c5608086019a6000870152565b6020850190610245565b604083019061049d565b0152565b6103da6104ea60016101c3565b6104f383610206565b906103ce61050f604061050860208801610493565b9601610232565b6040519586946020860194856104a6565b9694929099989795939161012088019a6000890161053c919052565b602088016105499161049d565b60408701526060860152608085015260a084015260c083015260e08201526101000152565b6103da61057b60036101c3565b61058483610493565b906103ce61059460208601610232565b946105a160408201610232565b906105ae60608201610232565b6105ba60808301610232565b6105c660a08401610232565b916105df60e06105d860c08701610232565b9501610232565b946105e960405190565b9a8b9960208b01998a610520565b9081526001600160a01b03909116602082015260608101929161007a9160400152565b6103da61062760026101c3565b9161063d602061063683610222565b9201610232565b926103ce61064a60405190565b9485936020850193846105f7565b6104d961007a94610681606094989795610677608086019a6000870152565b602085019061049d565b6040830152565b6103da61069560056101c3565b61069e83610493565b906103ce6106b3604061050860208801610232565b60405195869460208601948561065856fea26469706673582212209814285b553354cec2b456be592821696a9cd71cc6bd07f71c1e51321990755064736f6c63430008180033";
    static readonly abi: readonly [{
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

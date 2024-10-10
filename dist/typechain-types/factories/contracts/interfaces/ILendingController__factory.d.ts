import { type ContractRunner } from "ethers";
import type { ILendingController, ILendingControllerInterface } from "../../../contracts/interfaces/ILendingController";
export declare class ILendingController__factory {
    static readonly abi: readonly [{
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
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
    static createInterface(): ILendingControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): ILendingController;
}

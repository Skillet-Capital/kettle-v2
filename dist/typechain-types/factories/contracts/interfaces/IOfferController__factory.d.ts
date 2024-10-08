import { type ContractRunner } from "ethers";
import type { IOfferController, IOfferControllerInterface } from "../../../contracts/interfaces/IOfferController";
export declare class IOfferController__factory {
    static readonly abi: readonly [{
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
        readonly inputs: readonly [];
        readonly name: "incrementNonce";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IOfferControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): IOfferController;
}

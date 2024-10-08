import { type ContractRunner } from "ethers";
import type { IEscrowController, IEscrowControllerInterface } from "../../../contracts/interfaces/IEscrowController";
export declare class IEscrowController__factory {
    static readonly abi: readonly [{
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
    }];
    static createInterface(): IEscrowControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): IEscrowController;
}

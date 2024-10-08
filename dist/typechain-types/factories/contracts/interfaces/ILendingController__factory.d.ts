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
    }];
    static createInterface(): ILendingControllerInterface;
    static connect(address: string, runner?: ContractRunner | null): ILendingController;
}

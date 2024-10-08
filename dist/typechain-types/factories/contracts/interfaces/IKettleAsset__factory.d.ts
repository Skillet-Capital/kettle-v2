import { type ContractRunner } from "ethers";
import type { IKettleAsset, IKettleAssetInterface } from "../../../contracts/interfaces/IKettleAsset";
export declare class IKettleAsset__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "mint";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IKettleAssetInterface;
    static connect(address: string, runner?: ContractRunner | null): IKettleAsset;
}

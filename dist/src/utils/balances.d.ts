import { ethers } from "ethers";
export declare const currencyBalance: (owner: string, currency: string, provider: ethers.Provider) => Promise<bigint>;
export declare const collateralBalance: (owner: string, collection: string, tokenId: string | number | bigint, provider: ethers.Provider) => Promise<boolean>;

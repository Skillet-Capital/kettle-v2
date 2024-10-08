import { ethers } from "ethers";
export declare const currencyAllowance: (owner: string, currency: string, operator: string, provider: ethers.Provider) => Promise<bigint>;

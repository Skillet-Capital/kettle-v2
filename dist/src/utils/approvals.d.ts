import { ethers } from "ethers";
export declare const collateralApprovals: (owner: string, collection: string, operator: string, provider: ethers.Provider) => Promise<Boolean>;

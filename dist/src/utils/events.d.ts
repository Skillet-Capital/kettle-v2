import { Provider } from "ethers";
import { TransactionReceipt } from "ethers";
import { Numberish, Lien, Escrow } from "../types";
interface LienLog {
    lienId: Numberish;
    lien: Lien;
}
interface EscrowLog {
    escrowId: Numberish;
    escrow: Escrow;
}
export declare function getReceipt(provider: Provider, txnHash: string | null): Promise<TransactionReceipt>;
export declare function parseLienOpenedLog(receipt: TransactionReceipt): LienLog;
export declare function parseEscrowOpenedLog(receipt: TransactionReceipt): EscrowLog;
export {};

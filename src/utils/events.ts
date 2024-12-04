import { Provider } from "ethers";
import { Log, LogDescription, TransactionReceipt } from "ethers";
import { Numberish, Lien, EscrowStruct, Kettle__factory } from "../types";

interface EscrowLog {
  escrowId: Numberish;
  escrow: EscrowStruct;
}

interface Redemption {
  redemptionHash: string;
  redeemer: string;
  collection: string;
  tokenId: Numberish;
  currency: string;
  amount: Numberish;
}

export async function getReceipt(provider: Provider, txnHash: string | null): Promise<TransactionReceipt> {
  if (!txnHash) {
    throw new Error("Transaction hash was not properly created.");
  }

  // get the logs from the transaction hash
  const receipt = await provider.getTransactionReceipt(txnHash);

  if (!receipt) {
    throw new Error("Transaction receipt was not properly created.");
  }

  return receipt;
}

export function parseRedemptionLog(receipt: TransactionReceipt): Redemption {
  const iface = Kettle__factory.createInterface();

  const logs = receipt.logs
    .map((log: Log) => iface.parseLog(log))
    .filter((log: LogDescription | null) => log !== null) as LogDescription[];

  const redemptionLog = logs
    .find((log: LogDescription) => log.name === "Redemption") as LogDescription;

  if (!redemptionLog) {
    throw new Error("No EscrowOpened log found");
  }

  return {
    redemptionHash: redemptionLog.args.redemptionHash,
    redeemer: redemptionLog.args.redeemer,
    collection: redemptionLog.args.collection,
    tokenId: redemptionLog.args.tokenId,
    currency: redemptionLog.args.currency,
    amount: redemptionLog.args.amount,
  }
}

export function parseEscrowOpenedLog(receipt: TransactionReceipt): EscrowLog {
  const iface = Kettle__factory.createInterface();

  const logs = receipt.logs
    .map((log: Log) => iface.parseLog(log))
    .filter((log: LogDescription | null) => log !== null) as LogDescription[];

  const escrowLog = logs
    .find((log: LogDescription) => log.name === "EscrowOpened") as LogDescription;

  if (!escrowLog) {
    throw new Error("No EscrowOpened log found");
  }

  return {
    escrowId: escrowLog.args.escrowId,
    escrow: {
      side: escrowLog.args.escrow.side,
      buyer: escrowLog.args.escrow.buyer,
      seller: escrowLog.args.escrow.seller,
      collection: escrowLog.args.escrow.collection,
      placeholder: escrowLog.args.escrow.placeholder,
      currency: escrowLog.args.escrow.currency,
      amount: escrowLog.args.escrow.amount,
      fee: escrowLog.args.escrow.fee,
      recipient: escrowLog.args.escrow.recipient,
      rebate: escrowLog.args.escrow.rebate,
      redemptionHash: escrowLog.args.escrow.redemptionHash,
      redemptionCharge: escrowLog.args.escrow.redemptionCharge,
      timestamp: escrowLog.args.escrow.timestamp,
      lockTime: escrowLog.args.escrow.lockTime,
    }
  }
}

// interface LienLog {
//   lienId: Numberish;
//   lien: Lien;
// }

// export function parseLienOpenedLog(receipt: TransactionReceipt): LienLog {
//   const iface = LendingController__factory.createInterface();

//   const logs = receipt.logs
//     .map((log: Log) => iface.parseLog(log))
//     .filter((log: LogDescription | null) => log !== null) as LogDescription[];

//   const lienLog = logs
//     .find((log: LogDescription) => log.name === "LienOpened") as LogDescription;

//   if (!lienLog) {
//     throw new Error("No LienOpened log found");
//   }

//   return {
//     lienId: lienLog.args.lienId,
//     lien: {
//       borrower: lienLog.args.lien.borrower,
//       collection: lienLog.args.lien.collection,
//       tokenId: lienLog.args.lien.tokenId,
//       currency: lienLog.args.lien.currency,
//       principal: lienLog.args.lien.principal,
//       rate: lienLog.args.lien.rate,
//       defaultRate: lienLog.args.lien.defaultRate,
//       duration: lienLog.args.lien.duration,
//       gracePeriod: lienLog.args.lien.gracePeriod,
//       recipient: lienLog.args.lien.recipient,
//       fee: lienLog.args.lien.fee,
//       startTime: lienLog.args.lien.startTime,
//     }
//   }
// }

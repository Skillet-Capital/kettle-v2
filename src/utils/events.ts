import { ethers } from "hardhat";
import { Log, LogDescription, TransactionReceipt } from "ethers";
import { Kettle__factory } from "../../typechain-types";
import { Numberish, Lien, Escrow } from "../types";

interface LienLog {
  lienId: Numberish;
  lien: Lien;
}

interface EscrowLog {
  escrowId: Numberish;
  escrow: Escrow;
}

export async function getReceipt(txnHash: string | null): Promise<TransactionReceipt> {
  if (!txnHash) {
    throw new Error("Transaction hash was not properly created.");
  }

  // get the logs from the transaction hash
  const receipt = await ethers.provider.getTransactionReceipt(txnHash);

  if (!receipt) {
    throw new Error("Transaction receipt was not properly created.");
  }

  return receipt;
}

export function parseLienOpenedLog(receipt: TransactionReceipt): LienLog {
  const iface = Kettle__factory.createInterface();

  const logs = receipt.logs
    .map((log: Log) => iface.parseLog(log))
    .filter((log: LogDescription | null) => log !== null) as LogDescription[];

  const lienLog = logs
    .find((log: LogDescription) => log.name === "LienOpened") as LogDescription;

  if (!lienLog) {
    throw new Error("No LienOpened log found");
  }

  return {
    lienId: lienLog.args.lienId,
    lien: {
      borrower: lienLog.args.lien.borrower,
      collection: lienLog.args.lien.collection,
      tokenId: lienLog.args.lien.tokenId,
      currency: lienLog.args.lien.currency,
      principal: lienLog.args.lien.principal,
      rate: lienLog.args.lien.rate,
      defaultRate: lienLog.args.lien.defaultRate,
      duration: lienLog.args.lien.duration,
      gracePeriod: lienLog.args.lien.gracePeriod,
      recipient: lienLog.args.lien.recipient,
      fee: lienLog.args.lien.fee,
      startTime: lienLog.args.lien.startTime,
    }
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
    throw new Error("No LienOpened log found");
  }

  return {
    escrowId: escrowLog.args.escrowId,
    escrow: {
      placeholder: escrowLog.args.escrow.placeholder,
      buyer: escrowLog.args.escrow.buyer,
      seller: escrowLog.args.escrow.seller,
      collection: escrowLog.args.escrow.collection,
      identifier: escrowLog.args.escrow.identifier,
      currency: escrowLog.args.escrow.currency,
      amount: escrowLog.args.escrow.amount,
      fee: escrowLog.args.escrow.fee,
      recipient: escrowLog.args.escrow.recipient,
      rebate: escrowLog.args.escrow.rebate,
      timestamp: escrowLog.args.escrow.timestamp,
      lockTime: escrowLog.args.escrow.lockTime,
    }
  }
}


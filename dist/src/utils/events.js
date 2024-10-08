"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceipt = getReceipt;
exports.parseLienOpenedLog = parseLienOpenedLog;
exports.parseEscrowOpenedLog = parseEscrowOpenedLog;
const types_1 = require("../types");
async function getReceipt(provider, txnHash) {
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
function parseLienOpenedLog(receipt) {
    const iface = types_1.LendingController__factory.createInterface();
    const logs = receipt.logs
        .map((log) => iface.parseLog(log))
        .filter((log) => log !== null);
    const lienLog = logs
        .find((log) => log.name === "LienOpened");
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
    };
}
function parseEscrowOpenedLog(receipt) {
    const iface = types_1.LendingController__factory.createInterface();
    const logs = receipt.logs
        .map((log) => iface.parseLog(log))
        .filter((log) => log !== null);
    const escrowLog = logs
        .find((log) => log.name === "EscrowOpened");
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
    };
}

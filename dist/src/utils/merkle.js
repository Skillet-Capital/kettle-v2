"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = hashToken;
exports.generateRoot = generateRoot;
exports.generateProof = generateProof;
const merkletreejs_1 = require("merkletreejs");
const bignumber_1 = require("@ethersproject/bignumber");
const ethers_1 = require("ethers");
function hashToken(tokenId) {
    return (0, ethers_1.keccak256)(Buffer.from(bignumber_1.BigNumber.from(tokenId).toHexString().slice(2).padStart(64, '0'), 'hex'));
}
function generateRoot(tokens) {
    const tree = new merkletreejs_1.MerkleTree(tokens.map(hashToken), ethers_1.keccak256, {
        sort: true,
    });
    return tree.getHexRoot();
}
function generateProof(tokens, token) {
    if (!token)
        throw new Error('Token is required to generate proof');
    const tree = new merkletreejs_1.MerkleTree(tokens.map(hashToken), ethers_1.keccak256, {
        sort: true,
    });
    const tokenHash = hashToken(token);
    return tree.getHexProof(tokenHash);
}
module.exports = {
    hashToken,
    generateRoot,
    generateProof,
};

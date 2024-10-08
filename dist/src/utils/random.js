"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSalt = void 0;
const ethers_1 = require("ethers");
const randomSalt = () => {
    return `0x${Buffer.from(ethers_1.ethers.randomBytes(8)).toString("hex").padStart(64, "0")}`;
};
exports.randomSalt = randomSalt;

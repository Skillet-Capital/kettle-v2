"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collateralBalance = exports.currencyBalance = void 0;
const types_1 = require("../types");
const equalAddresses_1 = require("./equalAddresses");
const currencyBalance = async (owner, currency, provider) => {
    const contract = types_1.TestERC20__factory.connect(currency, provider);
    return contract.balanceOf(owner);
};
exports.currencyBalance = currencyBalance;
const collateralBalance = async (owner, collection, tokenId, provider) => {
    const contract = types_1.TestERC721__factory.connect(collection, provider);
    try {
        const _owner = await contract.ownerOf(tokenId);
        return (0, equalAddresses_1.equalAddresses)(_owner, owner);
    }
    catch {
        return false;
    }
};
exports.collateralBalance = collateralBalance;

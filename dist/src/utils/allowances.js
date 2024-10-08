"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyAllowance = void 0;
const types_1 = require("../types");
const currencyAllowance = async (owner, currency, operator, provider) => {
    const contract = types_1.TestERC20__factory.connect(currency, provider);
    return contract.allowance(owner, operator);
};
exports.currencyAllowance = currencyAllowance;

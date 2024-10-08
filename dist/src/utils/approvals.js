"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collateralApprovals = void 0;
const types_1 = require("../types");
const collateralApprovals = async (owner, collection, operator, provider) => {
    const contract = types_1.TestERC721__factory.connect(collection, provider);
    return contract.isApprovedForAll(owner, operator);
};
exports.collateralApprovals = collateralApprovals;

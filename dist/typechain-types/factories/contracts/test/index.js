"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestOfferController__factory = exports.TestERC721__factory = exports.TestERC20__factory = exports.TestCompoundInterest__factory = exports.testKettleAssetFactorySol = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.testKettleAssetFactorySol = __importStar(require("./TestKettleAssetFactory.sol"));
var TestCompoundInterest__factory_1 = require("./TestCompoundInterest__factory");
Object.defineProperty(exports, "TestCompoundInterest__factory", { enumerable: true, get: function () { return TestCompoundInterest__factory_1.TestCompoundInterest__factory; } });
var TestERC20__factory_1 = require("./TestERC20__factory");
Object.defineProperty(exports, "TestERC20__factory", { enumerable: true, get: function () { return TestERC20__factory_1.TestERC20__factory; } });
var TestERC721__factory_1 = require("./TestERC721__factory");
Object.defineProperty(exports, "TestERC721__factory", { enumerable: true, get: function () { return TestERC721__factory_1.TestERC721__factory; } });
var TestOfferController__factory_1 = require("./TestOfferController__factory");
Object.defineProperty(exports, "TestOfferController__factory", { enumerable: true, get: function () { return TestOfferController__factory_1.TestOfferController__factory; } });

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
exports.TransferConduit__factory = exports.Signatures__factory = exports.OfferController__factory = exports.LendingController__factory = exports.LenderReceipt__factory = exports.Kettle__factory = exports.EscrowController__factory = exports.test = exports.lib = exports.interfaces = exports.helpers = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.helpers = __importStar(require("./helpers"));
exports.interfaces = __importStar(require("./interfaces"));
exports.lib = __importStar(require("./lib"));
exports.test = __importStar(require("./test"));
var EscrowController__factory_1 = require("./EscrowController__factory");
Object.defineProperty(exports, "EscrowController__factory", { enumerable: true, get: function () { return EscrowController__factory_1.EscrowController__factory; } });
var Kettle__factory_1 = require("./Kettle__factory");
Object.defineProperty(exports, "Kettle__factory", { enumerable: true, get: function () { return Kettle__factory_1.Kettle__factory; } });
var LenderReceipt__factory_1 = require("./LenderReceipt__factory");
Object.defineProperty(exports, "LenderReceipt__factory", { enumerable: true, get: function () { return LenderReceipt__factory_1.LenderReceipt__factory; } });
var LendingController__factory_1 = require("./LendingController__factory");
Object.defineProperty(exports, "LendingController__factory", { enumerable: true, get: function () { return LendingController__factory_1.LendingController__factory; } });
var OfferController__factory_1 = require("./OfferController__factory");
Object.defineProperty(exports, "OfferController__factory", { enumerable: true, get: function () { return OfferController__factory_1.OfferController__factory; } });
var Signatures__factory_1 = require("./Signatures__factory");
Object.defineProperty(exports, "Signatures__factory", { enumerable: true, get: function () { return Signatures__factory_1.Signatures__factory; } });
var TransferConduit__factory_1 = require("./TransferConduit__factory");
Object.defineProperty(exports, "TransferConduit__factory", { enumerable: true, get: function () { return TransferConduit__factory_1.TransferConduit__factory; } });
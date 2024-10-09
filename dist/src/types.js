"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepAction = exports.Criteria = exports.Side = exports.OfferKind = exports.TestERC721__factory = exports.TestERC20__factory = exports.LendingController__factory = exports.EscrowController__factory = exports.Kettle__factory = void 0;
const typechain_types_1 = require("../typechain-types");
Object.defineProperty(exports, "Kettle__factory", { enumerable: true, get: function () { return typechain_types_1.Kettle__factory; } });
Object.defineProperty(exports, "EscrowController__factory", { enumerable: true, get: function () { return typechain_types_1.EscrowController__factory; } });
Object.defineProperty(exports, "LendingController__factory", { enumerable: true, get: function () { return typechain_types_1.LendingController__factory; } });
const typechain_types_2 = require("../typechain-types");
Object.defineProperty(exports, "TestERC20__factory", { enumerable: true, get: function () { return typechain_types_2.TestERC20__factory; } });
Object.defineProperty(exports, "TestERC721__factory", { enumerable: true, get: function () { return typechain_types_2.TestERC721__factory; } });
// ==============================================
//                INTERNAL TYPES
// ==============================================
var OfferKind;
(function (OfferKind) {
    OfferKind[OfferKind["LOAN"] = 0] = "LOAN";
    OfferKind[OfferKind["MARKET"] = 1] = "MARKET";
})(OfferKind || (exports.OfferKind = OfferKind = {}));
;
var Side;
(function (Side) {
    Side[Side["BID"] = 0] = "BID";
    Side[Side["ASK"] = 1] = "ASK";
})(Side || (exports.Side = Side = {}));
;
var Criteria;
(function (Criteria) {
    Criteria[Criteria["SIMPLE"] = 0] = "SIMPLE";
    Criteria[Criteria["PROOF"] = 1] = "PROOF";
})(Criteria || (exports.Criteria = Criteria = {}));
;
var StepAction;
(function (StepAction) {
    StepAction[StepAction["SEND"] = 0] = "SEND";
    StepAction[StepAction["SIGN"] = 1] = "SIGN";
})(StepAction || (exports.StepAction = StepAction = {}));
;

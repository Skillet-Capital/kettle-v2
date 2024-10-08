"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_ZERO = exports.BYTES_ZERO = exports.BASIS_POINTS_DIVISOR = exports.PERMIT_TYPE = exports.LOAN_OFFER_TYPE = exports.MARKET_OFFER_TYPE = exports.LOAN_OFFER_TERMS_TYPE = exports.MARKET_OFFER_TERMS_TYPE = exports.FEE_TERMS_TYPE = exports.COLLATERAL_TYPE = exports.KETTLE_CONTRACT_VERSION = exports.KETTLE_CONTRACT_NAME = void 0;
exports.KETTLE_CONTRACT_NAME = "Kettle";
exports.KETTLE_CONTRACT_VERSION = "1";
exports.COLLATERAL_TYPE = [
    { name: "criteria", type: "uint8" },
    { name: "collection", type: "address" },
    { name: "identifier", type: "uint256" }
];
exports.FEE_TERMS_TYPE = [
    { name: "recipient", type: "address" },
    { name: "rate", type: "uint256" }
];
exports.MARKET_OFFER_TERMS_TYPE = [
    { name: "currency", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "withLoan", type: "bool" },
    { name: "borrowAmount", type: "uint256" },
    { name: "loanOfferHash", type: "bytes32" },
    { name: "rebate", type: "uint256" }
];
exports.LOAN_OFFER_TERMS_TYPE = [
    { name: "currency", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "maxAmount", type: "uint256" },
    { name: "minAmount", type: "uint256" },
    { name: "rate", type: "uint256" },
    { name: "defaultRate", type: "uint256" },
    { name: "duration", type: "uint256" },
    { name: "gracePeriod", type: "uint256" }
];
exports.MARKET_OFFER_TYPE = {
    MarketOffer: [
        { name: "kind", type: "uint8" },
        { name: "soft", type: "bool" },
        { name: "side", type: "uint8" },
        { name: "maker", type: "address" },
        { name: "taker", type: "address" },
        { name: "collateral", type: "Collateral" },
        { name: "terms", type: "MarketOfferTerms" },
        { name: "fee", type: "FeeTerms" },
        { name: "expiration", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ],
    Collateral: exports.COLLATERAL_TYPE,
    FeeTerms: exports.FEE_TERMS_TYPE,
    MarketOfferTerms: exports.MARKET_OFFER_TERMS_TYPE
};
exports.LOAN_OFFER_TYPE = {
    LoanOffer: [
        { name: "kind", type: "uint8" },
        { name: "soft", type: "bool" },
        { name: "side", type: "uint8" },
        { name: "maker", type: "address" },
        { name: "taker", type: "address" },
        { name: "collateral", type: "Collateral" },
        { name: "terms", type: "LoanOfferTerms" },
        { name: "fee", type: "FeeTerms" },
        { name: "expiration", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ],
    Collateral: exports.COLLATERAL_TYPE,
    FeeTerms: exports.FEE_TERMS_TYPE,
    LoanOfferTerms: exports.LOAN_OFFER_TERMS_TYPE
};
exports.PERMIT_TYPE = {
    Permit: [
        { name: "taker", type: "address" },
        { name: "currency", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "offerHash", type: "bytes32" },
        { name: "expiration", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "nonce", type: "uint256" }
    ]
};
exports.BASIS_POINTS_DIVISOR = 10000n;
exports.BYTES_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

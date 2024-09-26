export const KETTLE_CONTRACT_NAME = "Kettle";
export const KETTLE_CONTRACT_VERSION = "1";

export const COLLATERAL_TYPE = [
  { name: "criteria",       type: "uint8" },
  { name: "collection",     type: "address" },
  { name: "identifier",     type: "uint256" }
];

export const FEE_TERMS_TYPE = [
  { name: "recipient",      type: "address" },
  { name: "rate",           type: "uint256" }
];

export const MARKET_OFFER_TERMS_TYPE = [
  { name: "currency",       type: "address" },
  { name: "amount",         type: "uint256" },
  { name: "withLoan",       type: "bool"    },
  { name: "borrowAmount",   type: "uint256" },
  { name: "loanOfferHash",  type: "bytes32" },
  { name: "rebate",         type: "uint256" }
];

export const LOAN_OFFER_TERMS_TYPE = [
  { name: "currency",       type: "address" },
  { name: "amount",         type: "uint256" },
  { name: "maxAmount",      type: "uint256" },
  { name: "minAmount",      type: "uint256" },
  { name: "rate",           type: "uint256" },
  { name: "defaultRate",    type: "uint256" },
  { name: "duration",       type: "uint256" },
  { name: "gracePeriod",    type: "uint256" }
];

export const MARKET_OFFER_TYPE = {
  MarketOffer: [
    { name: "side",         type: "uint8"   },
    { name: "maker",        type: "address" },
    { name: "taker",        type: "address" },
    { name: "collateral",   type: "Collateral" },
    { name: "terms",        type: "MarketOfferTerms" },
    { name: "fee",          type: "FeeTerms" },
    { name: "expiration",   type: "uint256" },
    { name: "salt",         type: "uint256" },
    { name: "nonce",        type: "uint256" }
  ],
  Collateral: COLLATERAL_TYPE,
  FeeTerms: FEE_TERMS_TYPE,
  MarketOfferTerms: MARKET_OFFER_TERMS_TYPE
}

export const LOAN_OFFER_TYPE = {
  LoanOffer: [
    { name: "side",           type: "uint8"   },
    { name: "maker",          type: "address" },
    { name: "taker",          type: "address" },
    { name: "collateral",     type: "Collateral" },
    { name: "terms",          type: "LoanOfferTerms" },
    { name: "fee",            type: "FeeTerms" },
    { name: "expiration",     type: "uint256" },
    { name: "salt",           type: "uint256" },
    { name: "nonce",          type: "uint256" }
  ],
  Collateral: COLLATERAL_TYPE,
  FeeTerms: FEE_TERMS_TYPE,
  LoanOfferTerms: LOAN_OFFER_TERMS_TYPE
}

export const BASIS_POINTS_DIVISOR = 10_000n;
export const BYTES_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

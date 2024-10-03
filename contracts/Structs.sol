// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

enum LienStatus { CURRENT, DELINQUENT, DEFAULTED }
enum Criteria { SIMPLE, PROOF }
enum Side { BID, ASK }

struct Lien {
    address borrower;
    address collection;
    uint256 tokenId;
    address currency;
    uint256 principal;
    uint256 rate;
    uint256 defaultRate;
    uint256 duration;
    uint256 gracePeriod;
    address recipient;
    uint256 fee;
    uint256 startTime;
}

struct Collateral {
    Criteria criteria;
    address collection;
    uint256 identifier;
}

struct FeeTerms {
    address recipient;
    uint256 rate;
}

// ====================================
//            LOAN OFFER
// ====================================

struct LoanOfferTerms {
    address currency;
    uint256 amount;
    uint256 maxAmount;
    uint256 minAmount;
    uint256 rate;
    uint256 defaultRate;
    uint256 duration;
    uint256 gracePeriod;
}

struct LoanOffer {
    bool soft;
    Side side;
    address maker;
    address taker;
    Collateral collateral;
    LoanOfferTerms terms;
    FeeTerms fee;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//            MARKET OFFER
// ====================================

struct MarketOfferTerms {
    address currency;
    uint256 amount;
    bool withLoan;
    uint256 borrowAmount;
    bytes32 loanOfferHash;
    uint256 rebate;
}

struct MarketOffer {
    bool soft;
    Side side;
    address maker;
    address taker;
    Collateral collateral;
    MarketOfferTerms terms;
    FeeTerms fee;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//              PERMIT
// ====================================

struct Permit {
    address taker;
    address currency;
    uint256 amount;
    bytes32 offerHash;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//              ESCROW
// ====================================

struct Escrow {
    Side side;
    uint256 placeholder;
    uint256 identifier;
    address buyer;
    address seller;
    address collection;
    address currency;
    address recipient;
    uint256 amount;
    uint256 fee;
    uint256 rebate;
    uint256 timestamp;
    uint256 lockTime;
}

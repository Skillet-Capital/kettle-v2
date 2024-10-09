import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { ethers } from "hardhat";
import { expect } from "chai";
import { parseUnits } from "ethers";

import { Criteria, Kettle, KettleContract, LoanOffer, MarketOffer, OfferKind, Side } from "../src";

import { deployKettle } from "./fixture";

function randomBytes32() {
  return ethers.hexlify(ethers.randomBytes(32));
}

function randomAddress() {
  return ethers.Wallet.createRandom().address;
}

function randomAmount() {
  return parseUnits(Math.random().toString(), 18);
}

function randomRate() {
  return parseUnits((Math.random() * 100).toFixed(0), 2).toString();
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function randomInteger() {
  return Math.floor(Math.random() * 1_000);
}

describe("Kettle Utils", () => {
  let kettle: Kettle;
  let _kettle: KettleContract;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;

    kettle = new Kettle(fixture.accounts[0], await _kettle.getAddress());
  })

  it("sdk should hash market offer the same as contract", async () => {
    const maker = randomAddress();
    const offer: MarketOffer = {
      soft: randomBoolean(),
      kind: OfferKind.MARKET,
      side: Side.ASK,
      maker,
      taker: randomAddress(),
      collateral: {
        criteria: Criteria.PROOF,
        collection: randomAddress(),
        identifier: 1,
      },
      terms: {
        amount: randomAmount(),
        currency: randomAddress(),
        rebate: randomRate()
      },
      fee: {
        recipient: randomAddress(),
        rate: randomRate()
      },
      expiration: randomInteger(),
      salt: randomBytes32(),
      nonce: await _kettle.nonces(maker)
    }

    const sdkHash = kettle.hashMarketOffer(offer);
    const contractHash = await _kettle.hashMarketOffer(offer);

    expect(sdkHash).to.equal(contractHash);
  })

  it("sdk should hash loan offer the same as contract", async () => {
    const maker = randomAddress();
    const offer: LoanOffer = {
      soft: randomBoolean(),
      kind: OfferKind.LOAN,
      side: Side.ASK,
      maker,
      taker: randomAddress(),
      collateral: {
        criteria: Criteria.PROOF,
        collection: randomAddress(),
        identifier: 1,
      },
      terms: {
        amount: randomAmount(),
        currency: randomAddress(),
        maxAmount: randomAmount(),
        minAmount: randomAmount(),
        rate: randomRate(),
        defaultRate: randomRate(),
        duration: randomInteger(),
        gracePeriod: randomInteger()
      },
      fee: {
        recipient: randomAddress(),
        rate: randomRate()
      },
      expiration: randomInteger(),
      salt: randomBytes32(),
      nonce: await _kettle.nonces(maker)
    }

    const sdkHash = kettle.hashLoanOffer(offer);
    const contractHash = await _kettle.hashLoanOffer(offer);

    expect(sdkHash).to.equal(contractHash);
  })
})

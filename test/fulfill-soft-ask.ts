import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, randomBytes, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types";

import { generateProof, generateRoot, getReceipt, parseEscrowOpenedLog, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { BYTES_ZERO } from "../src/constants";

describe("Fulfill Soft Ask", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;

  let buyer: Signer;
  let seller: Signer;
  let fulfiller: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: string = randomSalt();
  let amount: bigint = parseUnits("100", 18);

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);

    _kettle = fixture.kettle;
    buyer = fixture.accounts[0];
    seller = fixture.accounts[1];
    fulfiller = fixture.accounts[2];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    kettle = new Kettle(seller, await _kettle.getAddress());
  });

  it("[REJECT] should reject if maker is not whitelisted", async () => {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "SellerCannotEscrowAsk");
  })

  it("[REJECT] should reject if same placeholder escrow exists", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await _kettle.whitelistAskMaker(seller, true);

    await _buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s));

    expect(await currency.balanceOf(_kettle)).to.equal(offer.terms.amount);

    // FAIL to take the same offer again
    const { offer: offer2, signature: sig2 } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer2 as MarketOffer,
      signature: sig2
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "TokenAlreadyEscrowed");
  });

  it("buyer should escrow ask offer (NO REBATE)", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await _kettle.whitelistAskMaker(seller, true);

    const txn = await _buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s));

    expect(await currency.balanceOf(_kettle)).to.equal(offer.terms.amount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = parseEscrowOpenedLog(receipt);

    expect(escrow).to.deep.equal({
      side: Side.ASK,
      buyer: await buyer.getAddress(),
      seller: await seller.getAddress(),
      collection: await collection.getAddress(),
      placeholder: tokenId,
      currency: await currency.getAddress(),
      amount: offer.terms.amount,
      rebate: 0,
      fee: offer.fee.rate,
      recipient: await recipient.getAddress(),
      redemptionHash: BYTES_ZERO,
      redemptionCharge: 0,
      timestamp: await time.latest(),
      lockTime: await _kettle.lockTime()
    })
  });

  it("buyer should escrow ask offer (WITH REBATE)", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      rebate: 100,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(seller, rebateAmount);

    await _kettle.whitelistAskMaker(seller, true);

    const txn = await _buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s));

    expect(await currency.balanceOf(_kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = parseEscrowOpenedLog(receipt);

    expect(escrow).to.deep.equal({
      side: Side.ASK,
      buyer: await buyer.getAddress(),
      seller: await seller.getAddress(),
      collection: await collection.getAddress(),
      placeholder: tokenId,
      currency: await currency.getAddress(),
      amount: offer.terms.amount,
      rebate: rebateAmount,
      fee: offer.fee.rate,
      recipient: await recipient.getAddress(),
      redemptionHash: BYTES_ZERO,
      redemptionCharge: 0,
      timestamp: await time.latest(),
      lockTime: await _kettle.lockTime()
    })
  });

  it("fulfiller should escrow ask offer for buyer", async function () {
    const _seller = await kettle.connect(seller);
    const _fulfiller = await kettle.connect(fulfiller);

    await collection.mint(seller, tokenId);
    await currency.mint(fulfiller, amount);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: true,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      rebate: 100,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(seller, rebateAmount);

    await _kettle.whitelistAskMaker(seller, true);

    const txn = await _fulfiller.takeMarketOffer({
      tokenId: tokenId,
      taker: await buyer.getAddress(),
      offer: offer as MarketOffer,
      signature
    }, fulfiller).then(s => executeTakeSteps(fulfiller, s));

    expect(await currency.balanceOf(_kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = parseEscrowOpenedLog(receipt);

    expect(escrow).to.deep.equal({
      side: Side.ASK,
      buyer: await buyer.getAddress(),
      seller: await seller.getAddress(),
      collection: await collection.getAddress(),
      placeholder: tokenId,
      currency: await currency.getAddress(),
      amount: offer.terms.amount,
      rebate: rebateAmount,
      fee: offer.fee.rate,
      recipient: await recipient.getAddress(),
      redemptionHash: BYTES_ZERO,
      redemptionCharge: 0,
      timestamp: await time.latest(),
      lockTime: await _kettle.lockTime()
    })
  });
});

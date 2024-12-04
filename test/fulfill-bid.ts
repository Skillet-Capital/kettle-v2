import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer, ZeroAddress } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, OfferKind, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { MarketOfferStruct } from "../typechain-types/contracts/Kettle";

describe("Fulfill Bid", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: number = 1;
  let amount: bigint = parseUnits("100", 18);

  let root: string;
  let tokens: number[];

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    buyer = fixture.accounts[0];
    seller = fixture.accounts[1];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    kettle = new Kettle(seller, await _kettle.getAddress());

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await buyer.getAddress()] = "buyer";
    tracer.nameTags[await seller.getAddress()] = "seller";
  });

  it("should fail if kind is not BID", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if tokenId does not match identifier
    await expect(_kettle.connect(seller).fulfillBid(
      BigInt(tokenId),
      offer as MarketOfferStruct,
      signature,
      []
    )).to.be.revertedWithCustomError(_kettle, "SideMustBeBid");
  });

  it("should fail if offer is soft", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      soft: true,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if tokenId does not match identifier
    await expect(_kettle.connect(seller).fulfillBid(
      BigInt(tokenId),
      offer as MarketOfferStruct,
      signature,
      []
    )).to.be.revertedWithCustomError(_kettle, "BidMustBeHard");
  });

  it("should fail if kind is not MARKET_OFFER", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if tokenId does not match identifier
    await expect(_kettle.connect(seller).fulfillBid(
      BigInt(tokenId),
      { ...offer, kind: OfferKind.LOAN } as any as MarketOfferStruct,
      signature,
      []
    )).to.be.revertedWithCustomError(_kettle, "InvalidMarketOffer");
  });

  it("should fail if fee too high", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 10_001n,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if tokenId does not match identifier
    await expect(_seller.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer, 
      signature
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "InvalidFee");
  });

  it("seller should take bid offer (SIMPLE)", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if tokenId does not match identifier
    await expect(_seller.takeMarketOffer({
      tokenId: tokenId + 1,
      offer: offer as MarketOffer, 
      signature
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "InvalidToken");
    
    await _seller.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer, 
      signature
    }, seller).then(s => executeTakeSteps(seller, s));

    expect(await collection.ownerOf(tokenId)).to.equal(buyer);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);
  });

  it("seller should take bid offer (PROOF)", async function () {
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      criteria: Criteria.PROOF,
      identifier: root,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const _seller = await kettle.connect(seller);

    // should reject if proof is not provided
    await expect(_seller.takeMarketOffer({
      tokenId,
      offer: offer as MarketOffer, 
      signature,
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "InvalidCriteria");

    const proof = generateProof(tokens, tokenId);

    // should reject if proof is invalid
    await expect(_seller.takeMarketOffer({
      tokenId,
      offer: offer as MarketOffer, 
      signature,
      proof: [randomSalt(), randomSalt(), randomSalt()]
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "InvalidCriteria");

    await _seller.takeMarketOffer({
      tokenId,
      offer: offer as MarketOffer, 
      signature,
      proof
    }, seller).then(s => executeTakeSteps(seller, s));

    expect(await collection.ownerOf(tokenId)).to.equal(buyer);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);
  });
});

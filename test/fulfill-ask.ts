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

describe("Fulfill Ask", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;
  let fulfiller: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: number = 1;
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

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await buyer.getAddress()] = "buyer";
    tracer.nameTags[await seller.getAddress()] = "seller";
  });

  it("[REJECT] should reject if offer is BID", async function () {
    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await expect(_kettle.connect(buyer).fulfillAsk(
      tokenId,
      ZeroAddress,
      { ...offer, side: Side.BID } as MarketOffer,
      signature,
      []
    )).to.be.revertedWithCustomError(_kettle, "SideMustBeAsk");
  });

  it("[REJECT] should fail if kind is not MARKET_OFFER", async function () {
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

    // should reject if tokenId does not match identifier
    await expect(_kettle.connect(seller).fulfillAsk(
      BigInt(tokenId),
      ZeroAddress,
      { ...offer, kind: OfferKind.LOAN } as any as MarketOfferStruct,
      signature,
      []
    )).to.be.revertedWithCustomError(_kettle, "InvalidMarketOffer");
  });
  
  it("buyer should take ask offer", async function () {
    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const _seller = await kettle.connect(seller);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    const _buyer = await kettle.connect(buyer);

    // should reject if tokenId does not match identifier
    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId + 1,
      offer: offer as MarketOffer, 
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "InvalidToken");

    await _buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer, 
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s));

    expect(await collection.ownerOf(tokenId)).to.equal(buyer);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);

    expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
  });

  it("fulfiller should take ask offer for buyer", async function () {
    await collection.mint(seller, tokenId);
    await currency.mint(fulfiller, amount);

    const _seller = await kettle.connect(seller);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    const _fulfiller = await kettle.connect(fulfiller);

    await _fulfiller.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      taker: await buyer.getAddress(),
      signature
    }, fulfiller).then(s => executeTakeSteps(fulfiller, s));

    expect(await collection.ownerOf(tokenId)).to.equal(buyer);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);

    expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
  });
});

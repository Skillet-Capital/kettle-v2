import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Fulfill Market Offer", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;
  let recipient: Signer;

  let redemptionAdmin: Signer;
  let redemptionWallet: Signer;

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

    redemptionAdmin = fixture.redemptionAdmin;
    redemptionWallet = fixture.redemptionWallet;

    kettle = new Kettle(seller, await _kettle.getAddress());

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await buyer.getAddress()] = "buyer";
    tracer.nameTags[await seller.getAddress()] = "seller";
  });

  it("should reject if offer is expired", async function () {
    const _seller = await kettle.connect(seller);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: 0
    }, seller).then(s => executeCreateSteps(seller, s));

    const _buyer = await kettle.connect(buyer);

    // should reject if tokenId does not match identifier
    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer, 
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "OfferExpired");
  });

  it("should reject if offer is cancelled", async function () {
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

    await _kettle.connect(seller).cancelOffers([offer.salt]);

    // should reject if tokenId does not match identifier
    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer, 
      signature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "OfferUnavailable");
  });
  
  it("buyer should take ask offer", async function () {
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

    // should reject if soft is true
    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: { ...offer, soft: true } as MarketOffer, 
      signature,
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "CannotTakeSoftOffer");

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

  it("should redeem asset on fulfill ask", async function () {
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

    // create and sign redemption charge
    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer: buyer,
      collection,
      tokenId,
      currency,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: { ...offer, side: Side.BID } as MarketOffer, 
      signature,
      redemptionCharge: charge,
      redemptionChargeSignature: chargeSignature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "CannotRedeemFromBid");;

    await currency.mint(buyer, chargeAmount);
    await _buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature,
      redemptionCharge: charge,
      redemptionChargeSignature: chargeSignature
    }, buyer).then(s => executeTakeSteps(buyer, s));

    // expect redemption
    expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
    expect(await currency.balanceOf(redemptionWallet)).to.equal(chargeAmount);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);

    expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
  })
});

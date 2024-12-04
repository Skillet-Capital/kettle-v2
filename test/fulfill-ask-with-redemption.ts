import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer, ZeroAddress } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { getReceipt, Kettle, KettleContract, MarketOffer, OfferKind, parseRedemptionLog, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { MarketOfferStruct } from "../typechain-types/contracts/Kettle";

describe("Fulfill Ask With Redemption", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;
  let fulfiller: Signer;
  let recipient: Signer;

  let redemptionAdmin: Signer;
  let redemptionWallet: Signer;

  let collection: TestERC721;
  let currency: TestERC20;
  let currency2: TestERC20;

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
    currency2 = fixture.currency2;

    redemptionAdmin = fixture.redemptionAdmin;
    redemptionWallet = fixture.redemptionWallet;

    kettle = new Kettle(seller, await _kettle.getAddress());
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

    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer: buyer,
      collection,
      tokenId,
      currency: currency2,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    await expect(_kettle.connect(buyer).fulfillAskWithRedemption(
      tokenId,
      ZeroAddress,
      { ...offer, side: Side.BID } as MarketOffer,
      charge,
      signature,
      chargeSignature,
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

    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer: buyer,
      collection,
      tokenId,
      currency: currency2,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    // should reject if tokenId does not match identifier
    await expect(_kettle.connect(seller).fulfillAskWithRedemption(
      BigInt(tokenId),
      ZeroAddress,
      { ...offer, kind: OfferKind.LOAN } as any as MarketOfferStruct,
      charge,
      signature,
      chargeSignature,
      []
    )).to.be.revertedWithCustomError(_kettle, "InvalidMarketOffer");
  });
  

  it("[REJECT] should reject if redemption currency != offer currency", async function () {
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

    // create and sign redemption charge
    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer: buyer,
      collection,
      tokenId,
      currency: currency2,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    await currency.mint(buyer, chargeAmount);
    await expect(_buyer.takeMarketOffer({
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature,
      redemptionCharge: charge,
      redemptionChargeSignature: chargeSignature
    }, buyer).then(s => executeTakeSteps(buyer, s))).to.be.revertedWithCustomError(_kettle, "RedemptionCurrencyMismatch");
  });

  it("buyer should take ask offer and redeem", async function () {
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

    await currency.mint(buyer, chargeAmount);
    const txn = await _buyer.takeMarketOffer({
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

    const receipt = await getReceipt(buyer.provider!, txn);
    const redemption = await parseRedemptionLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
    expect(redemption).to.deep.equal({
      collection: await collection.getAddress(),
      tokenId: tokenId,
      currency: await currency.getAddress(),
      amount: chargeAmount,
      redeemer: await buyer.getAddress(),
      redemptionHash: redemptionHash
    })
  });

  it("fulfiller should take ask offer for buyer and redeem", async function () {
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

    await currency.mint(fulfiller, chargeAmount);
    const txn = await _fulfiller.takeMarketOffer({
      tokenId: tokenId,
      taker: await buyer.getAddress(),
      offer: offer as MarketOffer,
      signature,
      redemptionCharge: charge,
      redemptionChargeSignature: chargeSignature
    }, fulfiller).then(s => executeTakeSteps(fulfiller, s));

    // expect redemption
    expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
    expect(await currency.balanceOf(redemptionWallet)).to.equal(chargeAmount);

    const fee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(seller)).to.equal(amount - fee);

    expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);

    const receipt = await getReceipt(buyer.provider!, txn);
    const redemption = await parseRedemptionLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
    expect(redemption).to.deep.equal({
      collection: await collection.getAddress(),
      tokenId: tokenId,
      currency: await currency.getAddress(),
      amount: chargeAmount,
      redeemer: await buyer.getAddress(),
      redemptionHash: redemptionHash
    })
  });
});

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, randomBytes, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types";

import { generateProof, generateRoot, getReceipt, parseBidEscrowOpenedLog, parseEscrowOpenedLog, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { BYTES_ZERO } from "../src/constants";

describe("Escrow Bid", function () {
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

  it("[REJECT] should reject if seller is not whitelisted", async () => {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _buyer.createMarketOffer({
      soft: false,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    await expect(_seller.takeMarketOffer({
      softBid: true,
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "SellerCannotEscrowBid");
  })

  it("[REJECT] should reject if same placeholder escrow exists", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _buyer.createMarketOffer({
      soft: false,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    await _kettle.whitelistBidTaker(seller, true);

    await _seller.takeMarketOffer({
      softBid: true,
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, seller).then(s => executeTakeSteps(seller, s));

    expect(await currency.balanceOf(_kettle)).to.equal(offer.terms.amount);

    // FAIL to take the same offer again
    const { offer: offer2, signature: sig2 } = await _buyer.createMarketOffer({
      soft: false,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    await expect(_seller.takeMarketOffer({
      softBid: true,
      tokenId: tokenId,
      offer: offer2 as MarketOffer,
      signature: sig2
    }, seller).then(s => executeTakeSteps(seller, s))).to.be.revertedWithCustomError(_kettle, "TokenAlreadyEscrowed");
  });

  it("seller should escrow bid offer (NO REBATE)", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _buyer.createMarketOffer({
      soft: false,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    await _kettle.whitelistBidTaker(seller, true);

    const txn = await _seller.takeMarketOffer({
      softBid: true,
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, seller).then(s => executeTakeSteps(seller, s));

    expect(await currency.balanceOf(_kettle)).to.equal(offer.terms.amount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = parseBidEscrowOpenedLog(receipt);

    expect(escrow).to.deep.equal({
      side: Side.BID,
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

  it("buyer should escrow bid offer (WITH REBATE)", async function () {
    const _seller = await kettle.connect(seller);
    const _buyer = await kettle.connect(buyer);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    const { offer, signature } = await _buyer.createMarketOffer({
      soft: false,
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      rebate: 100,
      recipient,
      expiration: await time.latest() + 60
    }, buyer).then(s => executeCreateSteps(buyer, s));

    const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(seller, rebateAmount);

    await _kettle.whitelistBidTaker(seller, true);

    const txn = await _seller.takeMarketOffer({
      softBid: true,
      tokenId: tokenId,
      offer: offer as MarketOffer,
      signature
    }, seller).then(s => executeTakeSteps(seller, s));

    expect(await currency.balanceOf(_kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = parseBidEscrowOpenedLog(receipt);

    expect(escrow).to.deep.equal({
      side: Side.BID,
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

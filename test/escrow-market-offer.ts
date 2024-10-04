import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { EscrowController } from "../typechain-types";

describe("Escrow Market Offer", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;
  let _escrow: EscrowController;

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
    _escrow = fixture.escrow;
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

  it("should revert if offer is hard", async function () {
    const _seller = await kettle.connect(seller);

    const { offer, signature } = await _seller.createMarketOffer({
      soft: false,
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _buyer = await kettle.connect(buyer);

    await expect(_buyer.escrowMarketOffer(
      offer as MarketOffer, 
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "CannotTakeHardOffer");
  });
  
  it("buyer should escrow ask offer (NO REBATE)", async function () {
    const _seller = await kettle.connect(seller);

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
    }).then(executeCreateSteps);

    const _buyer = await kettle.connect(buyer);

    await expect(_buyer.escrowMarketOffer(
      offer as MarketOffer, 
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_escrow, "SellerNotAskWhitelisted");

    await _escrow.whitelistedAskMaker(seller, true);

    await _buyer.escrowMarketOffer(
      offer as MarketOffer, 
      signature
    ).then(executeTakeSteps);

    expect(await currency.balanceOf(_escrow)).to.equal(offer.terms.amount);
  });

  it("buyer should escrow ask offer (WITH REBATE)", async function () {
    const _seller = await kettle.connect(seller);

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
    }).then(executeCreateSteps);

    const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(seller, rebateAmount);

    const _buyer = await kettle.connect(buyer);
    await expect(_buyer.escrowMarketOffer(
      offer as MarketOffer, 
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_escrow, "SellerNotAskWhitelisted");

    await _escrow.whitelistedAskMaker(seller, true);

    await _buyer.escrowMarketOffer(
      offer as MarketOffer, 
      signature
    ).then(executeTakeSteps);

    expect(await currency.balanceOf(_escrow)).to.equal(BigInt(offer.terms.amount) + rebateAmount);
  });
});

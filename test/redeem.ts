import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer, ZeroAddress } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { getReceipt, Kettle, KettleContract, MarketOffer, parseRedemptionLog, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Redeem", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let redeemer: Signer;
  let fulfiller: Signer;

  let redemptionAdmin: Signer;
  let redemptionWallet: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: number = 1;
  let amount: bigint = parseUnits("100", 18);

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);

    _kettle = fixture.kettle;
    redeemer = fixture.accounts[0];
    fulfiller = fixture.accounts[2];
    collection = fixture.collection;
    currency = fixture.currency;

    redemptionAdmin = fixture.redemptionAdmin;
    redemptionWallet = fixture.redemptionWallet;

    kettle = new Kettle(redeemer, await _kettle.getAddress());

    tracer.nameTags[await redeemer.getAddress()] = "redeemer";
    tracer.nameTags[await fulfiller.getAddress()] = "fulfiller";
  });

  it("redeemer use msg.sender if redeemer is 0", async function () {
    await collection.mint(redeemer, tokenId);
    await currency.mint(redeemer, amount);

    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer,
      collection,
      tokenId,
      currency,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    await collection.connect(redeemer).approve(_kettle, tokenId);
    await currency.connect(redeemer).approve(_kettle, chargeAmount);
    const txn = await _kettle.connect(redeemer).redeem(
      ZeroAddress,
      charge,
      chargeSignature,
    );

    // expect redemption
    expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
    expect(await currency.balanceOf(redemptionWallet)).to.equal(chargeAmount);

    const receipt = await getReceipt(redeemer.provider!, txn.hash);
    const redemption = await parseRedemptionLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
    expect(redemption).to.deep.equal({
      collection: await collection.getAddress(),
      tokenId: tokenId,
      currency: await currency.getAddress(),
      amount: chargeAmount,
      redeemer: await redeemer.getAddress(),
      redemptionHash: redemptionHash
    })
  });

  it("redeemer should redeem asset", async function () {
    await collection.mint(redeemer, tokenId);
    await currency.mint(redeemer, amount);

    const _redeemer = await kettle.connect(redeemer);

    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer,
      collection,
      tokenId,
      currency,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    const txn = await _redeemer.redeem(
      charge,
      chargeSignature,
      redeemer,
    ).then(s => executeTakeSteps(redeemer, s));

    // expect redemption
    expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
    expect(await currency.balanceOf(redemptionWallet)).to.equal(chargeAmount);

    const receipt = await getReceipt(redeemer.provider!, txn);
    const redemption = await parseRedemptionLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
    expect(redemption).to.deep.equal({
      collection: await collection.getAddress(),
      tokenId: tokenId,
      currency: await currency.getAddress(),
      amount: chargeAmount,
      redeemer: await redeemer.getAddress(),
      redemptionHash: redemptionHash
    })
  });

  it("fulfiller should redeem asset for redeemer", async function () {
    await collection.mint(redeemer, tokenId);
    await currency.mint(fulfiller, amount);

    const _fulfiller = await kettle.connect(fulfiller);

    const chargeAmount = parseUnits("100", 18);
    const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
      redeemer,
      collection,
      tokenId,
      currency,
      amount: chargeAmount,
      expiration: await time.latest() + 100
    });

    const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);

    await collection.connect(redeemer).approve(_kettle, tokenId);
    const txn = await _fulfiller.redeem(
      charge,
      chargeSignature,
      fulfiller,
    ).then(s => executeTakeSteps(fulfiller, s));

    // expect redemption
    expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
    expect(await currency.balanceOf(redemptionWallet)).to.equal(chargeAmount);

    const receipt = await getReceipt(redeemer.provider!, txn);
    const redemption = await parseRedemptionLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
    expect(redemption).to.deep.equal({
      collection: await collection.getAddress(),
      tokenId: tokenId,
      currency: await currency.getAddress(),
      amount: chargeAmount,
      redeemer: await redeemer.getAddress(),
      redemptionHash: redemptionHash
    })
  });
});

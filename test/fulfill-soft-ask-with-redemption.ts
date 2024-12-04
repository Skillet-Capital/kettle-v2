import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { getReceipt, Kettle, KettleContract, MarketOffer, parseEscrowOpenedLog, parseRedemptionLog, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Fulfill Soft Ask With Redemption", function () {
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

  it("buyer should escrow ask offer and redemption", async function () {
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

    expect(await currency.balanceOf(_kettle)).to.equal(amount + chargeAmount);

    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = await parseEscrowOpenedLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
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
      redemptionHash: redemptionHash,
      redemptionCharge: chargeAmount,
      timestamp: await time.latest(),
      lockTime: await _kettle.lockTime()
    })
  });

  it("fulfiller should escrow ask offer and redemption for buyer", async function () {
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
      recipient,
      expiration: await time.latest() + 60
    }, seller).then(s => executeCreateSteps(seller, s));

    await _kettle.whitelistAskMaker(seller, true);

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
    expect(await currency.balanceOf(_kettle)).to.equal(amount + chargeAmount);
    
    const receipt = await getReceipt(buyer.provider!, txn);
    const { escrow } = await parseEscrowOpenedLog(receipt);

    const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);
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
      redemptionHash: redemptionHash,
      redemptionCharge: chargeAmount,
      timestamp: await time.latest(),
      lockTime: await _kettle.lockTime()
    })
  });
});

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits } from "ethers";

import { Kettle, MarketOffer, OfferWithSignature, Side } from "../src";
import { deployKettle } from "./fixture";

describe("Buy (take ask)", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should fail if offer is bid", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker] = accounts;

    const _kettle = new Kettle(maker, await kettle.getAddress());

    const offer = await _kettle._formatMarketOffer(await maker.getAddress(), {
      side: Side.BID,
      collection,
      currency,
      identifier: 1,
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    await expect(kettle.buy(offer, "0x")).to.be.revertedWith("RequiresAskSide");
  })

  it("should take ask offer", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await collection.mint(maker, tokenId);
    await currency.mint(taker, amount);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    let output: OfferWithSignature | null = null;
    for (const step of makeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "create") {
        output = await step.create();
      }
    }

    const { offer, signature } = output || {};

    if (!offer || !signature) {
      throw new Error("Offer not created");
    }

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(taker);

    expect(await currency.balanceOf(taker)).to.equal(0);

    const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(maker)).to.equal(amount - fee);
  });

  it.skip("should take ask offer (PERMIT)", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await collection.mint(maker, tokenId);
    await currency.mint(taker, amount);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    let output: OfferWithSignature | null = null;
    for (const step of makeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "create") {
        output = await step.create();
      }
    }

    const { offer, signature } = output || {};

    if (!offer || !signature) {
      throw new Error("Offer not created");
    }

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(taker);

    expect(await currency.balanceOf(taker)).to.equal(0);

    const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(maker)).to.equal(amount - fee);
  })
});

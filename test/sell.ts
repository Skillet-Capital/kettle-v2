import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits } from "ethers";

import { Criteria, Kettle, MarketOffer, OfferWithSignature, Side } from "../src";
import { generateProof, generateRoot } from "../src/utils";
import { deployKettle } from "./fixture";

describe("Sell (take bid)", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should fail if offer is ask", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker] = accounts;

    const _kettle = new Kettle(maker, await kettle.getAddress());

    const offer = await _kettle._formatMarketOffer(await maker.getAddress(), {
      side: Side.ASK,
      collection,
      currency,
      identifier: 1,
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    await expect(kettle.sell(1, offer, "0x", [])).to.be.revertedWith("RequiresNakedBid");
  })

  it("should take bid offer (SIMPLE)", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await currency.mint(maker, amount);
    await collection.mint(taker, tokenId);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.BID,
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

    expect(await collection.ownerOf(tokenId)).to.equal(maker);

    expect(await currency.balanceOf(maker)).to.equal(0);

    const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(taker)).to.equal(amount - fee);
  });

  it("should take bid offer (PROOF)", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await currency.mint(maker, amount);
    await collection.mint(taker, tokenId);

    const tokens = [1,2,3,4,5];
    const root = generateRoot(tokens);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      criteria: Criteria.PROOF,
      identifier: root,
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

    const proof = generateProof(tokens, 1);
    const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature, proof);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(maker);

    expect(await currency.balanceOf(maker)).to.equal(0);

    const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(fee);
    expect(await currency.balanceOf(taker)).to.equal(amount - fee);
  });
});

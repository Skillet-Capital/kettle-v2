import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits } from "ethers";

import { Criteria, Kettle, LoanOffer, MarketOffer, OfferWithSignature, Side } from "../src";
import { generateProof, generateRoot } from "../src/utils";
import { deployKettle } from "./fixture";

describe("Borrow (take bid)", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should fail if offer is ask", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker] = accounts;

    const _kettle = new Kettle(maker, await kettle.getAddress());

    const offer = await _kettle._formatLoanOffer(await maker.getAddress(), {
      side: Side.ASK,
      collection,
      currency,
      identifier: 1,
      amount: parseUnits("100", 18),
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    await expect(kettle.borrow(1, 0, offer, "0x", [])).to.be.revertedWith("RequiresBidSide");
  })

  it("should borrow from loan offer (SIMPLE)", async function () {
    const { kettle, recipient, currency, collection, accounts, receipt } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await currency.mint(maker, amount);
    await collection.mint(taker, tokenId);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
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
    const takeSteps = await _takerKettle.takeLoanOffer(tokenId, offer as LoanOffer, signature);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(kettle);
    expect(await receipt.ownerOf(0)).to.equal(maker);

    expect(await currency.balanceOf(maker)).to.equal(0);

    expect(await currency.balanceOf(recipient)).to.equal(0);
    expect(await currency.balanceOf(taker)).to.equal(amount);
  });

  it("should borrow from loan offer (PROOF)", async function () {
    const { kettle, recipient, currency, collection, accounts, receipt } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await currency.mint(maker, amount);
    await collection.mint(taker, tokenId);

    const tokens = [1,2,3,4,5];
    const root = generateRoot(tokens);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      criteria: Criteria.PROOF,
      identifier: root,
      amount,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
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
    const takeSteps = await _takerKettle.takeLoanOffer(tokenId, offer as LoanOffer, signature, proof);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(kettle);

    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(taker)).to.equal(amount);
  });
});

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits } from "ethers";

import { Kettle, LoanOffer, MarketOffer, OfferWithSignature, PermitWithSignature, Side } from "../src";
import { deployKettle } from "./fixture";

describe("Lend (take ask)", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should fail if offer is side bid", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker] = accounts;

    const _kettle = new Kettle(maker, await kettle.getAddress());

    const offer = await _kettle._formatLoanOffer(await maker.getAddress(), {
      side: Side.BID,
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

    await expect(kettle.lend(offer, "0x")).to.be.revertedWith("RequiresAskSide");
  })

  it("should fail if rate is too high", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker] = accounts;

    const _kettle = new Kettle(maker, await kettle.getAddress());

    const offer = await _kettle._formatLoanOffer(await maker.getAddress(), {
      side: Side.ASK,
      collection,
      currency,
      identifier: 1,
      amount: parseUnits("100", 18),
      rate: 100_001,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    await expect(kettle.lend(offer, "0x")).to.be.revertedWith("InvalidRate");
  })

  it("should fail if default rate is too high", async function () {
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
      defaultRate: 100_001,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS
    });

    await expect(kettle.lend(offer, "0x")).to.be.revertedWith("InvalidRate");
  })

  it("should lend to borrow offer", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await collection.mint(maker, tokenId);
    await currency.mint(taker, amount);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createLoanOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
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
    const takeSteps = await _takerKettle.takeLoanOffer(tokenId, offer as LoanOffer, signature);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        await step.take();
      }
    }

    expect(await collection.ownerOf(tokenId)).to.equal(kettle);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(amount);
  });

  it("should lend to borrow offer (PERMIT)", async function () {
    const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    const [maker, taker] = accounts;

    await collection.mint(maker, tokenId);
    await currency.mint(taker, amount);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createLoanOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: tokenId,
      amount,
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
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
    
    const permitSteps = await _takerKettle.createPermit("loan", offer as LoanOffer);
    
    let permitOutput: PermitWithSignature | null = null;
    for (const step of permitSteps) {
      if (step.type === "permit") {
        permitOutput = await step.permit();
      }
    }

    const { permit, signature: permitSignature } = permitOutput || {};

    if (!permit || !permitSignature) {
      throw new Error("Permit not created");
    }

    const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature);

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      }
    }

    const account = accounts[accounts.length - 1];
    await kettle.connect(account).lendWithPermit(offer as LoanOffer, permit, signature, permitSignature);

    expect(await collection.ownerOf(tokenId)).to.equal(kettle);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(amount);
  })
});

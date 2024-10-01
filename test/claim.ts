import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { Criteria, Kettle, KettleContract, Lien, LienStruct, LoanOffer, MarketOffer, Numberish, OfferWithSignature, Side } from "../src";
import { generateProof, generateRoot, getReceipt, parseLienOpenedLog } from "../src/utils";
import { deployKettle } from "./fixture";
import { LenderReceipt, TestERC20, TestERC721 } from "../typechain-types";

const DAY_SECONDS = 60 * 60 * 24;

describe("Claim", function () {
  let lien: Lien;
  let lienId: Numberish;

  let kettle: KettleContract;
  let lenderReceipt: LenderReceipt;

  let maker: Signer;
  let taker: Signer;
  let recipient: Signer;
  let accounts: Signer[];
  
  let currency: TestERC20;
  let collection: TestERC721;

  beforeEach(async function () {
    ({ kettle, receipt: lenderReceipt, recipient, currency, collection, accounts } = await loadFixture(deployKettle));

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    [maker, taker] = accounts;

    await currency.mint(maker, amount);
    await collection.mint(taker, tokenId);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 500,
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

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Offer not taken");
    }

    const receipt = await getReceipt(txnHash);
    ({ lienId, lien } = await parseLienOpenedLog(receipt));
  });

  it("should fail if not defaulted", async function () {
    const _kettle = new Kettle(taker, await kettle.getAddress());

    await time.increase(lien.duration);
    await expect(kettle.claim(lienId, lien)).to.be.revertedWith("LienIsCurrent");
  });

  it("should fail if invalid", async function () {
    const _kettle = new Kettle(taker, await kettle.getAddress());

    await time.increase(lien.duration);
    await expect(kettle.claim(1, lien)).to.be.revertedWith("InvalidLien");
  });

  it("should claim (by lender)", async function () {
    const _kettle = new Kettle(maker, await kettle.getAddress());

    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + 1n);

    const steps = await _kettle.claim(lienId, lien);
    for (const step of steps) {
      if (step.type === "claim") {
        await step.claim();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(maker);
    
  });

  it("should claim (by anyone)", async function () {
    const account = accounts[accounts.length - 1];

    const _kettle = new Kettle(account, await kettle.getAddress());

    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + 1n);

    const steps = await _kettle.claim(lienId, lien);
    for (const step of steps) {
      if (step.type === "claim") {
        await step.claim();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(maker);
    
  });

  it("should claim to holder of receipt", async function () {
    const account = accounts[accounts.length - 1];

    await lenderReceipt.connect(maker).transferFrom(maker, account, lienId);
    expect(await kettle.currentLender(lienId)).to.equal(account);

    const _kettle = new Kettle(account, await kettle.getAddress());

    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + 1n);

    const steps = await _kettle.claim(lienId, lien);
    for (const step of steps) {
      if (step.type === "claim") {
        await step.claim();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(account);
  });
});

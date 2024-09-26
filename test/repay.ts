import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { Criteria, Kettle, KettleContract, Lien, LienStruct, LoanOffer, MarketOffer, Numberish, OfferWithSignature, Side } from "../src";
import { generateProof, generateRoot, getReceipt, parseLienOpenedLog } from "../src/utils";
import { deployKettle } from "./fixture";
import { LenderReceipt, TestERC20, TestERC721 } from "../typechain-types";
import { ADDRESS_ZERO } from "../src/constants";

const DAY_SECONDS = 60 * 60 * 24;

describe("Repay", function () {
  const delta = parseUnits("1", 12) // within 1000 gwei;

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
    ({ kettle, receipt: lenderReceipt, recipient, currency, collection, accounts } = await deployKettle());

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

  it("should repay lien (current)", async function () {
    const _kettle = new Kettle(taker, await kettle.getAddress());

    await time.increase(lien.duration);
    const { debt, interest, fee } = await _kettle.currentDebt(lien as Lien);

    const currentBalance = await currency.balanceOf(taker);
    await currency.mint(taker, _kettle.safeFactorMul(BigInt(debt) - currentBalance, 10));

    const steps = await _kettle.repay(lienId, lien);

    let finalInterest: Numberish = 0n;
    let finalFee: Numberish = 0n;

    let txnHash: string | null = null;
    for (const step of steps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "repay") {

        ({ interest: finalInterest, fee: finalFee } = await _kettle.currentDebt(lien as Lien));
        txnHash = await step.repay();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(taker);
    expect(await currency.balanceOf(recipient)).to.be.closeTo(finalFee, delta);
    expect(await currency.balanceOf(maker)).to.be.closeTo(BigInt(lien.principal) + BigInt(finalInterest), delta);

    await expect(lenderReceipt.ownerOf(lienId)).to.be.revertedWith("NOT_MINTED");
  });

  it("should repay lien (delinquent)", async function () {
    const _kettle = new Kettle(taker, await kettle.getAddress());

    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) / 2n);
    const { debt } = await _kettle.currentDebt(lien as Lien);

    const currentBalance = await currency.balanceOf(taker);
    await currency.mint(taker, _kettle.safeFactorMul(BigInt(debt) - currentBalance, 10));

    const steps = await _kettle.repay(lienId, lien);

    let finalInterest: Numberish = 0n;
    let finalFee: Numberish = 0n;

    let txnHash: string | null = null;
    for (const step of steps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "repay") {

        ({ interest: finalInterest, fee: finalFee } = await _kettle.currentDebt(lien as Lien));
        txnHash = await step.repay();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(taker);
    expect(await currency.balanceOf(recipient)).to.be.closeTo(finalFee, delta);
    expect(await currency.balanceOf(maker)).to.be.closeTo(BigInt(lien.principal) + BigInt(finalInterest), delta);
  });

  it("should reject repay lien (defaulted)", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + 1n);
    await expect(kettle.connect(taker).repay(lienId, lien)).to.be.revertedWith("LienIsDefaulted");
  });

  it("should reject repay lien (invalid)", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + 1n);
    await expect(kettle.connect(taker).repay(1, lien)).to.be.revertedWith("InvalidLien");
  });

  it("should repay lien (holder of receipt)", async function () {
    const _kettle = new Kettle(taker, await kettle.getAddress());

    await time.increase(lien.duration);
    const { debt, interest, fee } = await _kettle.currentDebt(lien as Lien);

    const currentBalance = await currency.balanceOf(taker);
    await currency.mint(taker, _kettle.safeFactorMul(BigInt(debt) - currentBalance, 10));

    const steps = await _kettle.repay(lienId, lien);

    let finalInterest: Numberish = 0n;
    let finalFee: Numberish = 0n;

    const account = accounts[accounts.length - 1];
    await lenderReceipt.connect(maker).transferFrom(maker, account, lienId);
    expect(await kettle.currentLender(lienId)).to.equal(account);

    let txnHash: string | null = null;
    for (const step of steps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "repay") {

        ({ interest: finalInterest, fee: finalFee } = await _kettle.currentDebt(lien as Lien));
        txnHash = await step.repay();
      }
    }

    expect(await collection.ownerOf(lien.tokenId)).to.equal(taker);
    expect(await currency.balanceOf(recipient)).to.be.closeTo(finalFee, delta);
    expect(await currency.balanceOf(account)).to.be.closeTo(BigInt(lien.principal) + BigInt(finalInterest), delta);
  });
});

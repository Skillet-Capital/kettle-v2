import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, getReceipt, parseLienOpenedLog, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, Lien, LoanOffer, MarketOffer, Numberish, Side } from "../src";
import { DAY_SECONDS, executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Fulfill Market Offer In Lien", function () {
  let _kettle: KettleContract;
  let kettle: Kettle;

  let borrower: Signer;
  let lender: Signer;
  let refinancer: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let collection2: TestERC721;
  let currency2: TestERC20;

  let tokenId: number = 1;
  let amount: bigint = parseUnits("100", 18);

  let root: string;
  let tokens: number[];

  let lienId: Numberish;
  let lien: Lien;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    borrower = fixture.accounts[0];
    lender = fixture.accounts[1];
    refinancer = fixture.accounts[2];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;
    collection2 = fixture.collection2;
    currency2 = fixture.currency2;

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    kettle = new Kettle(borrower, await _kettle.getAddress());
    await collection.mint(borrower, tokenId);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await borrower.getAddress()] = "borrower";
    tracer.nameTags[await lender.getAddress()] = "lender";
    tracer.nameTags[await refinancer.getAddress()] = "refinancer";

    const _lender = kettle.connect(lender);
    await currency.mint(lender, amount);

    const { offer, signature } = await _lender.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _borrower = kettle.connect(borrower);

    const txnHash = await _borrower.takeLoanOffer(
      tokenId,
      offer.terms.amount,
      offer as LoanOffer, 
      signature
    ).then(executeTakeSteps);

    const receipt = await getReceipt(txnHash);
    ({ lienId, lien } = parseLienOpenedLog(receipt));

    await time.increase(BigInt(lien.duration) / 2n)
  });

  it("should reject refinance borrower offer (currency mismatch)", async function () {
    const _borrower = kettle.connect(borrower);

    const { debt } = await _borrower.currentDebt(lien);

    const { offer, signature } = await _borrower.createLoanOffer({
      side: Side.ASK,
      collection,
      currency: currency2,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _refinancer = kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "CurrencyMismatch");
  })

  it("should reject refinance borrower offer (collection mismatch)", async function () {
    const _borrower = kettle.connect(borrower);

    const { debt } = await _borrower.currentDebt(lien);

    const { offer, signature } = await _borrower.createLoanOffer({
      side: Side.ASK,
      collection: collection2,
      currency,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _refinancer = kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "CollectionMismatch");
  })

  it("should reject refinance borrower offer (maker != borrower)", async function () {
    const _lender = kettle.connect(lender);

    const { debt } = await _lender.currentDebt(lien);

    const { offer, signature } = await _lender.createLoanOffer({
      side: Side.ASK,
      collection: collection2,
      currency,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _refinancer = kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "MakerIsNotBorrower");
  })

  it("should reject refinance borrower offer (amount < debt)", async function () {
    const _borrower = kettle.connect(borrower);

    const { debt } = await _borrower.currentDebt(lien);

    const { offer, signature } = await _borrower.createLoanOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _refinancer = kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InsufficientAskAmount");
  })

  it("refinancer should refinance borrower", async function () {
    const _borrower = kettle.connect(borrower);

    const { debt } = await _borrower.currentDebt(lien);

    const { offer, signature } = await _borrower.createLoanOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(debt, 1000),
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _refinancer = kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    await _refinancer.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  });

  it("should reject refinance lender offer (taker != borrower)", async function () {
    const _refinancer = kettle.connect(refinancer);

    const { debt } = await _refinancer.currentDebt(lien);

    const { offer, signature } = await _refinancer.createLoanOffer({
      side: Side.BID,
      collection: collection2,
      currency,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(refinancer, offer.terms.amount);

    const _lender = kettle.connect(lender);

    await expect(_lender.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "TakerIsNotBorrower");
  })

  it("borrower should take refinance offer (debt < offer)", async function () {
    const _refinancer = kettle.connect(refinancer);

    const { debt } = await _refinancer.currentDebt(lien);

    const { offer, signature } = await _refinancer.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(debt, 1000),
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = kettle.connect(borrower);

    await _borrower.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })

  it("borrower should take refinance offer (principal + interest < offer < debt)", async function () {
    const _refinancer = kettle.connect(refinancer);

    const { interest, fee } = await _refinancer.currentDebt(lien);

    const { offer, signature } = await _refinancer.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(BigInt(interest) + BigInt(fee), 1000),
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = kettle.connect(borrower);

    await _borrower.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })

  it("borrower should take refinance offer (offer < principal + interest)", async function () {
    const _refinancer = kettle.connect(refinancer);

    const { offer, signature } = await _refinancer.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(BigInt(lien.principal), 1000),
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = kettle.connect(borrower);

    await _borrower.takeLoanOfferInLien(
      lienId,
      offer.terms.amount,
      lien,
      offer as LoanOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })
});

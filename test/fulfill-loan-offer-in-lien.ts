import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { LendingController, TestERC20, TestERC721 } from "../typechain-types"; 

import { generateRoot, getReceipt, parseLienOpenedLog } from "../src/utils";
import { Kettle, KettleContract, Lien, LoanOffer, Numberish, Side } from "../src";
import { DAY_SECONDS, executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Fulfill Loan Offer In Lien", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;
  let _lending: LendingController;

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
    _lending = fixture.lending;
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

    const _lender = await kettle.connect(lender);
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
    }, lender).then(s => executeCreateSteps(lender, s));

    const _borrower = await kettle.connect(borrower);

    const txnHash = await _borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature
    }, borrower).then(s => executeTakeSteps(borrower, s));

    const receipt = await getReceipt(borrower.provider!, txnHash);
    ({ lienId, lien } = parseLienOpenedLog(receipt));

    await time.increase(BigInt(lien.duration) / 2n)
  });

  afterEach(async function () {
    expect(await currency.balanceOf(_kettle)).to.equal(0);
  })

  it("should reject if lien is invalid or defaulted", async function () {
    const _borrower = await kettle.connect(borrower);

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
      expiration: await time.latest() + 1e9
    }, borrower).then(s => executeCreateSteps(borrower, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId: BigInt(lienId) + 1n,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(lender, s))).to.be.revertedWithCustomError(_lending, "InvalidLien");

    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + BigInt(1));
    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s))).to.be.revertedWithCustomError(_lending, "LienIsDefaulted");
  })

  it("should reject refinance borrower offer (currency mismatch)", async function () {
    const _borrower = await kettle.connect(borrower);

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
    }, borrower).then(s => executeCreateSteps(borrower, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s))).to.be.revertedWithCustomError(_kettle, "CurrencyMismatch");
  })

  it("should reject refinance borrower offer (collection mismatch)", async function () {
    const _borrower = await kettle.connect(borrower);

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
    }, borrower).then(s => executeCreateSteps(borrower, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s))).to.be.revertedWithCustomError(_kettle, "CollectionMismatch");
  })

  it("should reject refinance borrower offer (maker != borrower)", async function () {
    const _lender = await kettle.connect(lender);

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
    }, lender).then(s => executeCreateSteps(lender, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s))).to.be.revertedWithCustomError(_kettle, "MakerIsNotBorrower");
  });


  it("should reject refinance borrower offer (amount < debt)", async function () {
    const _borrower = await kettle.connect(borrower);

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
    }, borrower).then(s => executeCreateSteps(borrower, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    await expect(_refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s))).to.be.revertedWithCustomError(_kettle, "InsufficientAskAmount");
  })

  it("refinancer should refinance borrower offer", async function () {
    const _borrower = await kettle.connect(borrower);

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
    }, borrower).then(s => executeCreateSteps(borrower, s));

    const _refinancer = await kettle.connect(refinancer);
    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    await _refinancer.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, refinancer).then(s => executeTakeSteps(refinancer, s));

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  });

  it("should reject refinance lender offer (taker != borrower)", async function () {
    const _refinancer = await kettle.connect(refinancer);

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
    }, refinancer).then(s => executeCreateSteps(refinancer, s));

    await currency.mint(refinancer, offer.terms.amount);

    const _lender = await kettle.connect(lender);

    await expect(_lender.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, lender).then(s => executeTakeSteps(lender, s))).to.be.revertedWithCustomError(_kettle, "TakerIsNotBorrower");
  })

  it("borrower should take refinance offer (debt < offer)", async function () {
    const _refinancer = await kettle.connect(refinancer);

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
    }, refinancer).then(s => executeCreateSteps(refinancer, s));

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = await kettle.connect(borrower);

    await _borrower.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, borrower).then(s => executeTakeSteps(borrower, s));

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })

  it("borrower should take refinance offer (principal + interest < offer < debt)", async function () {
    const _refinancer = await kettle.connect(refinancer);

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
    }, refinancer).then(s => executeCreateSteps(refinancer, s));

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = await kettle.connect(borrower);

    await _borrower.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      lien,
      offer: offer as LoanOffer,
      signature
    }, borrower).then(s => executeTakeSteps(borrower, s));

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })

  it("borrower should take refinance offer (offer < principal + interest)", async function () {
    const _refinancer = await kettle.connect(refinancer);

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
    }, refinancer).then(s => executeCreateSteps(refinancer, s));

    await currency.mint(refinancer, offer.terms.amount);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    const _borrower = await kettle.connect(borrower);

    await _borrower.takeLoanOffer({
      tokenId: lien.tokenId,
      lienId,
      amount: offer.terms.amount,
      lien,
      offer,
      signature
    }, borrower).then(s => executeTakeSteps(borrower, s));

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await currency.balanceOf(refinancer)).to.equal(0);
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);

    const netBorrowerAmount = BigInt(offer.terms.amount) - BigInt(finalDebt);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore + netBorrowerAmount);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  })
});

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { LendingController, TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, getReceipt, parseLienOpenedLog, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, LoanOffer, Side } from "../src";
import { DAY_SECONDS, executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Fulfill Loan Offer", function () {
  let _kettle: KettleContract;
  let _lending: LendingController;
  let kettle: Kettle;

  let lender: Signer;
  let borrower: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: number = 1;
  let amount: bigint = parseUnits("100", 18);

  let root: string;
  let tokens: number[];

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    _lending = fixture.lending;
    lender = fixture.accounts[0];
    borrower = fixture.accounts[1];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    kettle = new Kettle(borrower, await _kettle.getAddress());

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    await collection.mint(borrower, tokenId);
    await currency.mint(lender, amount);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await borrower.getAddress()] = "borrower";
    tracer.nameTags[await lender.getAddress()] = "lender";
  })
  
  it("lender should take borrow offer", async function () {
    const _borrower = await kettle.connect(borrower);

    const { offer, signature } = await _borrower.createLoanOffer({
      side: Side.ASK,
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

    const _lender = await kettle.connect(lender);

    // should reject if tokenId does not match identifier
    await expect(_lender.takeLoanOffer({
      tokenId: tokenId + 1,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidToken");

    // should reject if soft is true
    await expect(_lender.takeLoanOffer({
      tokenId,
      offer: { ...offer, soft: true } as LoanOffer, 
      signature,
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "CannotTakeSoftOffer");

    const txnHash = await _lender.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps);

    const receipt = await getReceipt(txnHash);
    const { lienId } = parseLienOpenedLog(receipt);

    expect(await collection.ownerOf(tokenId)).to.equal(_lending);
    expect(await currency.balanceOf(lender)).to.equal(0);
    expect(await currency.balanceOf(borrower)).to.equal(amount);

    expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
    expect(await _lending.currentLender(lienId)).to.equal(lender);
  });

  it("borrower should take loan offer (SIMPLE)", async function () {
    const _lender = await kettle.connect(lender);

    const { offer, signature } = await _lender.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: tokenId,
      amount,
      minAmount: amount / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _borrower = await kettle.connect(borrower);

    // should reject if tokenId does not match identifier
    await expect(_borrower.takeLoanOffer({
      tokenId: tokenId + 1,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidToken");

    // should reject if amount is too high
    await expect(_borrower.takeLoanOffer({
      tokenId,
      amount: BigInt(offer.terms.amount) * 2n,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidLoanAmount");

    // should reject if amount is too low
    await expect(_borrower.takeLoanOffer({
      tokenId,
      amount: 0,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidLoanAmount");
    
    await _borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature
    }).then(executeTakeSteps);

    expect(await collection.ownerOf(tokenId)).to.equal(_lending);
    expect(await currency.balanceOf(lender)).to.equal(0);
    expect(await currency.balanceOf(borrower))
      .to.equal(amount)
      .to.equal(offer.terms.amount);

    // expect full offer amount to be taken
    const offerHash = await kettle.hashLoanOffer(offer as LoanOffer);
    expect(await _kettle.amountTaken(offerHash)).to.equal(offer.terms.amount);

    // should revert if offer is already taken
    await expect(_borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature,
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InsufficientOffer");
  });

  it("should take bid offer (PROOF)", async function () {
    const _lender = await kettle.connect(lender);

    const { offer, signature } = await _lender.createLoanOffer({
      side: Side.BID,
      collection,
      currency,
      criteria: Criteria.PROOF,
      identifier: root,
      amount,
      minAmount: amount / 2n,
      fee: 250,
      recipient,
      rate: 1000,
      defaultRate: 2000,
      duration: DAY_SECONDS * 30,
      gracePeriod: DAY_SECONDS * 30,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _borrower = await kettle.connect(borrower);

    // should reject if proof is not provided
    await expect(_borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature,
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidCriteria");

    const proof = generateProof(tokens, tokenId);

    // should reject if proof is invalid
    await expect(_borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature,
      proof: [randomSalt(), randomSalt(), randomSalt()]
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InvalidCriteria");

    await _borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature,
      proof
    }).then(executeTakeSteps);

    expect(await collection.ownerOf(tokenId)).to.equal(_lending);
    expect(await currency.balanceOf(lender)).to.equal(0);
    expect(await currency.balanceOf(borrower))
      .to.equal(amount)
      .to.equal(offer.terms.amount);

    // expect full offer amount to be taken
    const offerHash = await kettle.hashLoanOffer(offer as LoanOffer);
    expect(await _kettle.amountTaken(offerHash)).to.equal(offer.terms.amount);

    // should revert if offer is already taken
    await expect(_borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature,
      proof
    }).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InsufficientOffer");
  });
});

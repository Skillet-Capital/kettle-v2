import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { LenderReceipt, LendingController, TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, getReceipt, parseLienOpenedLog, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, Lien, LoanOffer, MarketOffer, Numberish, Side } from "../src";
import { DAY_SECONDS, executeCreateSteps, executeRepaySteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Repay Lien", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;
  let _lending: LendingController;
  let _receipt: LenderReceipt;

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
    _receipt = fixture.receipt;
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
    }).then(executeCreateSteps);

    const _borrower = await kettle.connect(borrower);

    const txnHash = await _borrower.takeLoanOffer(
      tokenId,
      offer.terms.amount,
      offer as LoanOffer, 
      signature
    ).then(executeTakeSteps);

    const receipt = await getReceipt(txnHash);
    ({ lienId, lien } = parseLienOpenedLog(receipt));
  });

  it("should reject if lien is defaulted", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + BigInt(1));

    const _borrower = await kettle.connect(borrower);
    await expect(_borrower.repay(lienId, lien).then(executeRepaySteps)).to.be.revertedWithCustomError(_lending, "LienIsDefaulted");
  });

  it("should reject if lien is invalid", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + BigInt(1));

    const _borrower = await kettle.connect(borrower);
    await expect(_borrower.repay(BigInt(lienId) + 1n, lien).then(executeRepaySteps)).to.be.revertedWithCustomError(_lending, "InvalidLien");
  });

  it("should repay lien", async function () {
    const _borrower = await kettle.connect(borrower);

    const { debt } = await _borrower.currentDebt(lien);
    await currency.mint(borrower, _borrower.safeFactorMul(debt, 100));

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    await _borrower.repay(lienId, lien).then(executeRepaySteps);
    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await collection.ownerOf(lien.tokenId)).to.equal(borrower);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore - BigInt(finalDebt));
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  });

  it("should repay to current lender", async function () {
    const _borrower = await kettle.connect(borrower);

    await _receipt.connect(lender).transferFrom(lender, refinancer, lienId);

    const { debt } = await _borrower.currentDebt(lien);
    await currency.mint(borrower, _borrower.safeFactorMul(debt, 100));

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    await _borrower.repay(lienId, lien).then(executeRepaySteps);
    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrower.currentDebt(lien);

    expect(await collection.ownerOf(lien.tokenId)).to.equal(borrower);
    expect(await currency.balanceOf(borrower)).to.equal(borrowerBalanceBefore - BigInt(finalDebt));
    expect(await currency.balanceOf(recipient)).to.equal(finalFee);
    expect(await currency.balanceOf(refinancer)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
  });
});

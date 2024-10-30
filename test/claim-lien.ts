import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { LenderReceipt, LendingController, TestERC20, TestERC721 } from "../typechain-types"; 

import { generateRoot, getReceipt, parseLienOpenedLog } from "../src/utils";
import { Kettle, KettleContract, Lien, LoanOffer, Numberish, Side } from "../src";
import { DAY_SECONDS, executeClaimSteps, executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

describe("Claim Lien", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;
  let _lending: LendingController;
  let _receipt: LenderReceipt;

  let borrower: Signer;
  let lender: Signer;
  let newLender: Signer;
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
    newLender = fixture.accounts[2];
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
    tracer.nameTags[await newLender.getAddress()] = "newLender";

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
    }, lender).then((s) => executeCreateSteps(lender, s));

    const _borrower = await kettle.connect(borrower);

    const txnHash = await _borrower.takeLoanOffer({
      tokenId,
      offer: offer as LoanOffer, 
      signature
    }, borrower).then(s => executeTakeSteps(borrower, s));

    const receipt = await getReceipt(borrower.provider!, txnHash);
    ({ lienId, lien } = parseLienOpenedLog(receipt));
  });

  it("should reject if lien is not defaulted", async function () {
    const _borrower = await kettle.connect(borrower);
    await expect(
      _borrower.claim(lienId, lien).then(s => executeClaimSteps(borrower, s))
    ).to.be.revertedWithCustomError(_lending, "LienIsCurrent");
  });

  it("should reject if lien is invalid", async function () {
    const _borrower = await kettle.connect(borrower);
    await expect(
      _borrower.claim(BigInt(lienId) + 1n, lien).then(s => executeClaimSteps(borrower, s))
    ).to.be.revertedWithCustomError(_lending, "InvalidLien");
  });

  it("should claim lien", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + BigInt(1));

    const _lender = await kettle.connect(lender);

    await _lender.claim(lienId, lien).then(s => executeClaimSteps(lender, s));

    expect(await collection.ownerOf(lien.tokenId)).to.equal(lender);
  });

  it("should claim to current lender", async function () {
    await time.increase(BigInt(lien.duration) + BigInt(lien.gracePeriod) + BigInt(1));

    await _receipt.connect(lender).transferFrom(lender, newLender, lienId);

    const _lender = await kettle.connect(newLender);

    await _lender.claim(lienId, lien).then(s => executeClaimSteps(lender, s));

    expect(await collection.ownerOf(lien.tokenId)).to.equal(newLender);
  });
});

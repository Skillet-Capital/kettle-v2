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

  let buyer: Signer;
  let seller: Signer;
  let lender: Signer;
  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: number = 1;
  let amount: bigint = parseUnits("100", 18);

  let root: string;
  let tokens: number[];

  let lienId: Numberish;
  let lien: Lien;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    buyer = fixture.accounts[0];
    seller = fixture.accounts[1];
    lender = fixture.accounts[2];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    kettle = new Kettle(seller, await _kettle.getAddress());

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await buyer.getAddress()] = "buyer";
    tracer.nameTags[await seller.getAddress()] = "seller";
    tracer.nameTags[await lender.getAddress()] = "lender";

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

    const _seller = await kettle.connect(seller);

    const txnHash = await _seller.takeLoanOffer(
      tokenId,
      offer.terms.amount,
      offer as LoanOffer, 
      signature
    ).then(executeTakeSteps);

    const receipt = await getReceipt(txnHash);
    ({ lienId, lien } = parseLienOpenedLog(receipt));

    await time.increase(BigInt(lien.duration) / 2n)
  });

  it("buyer should reject ask (offer < debt)", async function () {
    const _seller = await kettle.connect(seller);

    const { debt } = await _seller.currentDebt(lien);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: BigInt(debt) / 2n,
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _buyer = await kettle.connect(buyer);

    await expect(_buyer.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "InsufficientAskAmount");
  });
  
  it("buyer should take ask in lien", async function () {
    const _seller = await kettle.connect(seller);

    const { debt } = await _seller.currentDebt(lien);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(debt, 1000),
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _buyer = await kettle.connect(buyer);

    await currency.mint(buyer, offer.terms.amount);

    const sellerBalanceBefore = await currency.balanceOf(seller);

    // should reject if soft is true
    await expect(_buyer.takeMarketOfferInLien(
      lienId,
      lien,
      { ...offer, soft: true } as MarketOffer, 
      signature,
    ).then(executeTakeSteps)).to.be.revertedWithCustomError(_kettle, "CannotTakeSoftOffer");

    await _buyer.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _seller.currentDebt(lien);

    const marketFee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    
    expect(await collection.ownerOf(lien.tokenId)).to.equal(buyer);

    expect(await currency.balanceOf(recipient)).to.equal(marketFee + BigInt(finalFee));

    // lender gets paid back principal and interest
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));

    // seller gets the net amount of the market offer less the debt
    expect(await currency.balanceOf(seller)).to.equal((sellerBalanceBefore + BigInt(offer.terms.amount) - marketFee - BigInt(finalDebt)));
  });

  it("buyer should take ask in lien (buyer = lender)", async function () {
    const _seller = await kettle.connect(seller);

    const { debt } = await _seller.currentDebt(lien);

    const { offer, signature } = await _seller.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(debt, 1000),
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    const _buyer = await kettle.connect(lender);

    const marketFee = kettle.mulFee(offer.terms.amount, offer.fee.rate);
    await currency.mint(lender, offer.terms.amount);

    const buyerBalanceBefore = await currency.balanceOf(lender);
    const sellerBalanceBefore = await currency.balanceOf(seller);

    await _buyer.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _seller.currentDebt(lien);
    
    expect(await collection.ownerOf(lien.tokenId)).to.equal(lender);

    expect(await currency.balanceOf(recipient)).to.equal(marketFee + BigInt(finalFee));

    // lender just pays the difference between what they are owed and the ask amount
    const lenderOwed = BigInt(lien.principal) + BigInt(finalInterest);
    expect(await currency.balanceOf(lender)).to.equal(buyerBalanceBefore - (BigInt(offer.terms.amount) - lenderOwed));

    // seller gets the net amount of the market offer less the debt
    expect(await currency.balanceOf(seller)).to.equal((sellerBalanceBefore + BigInt(offer.terms.amount) - marketFee - BigInt(finalDebt)));
  });

  it("seller should take bid in lien (debt < offer)", async function () {
    const _buyer = await kettle.connect(buyer);

    const { debt } = await _buyer.currentDebt(lien);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(debt, 1000),
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(buyer, offer.terms.amount);

    const sellerBalanceBefore = await currency.balanceOf(seller);

    const _seller = await kettle.connect(seller);
    await _seller.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _seller.currentDebt(lien);
    const marketFee = kettle.mulFee(offer.terms.amount, offer.fee.rate);

    expect(await collection.ownerOf(lien.tokenId)).to.equal(buyer);
    expect(await currency.balanceOf(recipient)).to.equal(marketFee + BigInt(finalFee));
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
    expect(await currency.balanceOf(seller)).to.equal(sellerBalanceBefore + BigInt(offer.terms.amount) - marketFee - BigInt(finalDebt));

  });

  it("seller should take bid in lien (principal + interest < offer < debt)", async function () {
    const _buyer = await kettle.connect(buyer);

    const { interest } = await _buyer.currentDebt(lien);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(BigInt(lien.principal) + BigInt(interest), 100),
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(buyer, offer.terms.amount);

    const sellerBalanceBefore = await currency.balanceOf(seller);

    const _seller = await kettle.connect(seller);
    await _seller.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _seller.currentDebt(lien);
    const marketFee = kettle.mulFee(offer.terms.amount, offer.fee.rate);

    expect(await collection.ownerOf(lien.tokenId)).to.equal(buyer);
    expect(await currency.balanceOf(recipient)).to.equal(marketFee + BigInt(finalFee));
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
    expect(await currency.balanceOf(seller)).to.equal(sellerBalanceBefore + BigInt(offer.terms.amount) - marketFee - BigInt(finalDebt));
  });

  it("seller should take bid in lien (offer < principal + interest)", async function () {
    const _buyer = await kettle.connect(buyer);

    const { interest } = await _buyer.currentDebt(lien);

    const { offer, signature } = await _buyer.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: kettle.safeFactorMul(BigInt(lien.principal) + BigInt(interest), 100),
      fee: 250,
      recipient,
      expiration: await time.latest() + 60
    }).then(executeCreateSteps);

    await currency.mint(seller, offer.terms.amount);
    await currency.mint(buyer, offer.terms.amount);

    const sellerBalanceBefore = await currency.balanceOf(seller);

    const _seller = await kettle.connect(seller);
    await _seller.takeMarketOfferInLien(
      lienId,
      lien,
      offer as MarketOffer,
      signature
    ).then(executeTakeSteps);

    const { debt: finalDebt, interest: finalInterest, fee: finalFee } = await _seller.currentDebt(lien);
    const marketFee = kettle.mulFee(offer.terms.amount, offer.fee.rate);

    expect(await collection.ownerOf(lien.tokenId)).to.equal(buyer);
    expect(await currency.balanceOf(recipient)).to.equal(marketFee + BigInt(finalFee));
    expect(await currency.balanceOf(lender)).to.equal(BigInt(lien.principal) + BigInt(finalInterest));
    expect(await currency.balanceOf(seller)).to.equal(sellerBalanceBefore + BigInt(offer.terms.amount) - marketFee - BigInt(finalDebt));
  });
});

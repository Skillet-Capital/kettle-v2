import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { TestERC20, TestERC721 } from "../typechain-types"; 

import { generateRoot, getReceipt, parseEscrowOpenedLog, randomSalt } from "../src/utils";
import { EscrowStruct, Kettle, KettleContract, MarketOffer, Numberish, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";
import { EscrowController } from "../typechain-types";
import { BYTES_ZERO } from "../src/constants";

describe("Settle Escrow", function () {
  let kettle: Kettle;

  let _kettle: KettleContract;
  let _escrow: EscrowController;

  let owner: Signer;
  let buyer: Signer;
  let seller: Signer;
  let recipient: Signer;

  let tokenSupplier: Signer;
  let redemptionAdmin: Signer;
  let redemptionWallet: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  let tokenId: string = randomSalt();
  let amount: bigint = parseUnits("100", 18);

  let root: string;
  let tokens: number[];

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    _escrow = fixture.escrow;
    buyer = fixture.accounts[0];
    seller = fixture.accounts[1];
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    owner = fixture.owner;
    tokenSupplier = fixture.tokenSupplier;
    redemptionAdmin = fixture.redemptionAdmin;
    redemptionWallet = fixture.redemptionWallet;

    kettle = new Kettle(seller, await _kettle.getAddress());

    tokens = [1,2,3,4,5];
    root = generateRoot(tokens);

    await collection.mint(seller, tokenId);
    await currency.mint(buyer, amount);

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await buyer.getAddress()] = "buyer";
    tracer.nameTags[await seller.getAddress()] = "seller";
  });

  describe("Escrow Without Redemption", async function () {
    let escrowId: Numberish;
    let escrow: EscrowStruct;

    beforeEach(async () => {
      const _seller = await kettle.connect(seller);
      const _buyer = await kettle.connect(buyer);
  
      const { offer, signature } = await _seller.createMarketOffer({
        soft: true,
        side: Side.ASK,
        collection,
        currency,
        identifier: tokenId,
        amount,
        fee: 250,
        rebate: 100,
        recipient,
        expiration: await time.latest() + 60
      }, seller).then(s => executeCreateSteps(seller, s));
  
      const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
      await currency.mint(seller, rebateAmount);
  
      await _escrow.whitelistedAskMaker(seller, true);
  
      const txn = await _buyer.escrowMarketOffer({
        offer: offer as MarketOffer, 
        signature
      }, buyer).then(s => executeTakeSteps(buyer, s));
  
      expect(await currency.balanceOf(_kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

      const receipt = await getReceipt(buyer.provider!, txn);
      ({ escrowId, escrow } = parseEscrowOpenedLog(receipt));

      expect(escrow.side).to.equal(Side.ASK);
      expect(escrow.placeholder).to.equal(tokenId);
      expect(escrow.buyer).to.equal(buyer);
      expect(escrow.seller).to.equal(seller);
      expect(escrow.collection).to.equal(collection);
      expect(escrow.identifier).to.equal(tokenId);
      expect(escrow.currency).to.equal(currency);
      expect(escrow.amount).to.equal(offer.terms.amount);
      expect(escrow.fee).to.equal(offer.fee.rate);
      expect(escrow.rebate).to.equal(rebateAmount);
      expect(escrow.recipient).to.equal(recipient);
      expect(escrow.withRedemption).to.equal(false);
      expect(escrow.redemptionHash).to.equal(BYTES_ZERO);
      expect(escrow.redemptionCharge).to.equal(0);
    });

    it("should settle escrow", async function () {
      const settlementTokenId = 42;
      await collection.mint(tokenSupplier, settlementTokenId);

      await kettle.connect(owner).settleEscrow(settlementTokenId, escrowId, escrow).then(s => executeTakeSteps(owner, s));

      expect(await collection.ownerOf(settlementTokenId)).to.equal(buyer);

      const feeAmount = kettle.mulFee(escrow.amount, escrow.fee);
      const netAmount = BigInt(escrow.amount) - feeAmount;

      expect(await currency.balanceOf(seller)).to.equal(netAmount + BigInt(escrow.rebate));
      expect(await currency.balanceOf(recipient)).to.equal(feeAmount);

      expect(await currency.balanceOf(_kettle)).to.equal(0);
    });

    it("should reject escrow", async function () {
      await kettle.connect(owner).rejectEscrow(escrowId, escrow, false).then(s => executeTakeSteps(owner, s));

      expect(await currency.balanceOf(seller)).to.equal(0);
      expect(await currency.balanceOf(recipient)).to.equal(0);
      expect(await currency.balanceOf(_kettle)).to.equal(0);

      expect(await currency.balanceOf(buyer)).to.equal(BigInt(escrow.amount) + BigInt(escrow.rebate));
    });

    it("should reject escrow (return rebate)", async function () {
      await kettle.connect(owner).rejectEscrow(escrowId, escrow, true).then(s => executeTakeSteps(owner, s));

      expect(await currency.balanceOf(recipient)).to.equal(0);
      expect(await currency.balanceOf(_kettle)).to.equal(0);

      expect(await currency.balanceOf(seller)).to.equal(BigInt(escrow.rebate));
      expect(await currency.balanceOf(buyer)).to.equal(BigInt(escrow.amount));
    });
  });

  describe("Escrow With Redemption", async function () {
    let escrowId: Numberish;
    let escrow: EscrowStruct;

    beforeEach(async () => {
      const _seller = await kettle.connect(seller);
      const _buyer = await kettle.connect(buyer);
  
      const { offer, signature } = await _seller.createMarketOffer({
        soft: true,
        side: Side.ASK,
        collection,
        currency,
        identifier: tokenId,
        amount,
        fee: 250,
        rebate: 100,
        recipient,
        expiration: await time.latest() + 60
      }, seller).then(s => executeCreateSteps(seller, s));
  
      const rebateAmount = _seller.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
      await currency.mint(seller, rebateAmount);

      const chargeAmount = parseUnits("100", 18);
      const signStep = await kettle.connect(redemptionAdmin).createRedemptionCharge({
        redeemer: buyer,
        collection,
        tokenId,
        currency,
        amount: chargeAmount,
        expiration: await time.latest() + 100
      });
  
      const { charge, signature: chargeSignature } = await signStep.sign(redemptionAdmin);  
      await currency.mint(buyer, chargeAmount);
  
      await _escrow.whitelistedAskMaker(seller, true);
  
      const txn = await _buyer.escrowMarketOffer({
        offer: offer as MarketOffer, 
        signature,
        redemptionCharge: charge,
        redemptionChargeSignature: chargeSignature
      }, buyer).then(s => executeTakeSteps(buyer, s));
  
      expect(await currency.balanceOf(_kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount + chargeAmount);

      const receipt = await getReceipt(buyer.provider!, txn);
      ({ escrowId, escrow } = parseEscrowOpenedLog(receipt));

      const redemptionHash = await _kettle.hashRedemptionCharge(redemptionAdmin, charge);

      expect(escrow.side).to.equal(Side.ASK);
      expect(escrow.placeholder).to.equal(tokenId);
      expect(escrow.buyer).to.equal(buyer);
      expect(escrow.seller).to.equal(seller);
      expect(escrow.collection).to.equal(collection);
      expect(escrow.identifier).to.equal(tokenId);
      expect(escrow.currency).to.equal(currency);
      expect(escrow.amount).to.equal(offer.terms.amount);
      expect(escrow.fee).to.equal(offer.fee.rate);
      expect(escrow.rebate).to.equal(rebateAmount);
      expect(escrow.recipient).to.equal(recipient);
      expect(escrow.withRedemption).to.equal(true);
      expect(escrow.redemptionHash).to.equal(redemptionHash);
      expect(escrow.redemptionCharge).to.equal(chargeAmount);
    });

    it("should settle escrow", async function () {
      const settlementTokenId = 42;
      await collection.mint(tokenSupplier, settlementTokenId);

      await kettle.connect(owner).settleEscrow(settlementTokenId, escrowId, escrow).then(s => executeTakeSteps(owner, s));

      expect(await collection.ownerOf(settlementTokenId)).to.equal(redemptionWallet);

      const feeAmount = kettle.mulFee(escrow.amount, escrow.fee);
      const netAmount = BigInt(escrow.amount) - feeAmount;

      expect(await currency.balanceOf(seller)).to.equal(netAmount + BigInt(escrow.rebate));
      expect(await currency.balanceOf(recipient)).to.equal(feeAmount);

      expect(await currency.balanceOf(redemptionWallet)).to.equal(escrow.redemptionCharge);
      expect(await currency.balanceOf(_kettle)).to.equal(0);
    });

    it("should reject escrow", async function () {
      await kettle.connect(owner).rejectEscrow(escrowId, escrow, false).then(s => executeTakeSteps(owner, s));

      expect(await currency.balanceOf(seller)).to.equal(0);
      expect(await currency.balanceOf(recipient)).to.equal(0);
      expect(await currency.balanceOf(_kettle)).to.equal(0);

      expect(await currency.balanceOf(buyer)).to.equal(BigInt(escrow.amount) + BigInt(escrow.rebate) + BigInt(escrow.redemptionCharge));
    });

    it("should reject escrow (return rebate)", async function () {
      await kettle.connect(owner).rejectEscrow(escrowId, escrow, true).then(s => executeTakeSteps(owner, s));

      expect(await currency.balanceOf(recipient)).to.equal(0);
      expect(await currency.balanceOf(_kettle)).to.equal(0);

      expect(await currency.balanceOf(seller)).to.equal(BigInt(escrow.rebate));
      expect(await currency.balanceOf(buyer)).to.equal(BigInt(escrow.amount) + BigInt(escrow.redemptionCharge));
    });
  });
});

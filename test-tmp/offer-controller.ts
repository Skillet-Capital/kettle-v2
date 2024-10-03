import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, upgrades } from "hardhat";

import { expect } from "chai";
import { parseUnits, randomBytes } from "ethers";

import { Kettle, MarketOffer, OfferWithSignature, Side } from "../src";
import { deployKettle } from "./fixture";
import { randomSalt } from "../src/utils";
import { OfferController, OfferController__factory, TestOfferController } from "../typechain-types";

describe("Offer Controller", function () {
  // describe("offer verification", function () {
    async function deployTestOfferController() {
      const { kettle, recipient, currency, collection, owner, accounts } = await deployKettle();
  
      const OfferController = await ethers.getContractFactory("TestOfferController");
      const offerController = await upgrades.deployProxy(OfferController, [], { initializer: "initialize" });

      // const offerController = OfferController__factory.connect(await offerControllerProxy.getAddress(), owner) as OfferController;

      return { kettle, recipient, currency, collection, owner, accounts, offerController };
    }

    it("should verify and take market offer", async function () {
      const { kettle, offerController, accounts, collection, currency, recipient } = await loadFixture(deployTestOfferController);

      const [maker] = accounts;

      const _makerKettle = new Kettle(maker, await offerController.getAddress());
      const makeSteps = await _makerKettle.createMarketOffer({
        side: Side.ASK,
        collection,
        currency,
        identifier: 1,
        amount: parseUnits("100", 18),
        fee: 250,
        recipient,
        expiration: await time.latest() + 10
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

      expect(await offerController.cancelledOrFulfilled(maker, offer.salt)).to.equal(0);
      await offerController.takeMarketOffer(offer as MarketOffer, signature);
      expect(await offerController.cancelledOrFulfilled(maker, offer.salt)).to.equal(1);
    });

    it("should reject if market offer signature is invalid", async function () {
      const { kettle, offerController, accounts, collection, currency, recipient } = await loadFixture(deployTestOfferController);

      const [maker] = accounts;

      const _makerKettle = new Kettle(maker, await offerController.getAddress());
      const makeSteps = await _makerKettle.createMarketOffer({
        side: Side.ASK,
        collection,
        currency,
        identifier: 1,
        amount: parseUnits("100", 18),
        fee: 250,
        recipient,
        expiration: await time.latest() + 10
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

      const SIG = ethers.Signature.from(signature);
      const v = SIG.v;
      const r = SIG.r;
      const s = SIG.s;

      const badVParamSignature = ethers.concat([
        ethers.zeroPadValue(r, 32), // r must be padded to 32 bytes
        ethers.zeroPadValue(s, 32), // s must be padded to 32 bytes
        ethers.zeroPadValue(ethers.toBeHex(1), 1) // v must be exactly 1 byte
      ]);
      
      await expect(offerController.takeMarketOffer(offer as MarketOffer, badVParamSignature)).to.be.revertedWithCustomError(offerController, "InvalidVParameter");
      await expect(offerController.takeMarketOffer({ ...offer, salt: randomSalt() } as MarketOffer, signature)).to.be.revertedWithCustomError(offerController, "InvalidSignature");

    });

    it("should reject if market offer is expired", async function () {
      const { kettle, offerController, accounts, collection, currency, recipient } = await loadFixture(deployTestOfferController);

      const [maker] = accounts;

      const _makerKettle = new Kettle(maker, await offerController.getAddress());
      const makeSteps = await _makerKettle.createMarketOffer({
        side: Side.ASK,
        collection,
        currency,
        identifier: 1,
        amount: parseUnits("100", 18),
        fee: 250,
        recipient,
        expiration: 0
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

      await expect(offerController.takeMarketOffer(offer as MarketOffer, signature)).to.be.revertedWith("OfferExpired");
    });

    it("should reject if market offer is cancelled", async function () {
      const { kettle, offerController, accounts, collection, currency, recipient } = await loadFixture(deployTestOfferController);

      const [maker] = accounts;

      const _makerKettle = new Kettle(maker, await offerController.getAddress());
      const makeSteps = await _makerKettle.createMarketOffer({
        side: Side.ASK,
        collection,
        currency,
        identifier: 1,
        amount: parseUnits("100", 18),
        fee: 250,
        recipient,
        expiration: await time.latest() + 10
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
      
      await offerController.connect(maker).cancelOffers([offer.salt]);
      await expect(offerController.takeMarketOffer(offer as MarketOffer, signature)).to.be.revertedWith("OfferUnavailable");
    });
  // })

  // describe("offer control", function () {
  //   async function deployOfferController() {
  //     const [owner, ...accounts] = await ethers.getSigners();
  
  //     const OfferController = await ethers.getContractFactory("OfferController");
  //     const offerControllerProxy = await upgrades.deployProxy(OfferController, [], { 
  //       initializer: "__OfferController_init" 
  //     });
  
  //     const offerController = OfferController__factory.connect(await offerControllerProxy.getAddress(), owner);
  
  //     return { owner, accounts, offerController };
  //   }

    it("should cancel offer", async function () {
      const { offerController, owner, accounts } = await loadFixture(deployTestOfferController);
  
      const [maker] = accounts;
  
      const salt = randomSalt();
  
      expect(await offerController.cancelledOrFulfilled(maker, salt)).to.equal(0);
      await offerController.connect(maker).cancelOffer(salt);
      expect(await offerController.cancelledOrFulfilled(maker, salt)).to.equal(1);
  
      const salts = [randomSalt(), randomSalt(), randomSalt()];
      for (const _salt of salts) {
        expect(await offerController.cancelledOrFulfilled(maker, _salt)).to.equal(0);
      }
  
      await offerController.connect(maker).cancelOffers(salts);
      for (const _salt of salts) {
        expect(await offerController.cancelledOrFulfilled(maker, _salt)).to.equal(1);
      }
    })
  
    it("should cancel offer for user", async function () {
      const { offerController, owner, accounts } = await loadFixture(deployTestOfferController);
  
      const [maker] = accounts;
  
      const salt = randomSalt();
  
      expect(await offerController.cancelledOrFulfilled(maker, salt)).to.equal(0);
      await offerController.connect(owner).cancelOffersForUser(maker, [salt]);
      expect(await offerController.cancelledOrFulfilled(maker, salt)).to.equal(1);
    });
  
    it("should increment nonce", async function () {
      const { offerController, owner, accounts } = await loadFixture(deployTestOfferController);
  
      const [maker] = accounts;
  
      const salt = randomSalt();
  
      expect(await offerController.nonces(maker)).to.equal(0);
      await offerController.connect(maker).incrementNonce();
      expect(await offerController.nonces(maker)).to.equal(1);
    });
  // })
});

import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits } from "ethers";

import { Kettle, MarketOffer, OfferWithSignature, PermitWithSignature, Side } from "../src";
import { deployKettle } from "./fixture";
import { getReceipt, parseEscrowOpenedLog, randomSalt } from "../src/utils";
import { ADDRESS_ZERO } from "../src/constants";
import { upgrades, ethers } from "hardhat";

describe("Escrow Buy (take ask)", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should take escrow ask (NO REBATE)", async function () {
    const { owner, kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);


    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 0
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

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(offer.terms.amount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);

    // should not settle if attacker calls
    await expect(kettle.connect(attacker).settleEscrow(escrowId, 1, escrow, ADDRESS_ZERO))
      .to.be.reverted;

    // should settle if owner calls
    await kettle.connect(owner).settleEscrow(escrowId, 1, escrow, ADDRESS_ZERO);

    expect(await collection.ownerOf(1)).to.equal(taker);

    const feeAmount = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(feeAmount);
    expect(await currency.balanceOf(maker)).to.equal(BigInt(offer.terms.amount) - feeAmount);
  });

  it("should take escrow ask (WITH REBATE)", async function () {
    const { owner, kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 100
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

    const rebateAmount = _makerKettle.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(maker, rebateAmount);

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);
    expect(escrow.rebate).to.equal(rebateAmount);

    // should not settle if attacker calls
    await expect(kettle.connect(attacker).settleEscrow(escrowId, 1, escrow, ADDRESS_ZERO))
      .to.be.reverted;

    // should not settle if invalid escrow
    await expect(kettle.connect(owner).settleEscrow(2, 1, escrow, ADDRESS_ZERO))
      .to.be.revertedWith("InvalidEscrow");

    // should settle if owner calls
    await kettle.connect(owner).settleEscrow(escrowId, 1, escrow, ADDRESS_ZERO);

    expect(await collection.ownerOf(1)).to.equal(taker);

    const feeAmount = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(feeAmount);
    expect(await currency.balanceOf(maker)).to.equal(BigInt(offer.terms.amount) + rebateAmount - feeAmount);
  });

  it("should take and reject escrow", async function () {
    const { owner, kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 100
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

    const rebateAmount = _makerKettle.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(maker, rebateAmount);

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);
    expect(escrow.rebate).to.equal(rebateAmount);

    // should not settle if attacker calls
    await expect(kettle.connect(attacker).rejectEscrow(escrowId, escrow))
      .to.be.reverted;

    // should not settle if invalid escrow
    await expect(kettle.connect(owner).rejectEscrow(2, escrow))
      .to.be.revertedWith("InvalidEscrow");

    // should settle if owner calls
    await kettle.connect(owner).rejectEscrow(escrowId, escrow);

    expect(await currency.balanceOf(taker)).to.equal(BigInt(offer.terms.amount) + rebateAmount);
  });

  it("should take and reject escrow and return rebate", async function () {
    const { owner, kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 100
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

    const rebateAmount = _makerKettle.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(maker, rebateAmount);

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);
    expect(escrow.rebate).to.equal(rebateAmount);

    // should not settle if attacker calls
    await expect(kettle.connect(attacker).rejectEscrowReturnRebate(escrowId, escrow))
      .to.be.reverted;

    // should not settle if invalid escrow
    await expect(kettle.connect(owner).rejectEscrowReturnRebate(2, escrow))
      .to.be.revertedWith("InvalidEscrow");

    // should settle if owner calls
    await kettle.connect(owner).rejectEscrowReturnRebate(escrowId, escrow);

    expect(await currency.balanceOf(taker)).to.equal(BigInt(offer.terms.amount));
    expect(await currency.balanceOf(maker)).to.equal(rebateAmount);
  })

  it("should claim escrow after lock time", async function () {
    const { owner, kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 100
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

    const rebateAmount = _makerKettle.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(maker, rebateAmount);

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);
    expect(escrow.rebate).to.equal(rebateAmount);

    // should not be able to claim if escrow is still locked
    await expect(kettle.connect(taker).claimEscrow(escrowId, escrow))
      .to.be.revertedWith("EscrowLocked");

    await time.increaseTo(BigInt(escrow.timestamp) + BigInt(escrow.lockTime) + 1n);

    // should not settle if invalid escrow
    await expect(kettle.connect(taker).claimEscrow(2, escrow))
      .to.be.revertedWith("InvalidEscrow");

    // should settle if owner calls
    await kettle.connect(taker).claimEscrow(escrowId, escrow);

    expect(await currency.balanceOf(taker)).to.equal(BigInt(offer.terms.amount) + rebateAmount);
  });

  it("should be able to mint from factory", async function () {
    const { owner, kettle, recipient, currency, accounts } = await loadFixture(deployKettle);

    const KettleAsset = await ethers.getContractFactory("KettleAsset");
    const implementation = await KettleAsset.deploy();
    
    const Factory = await ethers.getContractFactory("KettleAssetFactory");
    const factory = await upgrades.deployProxy(Factory, [
      await owner.getAddress(), 
      await implementation.getAddress()
    ], { initializer: 'initialize' });

    const salt = randomSalt();

    const collectionAddress = await factory.getDeploymentAddress(salt);
    await factory.deployAsset(salt, "BRAND", "MODEL", "REF");

    const collection = KettleAsset.attach(collectionAddress);

    const [maker, taker, attacker] = accounts;

    await kettle.connect(owner).setWhitelistSeller(maker, true);

    const _makerKettle = new Kettle(maker, await kettle.getAddress());
    const makeSteps = await _makerKettle.createMarketOffer({
      side: Side.ASK,
      collection,
      currency,
      identifier: randomSalt(),
      amount: parseUnits("100", 18),
      fee: 250,
      recipient,
      expiration: await time.latest() + DAY_SECONDS,
      rebate: 100
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

    const rebateAmount = _makerKettle.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);
    await currency.mint(maker, rebateAmount);

    await currency.mint(taker, offer.terms.amount);

    const _takerKettle = new Kettle(taker, await kettle.getAddress());
    const takeSteps = await _takerKettle.escrowMarketOffer(offer as MarketOffer, signature);

    let txnHash: string | null = null;
    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        txnHash = await step.take();
      }
    }

    if (!txnHash) {
      throw new Error("Transaction not sent");
    }

    const receipt = await getReceipt(txnHash);
    const { escrowId, escrow } = parseEscrowOpenedLog(receipt);

    expect(await currency.balanceOf(taker)).to.equal(0);
    expect(await currency.balanceOf(maker)).to.equal(0);
    expect(await currency.balanceOf(kettle)).to.equal(BigInt(offer.terms.amount) + rebateAmount);

    // check log
    expect(escrow.seller).to.equal(maker);
    expect(escrow.buyer).to.equal(taker);
    expect(escrow.currency).to.equal(currency);
    expect(escrow.collection).to.equal(collection);
    expect(escrow.rebate).to.equal(rebateAmount);

    // should not settle if attacker calls
    await expect(kettle.connect(attacker).settleEscrow(escrowId, 1, escrow, factory))
      .to.be.reverted;

    // should not settle if invalid escrow
    await expect(kettle.connect(owner).settleEscrow(2, 1, escrow, factory))
      .to.be.revertedWith("InvalidEscrow");

    // should reject settle if escrow is not minter
    await expect(kettle.connect(owner).settleEscrow(escrowId, 1, escrow, factory))
      .to.be.reverted;

    await factory.connect(owner).setRole(await factory.MINTER_ROLE(), kettle, true);

    await kettle.connect(owner).settleEscrow(escrowId, 1, escrow, factory);

    expect(await collection.ownerOf(1)).to.equal(taker);

    const feeAmount = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
    expect(await currency.balanceOf(recipient)).to.equal(feeAmount);
    expect(await currency.balanceOf(maker)).to.equal(BigInt(offer.terms.amount) + rebateAmount - feeAmount);
  })

  // it("should take ask offer", async function () {
  //   const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

  //   const tokenId = 1;
  //   const amount = parseUnits("100", 18);

  //   const [maker, taker] = accounts;

  //   await collection.mint(maker, tokenId);
  //   await currency.mint(taker, amount);

  //   const _makerKettle = new Kettle(maker, await kettle.getAddress());
  //   const makeSteps = await _makerKettle.createMarketOffer({
  //     side: Side.ASK,
  //     collection,
  //     currency,
  //     identifier: tokenId,
  //     amount,
  //     fee: 250,
  //     recipient,
  //     expiration: await time.latest() + DAY_SECONDS
  //   });

  //   let output: OfferWithSignature | null = null;
  //   for (const step of makeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     } else if (step.type === "create") {
  //       output = await step.create();
  //     }
  //   }

  //   const { offer, signature } = output || {};

  //   if (!offer || !signature) {
  //     throw new Error("Offer not created");
  //   }

  //   const _takerKettle = new Kettle(taker, await kettle.getAddress());
  //   const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature);

  //   for (const step of takeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     } else if (step.type === "take") {
  //       await step.take();
  //     }
  //   }

  //   expect(await collection.ownerOf(tokenId)).to.equal(taker);

  //   expect(await currency.balanceOf(taker)).to.equal(0);

  //   const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
  //   expect(await currency.balanceOf(recipient)).to.equal(fee);
  //   expect(await currency.balanceOf(maker)).to.equal(amount - fee);
  // });

  // it("should take ask offer (PERMIT)", async function () {
  //   const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

  //   const tokenId = 1;
  //   const amount = parseUnits("100", 18);

  //   const [maker, taker] = accounts;

  //   await collection.mint(maker, tokenId);
  //   await currency.mint(taker, amount);

  //   const _makerKettle = new Kettle(maker, await kettle.getAddress());
  //   const makeSteps = await _makerKettle.createMarketOffer({
  //     side: Side.ASK,
  //     collection,
  //     currency,
  //     identifier: tokenId,
  //     amount,
  //     fee: 250,
  //     recipient,
  //     expiration: await time.latest() + DAY_SECONDS
  //   });

  //   let output: OfferWithSignature | null = null;
  //   for (const step of makeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     } else if (step.type === "create") {
  //       output = await step.create();
  //     }
  //   }

  //   const { offer, signature } = output || {};

  //   if (!offer || !signature) {
  //     throw new Error("Offer not created");
  //   }

  //   const _takerKettle = new Kettle(taker, await kettle.getAddress());

  //   const permitSteps = await _takerKettle.createPermit("market", offer as MarketOffer);
    
  //   let permitOutput: PermitWithSignature | null = null;
  //   for (const step of permitSteps) {
  //     if (step.type === "permit") {
  //       permitOutput = await step.permit();
  //     }
  //   }

  //   const { permit, signature: permitSignature } = permitOutput || {};

  //   if (!permit || !permitSignature) {
  //     throw new Error("Permit not created");
  //   }
    
  //   const takeSteps = await _takerKettle.takeMarketOffer(tokenId, offer as MarketOffer, signature);

  //   for (const step of takeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     }
  //   }

  //   const account = accounts[accounts.length - 1];
  //   await kettle.connect(account).buyWithPermit(offer as MarketOffer, permit, signature, permitSignature);

  //   expect(await collection.ownerOf(tokenId)).to.equal(taker);

  //   expect(await currency.balanceOf(taker)).to.equal(0);

  //   const fee = _takerKettle.mulFee(offer.terms.amount, offer.fee.rate);
  //   expect(await currency.balanceOf(recipient)).to.equal(fee);
  //   expect(await currency.balanceOf(maker)).to.equal(amount - fee);
  // })

  // it("should reject taking ask offer (INVALID PERMIT)", async function () {
  //   const { kettle, recipient, currency, collection, accounts } = await loadFixture(deployKettle);

  //   const tokenId = 1;
  //   const amount = parseUnits("100", 18);

  //   const [maker, taker] = accounts;

  //   await collection.mint(maker, tokenId);
  //   await currency.mint(taker, amount);

  //   const _makerKettle = new Kettle(maker, await kettle.getAddress());
  //   const makeSteps = await _makerKettle.createMarketOffer({
  //     side: Side.ASK,
  //     collection,
  //     currency,
  //     identifier: tokenId,
  //     amount,
  //     fee: 250,
  //     recipient,
  //     expiration: await time.latest() + DAY_SECONDS
  //   });

  //   let output: OfferWithSignature | null = null;
  //   for (const step of makeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     } else if (step.type === "create") {
  //       output = await step.create();
  //     }
  //   }

  //   const { offer, signature } = output || {};

  //   if (!offer || !signature) {
  //     throw new Error("Offer not created");
  //   }

  //   const _takerKettle = new Kettle(taker, await kettle.getAddress());

  //   const permitSteps = await _takerKettle.createPermit("market", offer as MarketOffer);
    
  //   let permitOutput: PermitWithSignature | null = null;
  //   for (const step of permitSteps) {
  //     if (step.type === "permit") {
  //       permitOutput = await step.permit();
  //     }
  //   }

  //   const { permit, signature: permitSignature } = permitOutput || {};

  //   if (!permit || !permitSignature) {
  //     throw new Error("Permit not created");
  //   }

  //   await expect(kettle.connect(taker).buyWithPermit(offer as MarketOffer, { ...permit, offerHash: randomSalt() }, signature, permitSignature))
  //     .to.be.revertedWith("InvalidPermitOfferHash");
  // })
});

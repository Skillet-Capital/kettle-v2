import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits, Signer } from "ethers";
import { tracer } from "hardhat";

import { Criteria, Kettle, KettleContract, Lien, LienStruct, LoanOffer, MarketOffer, Numberish, OfferWithSignature, Side } from "../src";
import { generateProof, generateRoot, getReceipt, parseLienOpenedLog } from "../src/utils";
import { deployKettle } from "./fixture";
import { LenderReceipt, TestERC20, TestERC721 } from "../typechain-types";
import { ADDRESS_ZERO } from "../src/constants";

const DAY_SECONDS = 60 * 60 * 24;

describe("Sell In Lien (Take Bid)", function () {
  const delta = parseUnits("1", 2) // within 100 wei;

  let lien: Lien;
  let lienId: Numberish;

  let kettle: KettleContract;
  let lenderReceipt: LenderReceipt;

  let lender: Signer;
  let borrower: Signer;
  let buyer: Signer;

  let recipient: Signer;
  let accounts: Signer[];
  
  let currency: TestERC20;
  let currency2: TestERC20;

  let collection: TestERC721;
  let collection2: TestERC721;

  beforeEach(async function () {
    ({ kettle, receipt: lenderReceipt, recipient, currency, currency2, collection, collection2, accounts } = await loadFixture(deployKettle));

    const tokenId = 1;
    const amount = parseUnits("100", 18);

    [lender, borrower, buyer] = accounts;

    tracer.nameTags[await recipient.getAddress()] = "recipient";
    tracer.nameTags[await lender.getAddress()] = "lender";
    tracer.nameTags[await borrower.getAddress()] = "borrower";
    tracer.nameTags[await buyer.getAddress()] = "buyer";

    await currency.mint(lender, amount);
    await collection.mint(borrower, tokenId);

    const _makerKettle = new Kettle(lender, await kettle.getAddress());
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

    const _takerKettle = new Kettle(borrower, await kettle.getAddress());
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

  it("should take bid in lien (debt > netAmount) (BUYER NOT LENDER)", async function () {

    await time.increase(BigInt(lien.duration) / 2n);

    const _buyerKettle = new Kettle(buyer, await kettle.getAddress());
    const makeSteps = await _buyerKettle.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: lien.principal,
      fee: 250,
      recipient,
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

    await currency.mint(buyer, offer.terms.amount);

    const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
    const takeSteps = await _borrowerKettle.takeMarketOfferInLien(lienId, lien, offer as MarketOffer, signature);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    let finalDebt: Numberish = 0n;
    let finalInterest: Numberish = 0n;
    let finalFee: Numberish = 0n;

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        const blockTime = (await time.latest());
        
        ({ debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrowerKettle.currentDebt(lien as Lien));

        await time.setNextBlockTimestamp(blockTime);
        await step.take();
      }
    }

    // check fee transfer
    const totalFees = BigInt(finalFee) + BigInt(_borrowerKettle.mulFee(offer.terms.amount, 250));
    expect(await currency.balanceOf(recipient))
      .to.be.closeTo(totalFees, delta);

    // check lender balance
    expect(await currency.balanceOf(lender))
      .to.be.closeTo(BigInt(lien.principal) + BigInt(finalInterest), delta);

    // check buyer balance
    expect(await collection.ownerOf(lien.tokenId)).to.equal(buyer);
    expect(await currency.balanceOf(buyer))
      .to.be.closeTo(0n, delta);

    // check borrower balance
    const netAmount = BigInt(offer.terms.amount) - _buyerKettle.mulFee(offer.terms.amount, 250);
    expect(await currency.balanceOf(borrower))
      .to.be.closeTo(borrowerBalanceBefore + netAmount - BigInt(finalDebt), delta);

    await expect(lenderReceipt.ownerOf(lienId)).to.be.revertedWith("NOT_MINTED");
  });

  it("should take bid in lien (debt > netAmount) (BUYER IS LENDER)", async function () {

    await time.increase(BigInt(lien.duration) / 2n);

    const _buyerKettle = new Kettle(lender, await kettle.getAddress());
    const makeSteps = await _buyerKettle.createMarketOffer({
      side: Side.BID,
      collection,
      currency,
      identifier: lien.tokenId,
      amount: lien.principal,
      fee: 250,
      recipient,
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

    const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
    const takeSteps = await _borrowerKettle.takeMarketOfferInLien(lienId, lien, offer as MarketOffer, signature);

    const borrowerBalanceBefore = await currency.balanceOf(borrower);

    let finalDebt: Numberish = 0n;
    let finalInterest: Numberish = 0n;
    let finalFee: Numberish = 0n;

    console.log(await currency.balanceOf(lender));

    for (const step of takeSteps) {
      if (step.type === "approval") {
        await step.approve();
      } else if (step.type === "take") {
        const blockTime = (await time.latest());
        
        ({ debt: finalDebt, interest: finalInterest, fee: finalFee } = await _borrowerKettle.currentDebt(lien as Lien));

        console.log({
          debt: finalDebt,
          interest: finalInterest,
          fee: finalFee
        })

        // lender only needs to have enough to fund the fee
        const offerFee = _buyerKettle.mulFee(offer.terms.amount, 250);
        await currency.mint(lender, offerFee);
        console.log(await currency.balanceOf(lender));

        await time.setNextBlockTimestamp(blockTime);
        await step.take();
      }
    }

    console.log(finalInterest)
    console.log(await currency.balanceOf(lender));

    // check fee transfer
    const totalFees = BigInt(finalFee) + BigInt(_borrowerKettle.mulFee(offer.terms.amount, 250));
    expect(await currency.balanceOf(recipient))
      .to.be.closeTo(totalFees, delta);

    // check lender balance
    expect(await collection.ownerOf(lien.tokenId)).to.equal(lender);

    const netAmount = BigInt(offer.terms.amount) - _buyerKettle.mulFee(offer.terms.amount, 250);
    expect(await currency.balanceOf(lender))
      .to.be.closeTo(BigInt(lien.principal) - netAmount + BigInt(finalInterest), delta);

    // check buyer balance
    expect(await currency.balanceOf(borrower))
      .to.be.closeTo(borrowerBalanceBefore - (totalFees + BigInt(finalInterest)), delta);

    await expect(lenderReceipt.ownerOf(lienId)).to.be.revertedWith("NOT_MINTED");
  });

  // it("should take ask in lien (BUYER IS LENDER)", async function () {

  //   await time.increase(BigInt(lien.duration) / 2n);
  //   const { debt } = await kettle.computeDebt(lien as Lien);

  //   const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());

  //   const makeSteps = await _borrowerKettle.createMarketOffer({
  //     side: Side.ASK,
  //     collection,
  //     currency,
  //     identifier: lien.tokenId,
  //     amount: debt * 2n,
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

  //   const _buyerKettle = new Kettle(lender, await kettle.getAddress());
  //   const takeSteps = await _buyerKettle.takeMarketOfferInLien(lienId, lien, offer as MarketOffer, signature);

  //   const borrowerBalanceBefore = await currency.balanceOf(borrower);

  //   let finalDebt: Numberish = 0n;
  //   let finalInterest: Numberish = 0n;
  //   let finalFee: Numberish = 0n;

  //   for (const step of takeSteps) {
  //     if (step.type === "approval") {
  //       await step.approve();
  //     } else if (step.type === "take") {
  //       const blockTime = (await time.latest());
        
  //       ({ debt: finalDebt, interest: finalInterest, fee: finalFee } = await _buyerKettle.currentDebt(lien as Lien));

  //       // lender only needs to have enough funds to cover the diff between amount and owed
  //       await time.setNextBlockTimestamp(blockTime);
  //       await currency.mint(lender, BigInt(offer.terms.amount) - (BigInt(lien.principal) + BigInt(finalInterest)));

  //       await time.setNextBlockTimestamp(blockTime);
  //       await step.take();
  //     }
  //   }

  //   // check fee transfer
  //   const totalFees = BigInt(finalFee) + BigInt(_borrowerKettle.mulFee(offer.terms.amount, 250));
  //   expect(await currency.balanceOf(recipient))
  //     .to.be.closeTo(totalFees, delta);

  //   // check lender balance
  //   expect(await collection.ownerOf(lien.tokenId)).to.equal(lender);
  //   expect(await currency.balanceOf(lender))
  //     .to.be.closeTo(0, delta);

  //   // check borrower balance
  //   const netAmount = BigInt(offer.terms.amount) - _buyerKettle.mulFee(offer.terms.amount, 250);
  //   expect(await currency.balanceOf(borrower))
  //     .to.be.closeTo(borrowerBalanceBefore + netAmount - BigInt(finalDebt), delta);

  //   await expect(lenderReceipt.ownerOf(lienId)).to.be.revertedWith("NOT_MINTED");
  // });

  // describe("rejections", () => {
  //   it("should revert if lien is defaulted", async function () {

  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(lender, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency,
  //       identifier: lien.tokenId,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await time.increase(BigInt(lien.duration) * 3n);
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("LienIsDefaulted");  
  //   });
  
  //   it("should revert if lien is invalid", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(lender, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency,
  //       identifier: lien.tokenId,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await time.increase(BigInt(lien.duration) * 3n);
  //     await expect(kettle.connect(buyer).buyInLien(5, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("InvalidLien");  
  //   });
  
  //   it("should revert if lien.borrower != offer.maker", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(lender, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency,
  //       identifier: lien.tokenId,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("AskMakerIsNotBorrower");  
  //   });
  
  //   it("should revert if lien.currency != offer.currency", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency: currency2,
  //       identifier: lien.tokenId,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("CurrencyMismatch");  
  //   });
  
  //   it("should revert if lien.collection != offer.collection", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection: collection2,
  //       currency,
  //       identifier: lien.tokenId,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("CollectionMismatch");  
  //   });
  
  //   it("should revert if lien.tokenId != offer.identifier", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency,
  //       identifier: BigInt(lien.tokenId) + 1n,
  //       amount: debt * 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
  
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("TokenMismatch");  
  //   });
  
  //   it("should revert if debt > offer.amount", async function () {
  
  //     await time.increase(BigInt(lien.duration) / 2n);
  //     const { debt } = await kettle.computeDebt(lien as Lien);
  
  //     const _borrowerKettle = new Kettle(borrower, await kettle.getAddress());
  
  //     const makeSteps = await _borrowerKettle.createMarketOffer({
  //       side: Side.ASK,
  //       collection,
  //       currency,
  //       identifier: lien.tokenId,
  //       amount: debt / 2n,
  //       fee: 250,
  //       recipient,
  //       expiration: await time.latest() + DAY_SECONDS
  //     });
  
  //     let output: OfferWithSignature | null = null;
  //     for (const step of makeSteps) {
  //       if (step.type === "approval") {
  //         await step.approve();
  //       } else if (step.type === "create") {
  //         output = await step.create();
  //       }
  //     }
  
  //     const { offer, signature } = output || {};
  
  //     if (!offer || !signature) {
  //       throw new Error("Offer not created");
  //     }
      
  //     await currency.mint(buyer, offer.terms.amount);
  //     await currency.connect(buyer).approve(kettle, offer.terms.amount)
  
  //     await expect(kettle.connect(buyer).buyInLien(lienId, lien, offer as MarketOffer, signature))
  //       .to.be.revertedWith("InsufficientAskAmount");  
  //   });
  // })
});

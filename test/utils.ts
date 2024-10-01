import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits, hexlify, randomBytes } from "ethers";

import { Kettle, Lien, MarketOffer, OfferWithSignature, PermitWithSignature, Side } from "../src";
import { deployKettle } from "./fixture";
import { randomSalt } from "../src/utils";

const randomAddress = () => hexlify(randomBytes(20));

const DAY_SECONDS = 60 * 60 * 24;

describe("Utils", function () {
  const DAY_SECONDS = 60 * 60 * 24;

  it("should compute the debt the same", async function () {
    const { kettle } = await loadFixture(deployKettle);

    const lien: Lien = {
      borrower: randomAddress(),
      collection: randomAddress(),
      currency: randomAddress(),
      recipient: randomAddress(),
      tokenId: "1",
      principal: parseUnits("100", 18),
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
      fee: 250,
      startTime: await time.latest(),
    }

    await time.increase(DAY_SECONDS * 365);

    const { debt, interest, fee } = kettle.computeDebt(lien);
    const { debt: debt2, interest: interest2, fee: fee2 } = kettle.computeDebtAtTimestamp(lien, BigInt(lien.startTime) + BigInt(DAY_SECONDS * 365));

    expect(debt).to.equal(debt2);
    expect(interest).to.equal(interest2);
    expect(fee).to.equal(fee2);
  });

  it("should hash lien the same as sdk", async function () {
    const { owner, kettle } = await loadFixture(deployKettle);

    const lien: Lien = {
      borrower: randomAddress(),
      collection: randomAddress(),
      currency: randomAddress(),
      recipient: randomAddress(),
      tokenId: "1",
      principal: parseUnits("100", 18),
      rate: 1000,
      defaultRate: 2000,
      duration: 30 * DAY_SECONDS,
      gracePeriod: 30 * DAY_SECONDS,
      fee: 250,
      startTime: await time.latest(),
    }

    const hash = await kettle.hashLien(lien);
    const hash2 = new Kettle(owner, await kettle.getAddress()).hashLien(lien);

    expect(hash).to.equal(hash2);
  });
});

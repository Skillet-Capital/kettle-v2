import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

import { expect } from "chai";
import { parseUnits } from "ethers";

const DAY_SECONDS = 60 * 60 * 24;

function accruedInterest(principal: number, rate: number, duration: number, units = 18) {
  return (principal * Math.pow(Math.E, rate * duration / (DAY_SECONDS * 365)) - 1).toFixed(units);
}

describe("Debt Calculations", function () {
  const delta = parseUnits("1", 9) // within 1 gwei;

  async function deployCompoundInterest() {
    const CompoundInterest = await ethers.getContractFactory("TestCompoundInterest");
    const compoundInterest = await CompoundInterest.deploy();

    return { compoundInterest };
  }

  it("should calculate debt", async function () {
    const { compoundInterest } = await loadFixture(deployCompoundInterest);

    const timestamp = DAY_SECONDS * 365;

    const principal = parseUnits("1", 18);
    const feeRate = 500;
    const rate = 1000;
    const defaultRate = 2000;
    const duration = timestamp;

    const { debt, interest, fee } = await compoundInterest.computeDebt(timestamp, principal, 0, duration, feeRate, rate, defaultRate);

    const interestAccrued = accruedInterest(1, rate / 10_000, duration);
    const feeAccrued = accruedInterest(1, feeRate / 10_000, duration);

    expect(interest).to.be.closeTo(parseUnits(interestAccrued, 18), delta);
    expect(fee).to.be.closeTo(parseUnits(feeAccrued, 18), delta);
    expect(debt).to.equal(principal + interest + fee);
  });

  it("should calculate delinquent debt", async function () {
    const { compoundInterest } = await loadFixture(deployCompoundInterest);

    const timestamp = DAY_SECONDS * 365;

    const principal = parseUnits("1", 18);
    const feeRate = 500;
    const rate = 1000;
    const defaultRate = 2000;
    const duration = timestamp / 2;

    const { debt, interest, fee } = await compoundInterest.computeDebt(timestamp, principal, 0, duration, feeRate, rate, defaultRate);

    const interestAccrued = accruedInterest(1, rate / 10_000, duration);
    const defaultedInterestAccrued = accruedInterest(1 + parseFloat(interestAccrued), defaultRate / 10_000, timestamp - duration);

    const feeAccrued = accruedInterest(1, feeRate / 10_000, timestamp);

    expect(interest).to.be.closeTo(parseUnits(defaultedInterestAccrued), delta);
    expect(fee).to.be.closeTo(parseUnits(feeAccrued, 18), delta);
    expect(debt).to.equal(principal + interest + fee);
  });

  it("should calculate debt with any units", async function () {
    const { compoundInterest } = await loadFixture(deployCompoundInterest);

    const timestamp = DAY_SECONDS * 365;

    const principal = parseUnits("1", 6);
    const feeRate = 500;
    const rate = 1000;
    const defaultRate = 2000;
    const duration = timestamp;

    const { debt, interest, fee } = await compoundInterest.computeDebt(timestamp, principal, 0, duration, feeRate, rate, defaultRate);

    const interestAccrued = accruedInterest(1, rate / 10_000, duration, 9);
    const feeAccrued = accruedInterest(1, feeRate / 10_000, duration, 9);

    expect(interest).to.be.closeTo(parseUnits(interestAccrued, 9), delta);
    expect(fee).to.be.closeTo(parseUnits(feeAccrued, 9), delta);
    expect(debt).to.equal(principal + interest + fee);
  })

  it("should max out debt calculations", async function () {
    const { compoundInterest } = await loadFixture(deployCompoundInterest);

    const timestamp = DAY_SECONDS * 365;

    const principal = parseUnits("1", 18);
    const feeRate = 500;
    const rate = 1_000_000; // 9000%
    const duration = timestamp;

    await expect(compoundInterest.computeDebt(timestamp, principal, 0, duration, feeRate, rate, 0)).to.be.reverted;
  })
});

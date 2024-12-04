import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

import { ethers, upgrades } from "hardhat";
import { Kettle__factory, TestERC20__factory, TestERC721__factory } from "../typechain-types";

export async function deployKettle() {
  const [owner, recipient, tokenSupplier, redemptionAdmin, redemptionWallet, ...accounts] = await ethers.getSigners();

  // Deploy Kettle
  const Kettle = await ethers.getContractFactory("Kettle");
  const _kettle = await upgrades.deployProxy(Kettle, [
    await owner.getAddress(),
  ], { initializer: "__Kettle_init" });

  // initialize signers
  await _kettle.setTokenSupplier(tokenSupplier);
  await _kettle.setRedemptionAdmin(redemptionAdmin);
  await _kettle.setRedemptionWallet(redemptionWallet);
  await _kettle.setRedemptionFeeCollector(redemptionWallet);

  // Deploy test currencies and assets
  const _currency = await ethers.deployContract("TestERC20", [18]);
  const _currency2 = await ethers.deployContract("TestERC20", [18]);
  const _collection = await ethers.deployContract("TestERC721");
  const _collection2 = await ethers.deployContract("TestERC721");

  // initialize contracts
  const currency = TestERC20__factory.connect(await _currency.getAddress(), owner);
  const currency2 = TestERC20__factory.connect(await _currency2.getAddress(), owner);
  const collection = TestERC721__factory.connect(await _collection.getAddress(), owner);
  const collection2 = TestERC721__factory.connect(await _collection2.getAddress(), owner);

  const kettle = Kettle__factory.connect(await _kettle.getAddress(), owner);

  await collection.connect(tokenSupplier).setApprovalForAll(_kettle, true);
  await collection2.connect(tokenSupplier).setApprovalForAll(_kettle, true);

  return { owner, accounts, recipient, kettle, currency, currency2, collection, collection2, redemptionAdmin, redemptionWallet, tokenSupplier };
}

describe("Deployment", async () => {
  it("should deploy Kettle", async () => {
    const { owner, kettle } = await loadFixture(deployKettle);
    
    expect(await kettle.owner()).to.equal(owner);
  });

  it("should access setters", async () => {
    const { kettle } = await loadFixture(deployKettle);

    await kettle.setLockTime(100);
    expect(await kettle.lockTime()).to.equal(100);

    const randomWallet = ethers.Wallet.createRandom();
    await kettle.whitelistBidTaker(randomWallet, true);
    expect(await kettle.whitelistedBidTakers(randomWallet.address)).to.equal(true);
  });

  it("should protect access", async () => {
    const { kettle, accounts } = await loadFixture(deployKettle);
    const [random] = accounts;

    await expect(kettle.connect(random).setLockTime(100)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");
    await expect(kettle.connect(random).whitelistBidTaker(random, true)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");
    await expect(kettle.connect(random).whitelistAskMaker(random, true)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");

    await expect(kettle.connect(random).setTokenSupplier(random)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");;
    await expect(kettle.connect(random).setRedemptionAdmin(random)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");;
    await expect(kettle.connect(random).setRedemptionWallet(random)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");;
    await expect(kettle.connect(random).setRedemptionFeeCollector(random)).to.be.revertedWithCustomError(kettle, "OwnableUnauthorizedAccount");;
  })
});

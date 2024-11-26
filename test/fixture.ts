import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

import { ethers, upgrades } from "hardhat";
import { EscrowController__factory, Kettle__factory, LenderReceipt__factory, LendingController__factory, TestERC20__factory, TestERC721__factory } from "../typechain-types";

export async function deployKettle() {
  const [owner, recipient, tokenSupplier, redemptionAdmin, redemptionWallet, ...accounts] = await ethers.getSigners();

  // Deploy Lender Receipt
  const _receipt = await ethers.deployContract("LenderReceipt");

  // Deploy Lending Controller
  const LendingController = await ethers.getContractFactory("LendingController");
  const _lending = await upgrades.deployProxy(LendingController, [
    await owner.getAddress(),
    await _receipt.getAddress()
  ], { initializer: "__LendingController_init" });

  await _receipt.setSupplier(_lending, 1);

  // Deploy Escrow Controller
  const EscrowController = await ethers.getContractFactory("EscrowController");
  const _escrow = await upgrades.deployProxy(EscrowController, [
    await owner.getAddress(),
  ], { initializer: "__EscrowController_init" });

  // Deploy Redemption Controller
  const RedemptionController = await ethers.getContractFactory("RedemptionController");
  const _redemption = await upgrades.deployProxy(RedemptionController, [
    await owner.getAddress(),
    await redemptionAdmin.getAddress(),
    await redemptionWallet.getAddress(),
  ], { initializer: "__RedemptionController_init" });

  // Deploy Kettle
  const Kettle = await ethers.getContractFactory("Kettle");
  const _kettle = await upgrades.deployProxy(Kettle, [
    await owner.getAddress(),
    await _lending.getAddress(),
    await _escrow.getAddress(),
    await _redemption.getAddress(),
  ], { initializer: "__Kettle_init" });

  // Set Kettle in Lending Controller
  await _lending.setKettle(_kettle);
  await _escrow.setKettle(_kettle);

  await _escrow.setTokenSupplier(tokenSupplier);

  // Deploy test currencies and assets
  const _currency = await ethers.deployContract("TestERC20", [18]);
  const _currency2 = await ethers.deployContract("TestERC20", [18]);

  const _collection = await ethers.deployContract("TestERC721");
  const _collection2 = await ethers.deployContract("TestERC721");

  await _collection.connect(tokenSupplier).setApprovalForAll(_kettle, true);

  const receipt = LenderReceipt__factory.connect(await _receipt.getAddress(), owner);
  const currency = TestERC20__factory.connect(await _currency.getAddress(), owner);
  const currency2 = TestERC20__factory.connect(await _currency2.getAddress(), owner);
  const collection = TestERC721__factory.connect(await _collection.getAddress(), owner);
  const collection2 = TestERC721__factory.connect(await _collection2.getAddress(), owner);

  const kettle  =   Kettle__factory.connect(await _kettle.getAddress(), owner);
  const lending =   LendingController__factory.connect(await _lending.getAddress(), owner);
  const escrow  =   EscrowController__factory.connect(await _escrow.getAddress(), owner);

  return { owner, accounts, recipient, kettle, lending, escrow, receipt, currency, currency2, collection, collection2, redemptionAdmin, redemptionWallet, tokenSupplier };
}

describe("Deployment", function () {
  it("should deploy", async function () {
    const { owner, kettle, lending, escrow } = await loadFixture(deployKettle);

    expect(await kettle.owner()).to.equal(owner);
    expect(await lending.owner()).to.equal(owner);

    expect(await kettle.LENDING_CONTROLLER()).to.equal(await lending.getAddress());
    expect(await kettle.ESCROW_CONTROLLER()).to.equal(await escrow.getAddress());
  })
});

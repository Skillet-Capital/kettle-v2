import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

import { ethers, upgrades } from "hardhat";
import { EscrowController__factory, Kettle__factory, LendingController__factory, TransferConduit__factory } from "../typechain-types";

export async function deployKettle() {
  const [owner, recipient, ...accounts] = await ethers.getSigners();

  // Deploy Factory Contract
  const Create2Factory = await ethers.getContractFactory("Create2Factory");
  const factory = await Create2Factory.deploy();

  // Deploy Transfer Conduit
  const Conduit = await ethers.getContractFactory("TransferConduit");
  const _conduit = await Conduit.deploy();

  // Deploy Lender Receipt
  const receipt = await ethers.deployContract("LenderReceipt");

  // Deploy Lending Controller
  const LendingController = await ethers.getContractFactory("LendingController");
  const _lending = await upgrades.deployProxy(LendingController, [
    await _conduit.getAddress(),
    await receipt.getAddress(),
    await owner.getAddress(),
  ], { initializer: "__LendingController_init" });

  await receipt.setSupplier(_lending, 1);

  // Deploy Escrow Controller
  const EscrowController = await ethers.getContractFactory("EscrowController");
  const _escrow = await upgrades.deployProxy(EscrowController, [
    await owner.getAddress(),
  ], { initializer: "__EscrowController_init" });

  // Deploy Kettle
  const Kettle = await ethers.getContractFactory("Kettle");
  const _kettle = await upgrades.deployProxy(Kettle, [
    await _conduit.getAddress(),
    await _lending.getAddress(),
    await _escrow.getAddress(),
    await owner.getAddress(),
  ], { initializer: "__Kettle_init" });

  // Set Kettle in Lending Controller
  await _lending.setKettle(_kettle);
  await _escrow.setKettle(_kettle);

  // set conduit channels
  await _conduit.updateChannel(_kettle, true);
  await _conduit.updateChannel(_lending, true);

  // deploy test currencies and collections
  const currency = await ethers.deployContract("TestERC20", [18]);
  const currency2 = await ethers.deployContract("TestERC20", [18]);

  const collection = await ethers.deployContract("TestERC721");
  const collection2 = await ethers.deployContract("TestERC721");

  const kettle  =   Kettle__factory.connect(await _kettle.getAddress(), owner);
  const conduit =   TransferConduit__factory.connect(await _conduit.getAddress(), owner);
  const lending =   LendingController__factory.connect(await _lending.getAddress(), owner);
  const escrow  =   EscrowController__factory.connect(await _escrow.getAddress(), owner);

  return { owner, accounts, recipient, kettle, lending, escrow, conduit, receipt, currency, currency2, collection, collection2 };
}

describe("Deployment", function () {
  it("should deploy", async function () {
    const { owner, kettle, lending, conduit } = await loadFixture(deployKettle);

    expect(await kettle.owner()).to.equal(owner);
    expect(await lending.owner()).to.equal(owner);
    expect(await conduit.owner()).to.equal(owner);

    expect(await kettle.conduit()).to.equal(conduit);
    expect(await lending.conduit()).to.equal(conduit);

    expect(await conduit.channelOpen(kettle)).to.equal(true);
    expect(await conduit.channelOpen(lending)).to.equal(true);
  })
});

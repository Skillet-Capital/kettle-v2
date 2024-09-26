import { ethers, upgrades } from "hardhat";
import { Kettle__factory } from "../typechain-types";

export async function deployKettle() {
  const [owner, recipient, ...accounts] = await ethers.getSigners();

  const receipt = await ethers.deployContract("LenderReceipt");

  const Kettle = await ethers.getContractFactory("Kettle");
  const _kettle = await upgrades.deployProxy(Kettle, [await receipt.getAddress(), await owner.getAddress()], { initializer: "initialize" });

  await receipt.setSupplier(_kettle, 1)

  const currency = await ethers.deployContract("TestERC20", [18]);
  const collection = await ethers.deployContract("TestERC721");

  const kettle = Kettle__factory.connect(await _kettle.getAddress(), owner);

  return { owner, accounts, recipient, kettle, receipt, currency, collection };
}
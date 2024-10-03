import { ethers, upgrades } from "hardhat";
import { Kettle__factory } from "../typechain-types";

export async function deployKettle() {
  const [owner, recipient, ...accounts] = await ethers.getSigners();

  // Deploy Libraries
  const Distributions = await ethers.getContractFactory("Distributions");
  const distributions = await Distributions.deploy();

  const CompoundInterest = await ethers.getContractFactory("CompoundInterest");
  const compoundInterest = await CompoundInterest.deploy();

  const KettleMath = await ethers.getContractFactory("KettleMath");
  const kettleMath = await KettleMath.deploy();

  // Deploy Lending Receipt
  const receipt = await ethers.deployContract("LenderReceipt");

  // Link libraries to bytecode
  const Kettle = await ethers.getContractFactory("Kettle", {
    libraries: {
      Distributions: await distributions.getAddress(),
      CompoundInterest: await compoundInterest.getAddress(),
      KettleMath: await kettleMath.getAddress()
    }
  });

  const _kettle = await upgrades.deployProxy(Kettle, [
    await receipt.getAddress(), 
    await owner.getAddress()
  ], { initializer: "initialize", unsafeAllowLinkedLibraries: true });

  await receipt.setSupplier(_kettle, 1)

  const currency = await ethers.deployContract("TestERC20", [18]);
  const currency2 = await ethers.deployContract("TestERC20", [18]);

  const collection = await ethers.deployContract("TestERC721");
  const collection2 = await ethers.deployContract("TestERC721");

  const kettle = Kettle__factory.connect(await _kettle.getAddress(), owner);

  return { owner, accounts, recipient, kettle, receipt, currency, currency2, collection, collection2 };
}

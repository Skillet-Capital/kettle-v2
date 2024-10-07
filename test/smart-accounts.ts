import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { tracer, ethers } from "hardhat";
import { expect } from "chai";
import { parseUnits, Signer } from "ethers";

import { EntryPoint, EntryPoint__factory, SimpleAccountFactory, TestERC20, TestERC721 } from "../typechain-types"; 

import { generateProof, generateRoot, randomSalt } from "../src/utils";
import { Criteria, Kettle, KettleContract, MarketOffer, Side } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

import { deployKettle } from "./fixture";

import { toSmartAccount } from "viem/account-abstraction";
import { PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";

describe("Smart Contract Accounts", function () {
  let entryPoint: EntryPoint;
  let accountFactory: SimpleAccountFactory;

  let _kettle: KettleContract;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;

  let recipient: Signer;

  let collection: TestERC721;
  let currency: TestERC20;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    recipient = fixture.recipient;
    collection = fixture.collection;
    currency = fixture.currency;

    buyer = ethers.Wallet.createRandom(ethers.provider);
    seller = ethers.Wallet.createRandom(ethers.provider);

    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    entryPoint = await EntryPoint.deploy();

    const SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");
    accountFactory = await SimpleAccountFactory.deploy(entryPoint);
  });

  it("should create smart contract accounts", async () => {
    const buyerScaAddress = await accountFactory.getAddress(buyer, 0);
    let tx = await accountFactory.createAccount(buyer, 0);

    const buyerSCA = await ethers.getContractAt("SimpleAccount", buyerScaAddress);
    
    // const account = toSmartAccount({
    //   client: buyer,
    //   entryPoint: {
    //     address: await entryPoint.getAddress() as `0x${string}`,
    //     abi: EntryPoint__factory.abi,
    //     version: '0.7'
    //   },
    // });

    // console.log(account);
  })
});

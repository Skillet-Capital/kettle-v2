import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

import { expect } from "chai";

import { deployKettle } from "./fixture";
import { LenderReceipt } from "../typechain-types";
import { Signer } from "ethers";

describe("Lender Receipt", function () {
  let receipt: LenderReceipt;
  let owner: Signer;
  let supplier: Signer;
  let attacker: Signer;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    receipt = fixture.receipt;
    owner = fixture.owner;
    supplier = fixture.accounts[0];
    attacker = fixture.accounts[1];
  });

  it("should set roles", async function () {
    const ADMIN_ROLE = await receipt.ADMIN_ROLE();
    const SUPPLIER_ROLE = await receipt.LENDER_RECEIPT_SUPPLIER();

    expect(await receipt._roles(ADMIN_ROLE, owner)).to.equal(1);
    expect(await receipt._roles(ADMIN_ROLE, supplier)).to.equal(0);

    // set role of supplier
    await receipt.connect(owner).setRole(SUPPLIER_ROLE, supplier, 1);
    expect(await receipt._roles(SUPPLIER_ROLE, supplier)).to.equal(1);

    // remove role of supplier
    await receipt.connect(owner).setRole(SUPPLIER_ROLE, supplier, 0);
    expect(await receipt._roles(SUPPLIER_ROLE, supplier)).to.equal(0);

    // set supplier directly
    await receipt.connect(owner).setSupplier(supplier, 1);
    expect(await receipt._roles(SUPPLIER_ROLE, supplier)).to.equal(1);

    // should reject attacker
    await expect(receipt.connect(attacker).setSupplier(supplier, 1)).to.be.revertedWith("AccessControl");
    await expect(receipt.connect(attacker).setRole(SUPPLIER_ROLE, supplier, 1)).to.be.revertedWith("AccessControl");
  });

  it("should only let supplier mint", async function () {
    const ADMIN_ROLE = await receipt.ADMIN_ROLE();
    const SUPPLIER_ROLE = await receipt.LENDER_RECEIPT_SUPPLIER();

    // should reject not supplier from minting
    await expect(receipt.connect(owner).mint(supplier, 1)).to.be.revertedWith("AccessControl");

    // set role of supplier
    await receipt.connect(owner).setRole(SUPPLIER_ROLE, supplier, 1);

    // should let supplier mint
    await receipt.connect(supplier).mint(attacker, 1);
    expect(await receipt.balanceOf(attacker)).to.equal(1);

    // should reject attacker from burning
    await expect(receipt.connect(attacker).burn(1)).to.be.revertedWith("AccessControl");

    // should let supplier burn
    await receipt.connect(supplier).burn(1);
    expect(await receipt.balanceOf(attacker)).to.equal(0);
  });

  it("should set token uri", async function () {
    const tokenId = 1;
    const baseURI = "https://example.com";

    expect(await receipt.tokenURI(tokenId)).to.equal(tokenId.toString());
    await receipt.connect(owner).setBaseURI(baseURI);
    expect(await receipt.tokenURI(tokenId)).to.equal(baseURI + "/" + tokenId);
  });
});

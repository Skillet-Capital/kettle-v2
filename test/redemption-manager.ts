// import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";

// import { RedemptionManager__factory, TestERC20, TestERC721, TestERC721__factory } from "../typechain-types";
// import { deployKettle } from "./fixture";
// import { parseUnits, Signer } from "ethers";
// import { ethers, upgrades } from "hardhat";

// import { RedemptionManager, RedemptionManagerContract } from "../src";
// import { executeTakeSteps } from "./utils";

// describe.skip("Redemption Manager", function () {
//   let redemptionManager: RedemptionManager;
//   let _redemptionManager: RedemptionManagerContract;

//   let owner: Signer;
//   let admin: Signer;
//   let redemptionWallet: Signer;
//   let redeemer: Signer;

//   let currency: TestERC20;
//   let collection: TestERC721;
//   let collection2: TestERC721;


//   beforeEach(async () => {
//     const fixture = await loadFixture(deployKettle);
//     currency = fixture.currency;
//     collection = fixture.collection;
//     collection2 = fixture.collection2;

//     const accounts = fixture.accounts;
//     [owner, admin, redemptionWallet, redeemer] = accounts;

//     const RedemptionManagerFactory = await ethers.getContractFactory("RedemptionManager");
//     const __redemptionManager = await upgrades.deployProxy(RedemptionManagerFactory, [
//       await owner.getAddress(),
//       await admin.getAddress(),
//       await redemptionWallet.getAddress(),
//     ], { initializer: "initialize" });

//     _redemptionManager = await RedemptionManager__factory.connect(await __redemptionManager.getAddress(), owner);
//     redemptionManager = new RedemptionManager(owner, await _redemptionManager.getAddress());
//   });

//   it("should set roles", async function () {
//     expect(await _redemptionManager.owner()).to.equal(owner);
//     expect(await _redemptionManager.admin()).to.equal(admin);
//     expect(await _redemptionManager.redemptionWallet()).to.equal(redemptionWallet);
//   });

//   it("should sign and create redemption charge for single asset", async () => {
//     const amount = parseUnits("100", 18);
//     const tokenId = 1;

//     const signStep = await redemptionManager.createRedemptionCharge({
//       redeemer,
//       currency,
//       amount,
//       expiration: await time.latest() + 100,
//       assets: [{
//         collection,
//         tokenId
//       }]
//     });

//     const { charge, signature } = await signStep.sign(admin);
    
//     await collection.mint(redeemer, tokenId);
//     await currency.mint(redeemer, amount);


//     await redemptionManager.redeem({
//       charge,
//       signature
//     }, redeemer).then(s => executeTakeSteps(redeemer, s));

//     expect(await collection.ownerOf(tokenId)).to.equal(await _redemptionManager.redemptionWallet());
//     expect(await currency.balanceOf(await _redemptionManager.redemptionWallet())).to.equal(amount);
//     expect(await currency.balanceOf(redeemer)).to.equal(0);

//     await expect(redemptionManager.redeem({
//       charge,
//       signature
//     }, redeemer).then(s => executeTakeSteps(redeemer, s))).to.be.revertedWithCustomError(_redemptionManager, "OfferUnavailable");
//   });

//   it("should sign and create redemption charge for multiple assets", async () => {
//     const amount = parseUnits("100", 18);

//     const tokenIds = [1,2];
//     const collections = [collection, collection2];

//     const signStep = await redemptionManager.createRedemptionCharge({
//       redeemer,
//       currency,
//       amount,
//       expiration: await time.latest() + 100,
//       assets: collections.map(
//         (_collection) => tokenIds.map(
//           (tokenId) => ({ collection: _collection, tokenId })
//         )
//       ).flat()
//     });

//     const { charge, signature } = await signStep.sign(admin);
    
//     for (const asset of charge.assets) {
//       await TestERC721__factory.connect(asset.collection, owner).mint(redeemer, asset.tokenId);
//     }

//     await currency.mint(redeemer, amount);

//     await redemptionManager.redeem({
//       charge,
//       signature
//     }, redeemer).then(s => executeTakeSteps(redeemer, s));

//     expect(await currency.balanceOf(await _redemptionManager.redemptionWallet())).to.equal(amount);
//     expect(await currency.balanceOf(redeemer)).to.equal(0);

//     for (const asset of charge.assets) {
//       expect(await TestERC721__factory.connect(
//         asset.collection, owner
//       ).ownerOf(asset.tokenId)).to.equal(await _redemptionManager.redemptionWallet());
//     }
//   })
// });

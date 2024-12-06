// import {
//   LienOpened as LienOpenedEvent,
//   LienRepaid as LienRepaidEvent,
//   LienDefaulted as LienDefaultedEvent,
// } from "../generated/LendingController/LendingController";

// import {
//   Lien
// } from "../generated/schema";

// import {
//   formatLienId,
//   formatCollateralId
// } from "./helpers";

// import {
//   storeRepay,
//   storeDefault
// } from "./activity";

// export function handleLienOpened(event: LienOpenedEvent): void {
//   const lien = new Lien(formatLienId(event.address, event.params.lienId));
//   lien.lienId = event.params.lienId;
//   lien.lender = event.params.lender;
//   lien.borrower = event.params.lien.borrower;
  
//   lien.collateralId = formatCollateralId(event.params.lien.collection, event.params.lien.tokenId);
//   lien.collection = event.params.lien.collection;
//   lien.tokenId = event.params.lien.tokenId;

//   lien.currency = event.params.lien.currency;
//   lien.principal = event.params.lien.principal;
//   lien.rate = event.params.lien.rate;
//   lien.defaultRate = event.params.lien.defaultRate;
//   lien.duration = event.params.lien.duration;
//   lien.gracePeriod = event.params.lien.gracePeriod;

//   lien.recipient = event.params.lien.recipient;
//   lien.fee = event.params.lien.fee;

//   lien.startTime = event.block.timestamp;
//   lien.status = "active";
//   lien.save();
// }

// export function handleLienRepaid(event: LienRepaidEvent): void {
//   const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;
//   lien.status = "repaid";
//   lien.save();

//   storeRepay(event);
// }

// export function handleLienDefaulted(event: LienDefaultedEvent): void {
//   const lien = Lien.load(formatLienId(event.address, event.params.lienId)) as Lien;
//   lien.status = "defaulted";
//   lien.save();

//   storeDefault(event);
// }

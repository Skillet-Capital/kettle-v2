// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error InvalidLien();
error LienIsCurrent();
error LienIsDefaulted();

error TakerIsNotBorrower();
error MakerIsNotBorrower();
error InsufficientAskAmount();
error BidCannotBorrow();

error CurrencyMismatch();
error CollectionMismatch();
error TokenMismatch();

error InvalidCriteria();
error InvalidToken();

error RequiresAskSide();
error RequiresBidSide();
error RequiresNakedBidSide();

error InvalidFee();
error InvalidRate();
error InvalidLoanAmount();
error InsufficientOffer();
error InvalidPermitOfferHash();

error OfferExpired();
error OfferUnavailable();

error InvalidSignature();
error InvalidVParameter();
error ERC6492DeployFailed(bytes err);

error InvalidAssetFactory();
error SellerNotAskWhitelisted();
error SellerNotBidWhitelisted();

error InvalidEscrow();
error EscrowLocked();

error CannotTakeSoftOffer();
error CannotTakeHardOffer();

error OnlyKettle();

error InvalidMarketOffer();
error InvalidLoanOffer();

error PlaceholderAlreadyEscrowed();

error InvalidRebate();

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { LoanOffer, MarketOffer, Lien } from "../Structs.sol";

interface IKettle {
    
    // function buy(
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);

    // function sell(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function lend(
    //     LoanOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);

    // function borrow(
    //     uint256 tokenId,
    //     uint256 amount,
    //     LoanOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function refinanceLend(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     LoanOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);

    // function refinanceBorrow(
    //     uint256 lienId,
    //     uint256 amount,
    //     Lien calldata lien,
    //     LoanOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);
    
    // function repay(
    //     uint256 lienId,
    //     Lien calldata lien
    // ) external returns (uint256);

    // function claim(
    //     uint256 lienId,
    //     Lien calldata lien
    // ) external;

    // function escrowBuy(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);
    
    // function escrowSell(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function buyInLien(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);
    
    // function sellInLien(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function buyWithLoan(
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) external returns (uint256);

    // function buyInLienWithLoan(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) external returns (uint256);
}

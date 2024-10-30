// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../Structs.sol";

interface ILendingController {

    function openLien(
        uint256 tokenId,
        uint256 principal,
        address lender,
        address borrower,
        LoanOffer calldata offer
    ) external returns (uint256);

    function claimLien(uint256 lienId, Lien calldata lien) external returns (address);
    function repayLien(uint256 lienId, Lien calldata lien) external returns (address, uint256, uint256, uint256);

    event LienOpened(uint256 indexed lienId, address indexed lender, Lien lien);
    event LienRepaid(uint256 indexed lienId);
    event LienDefaulted(uint256 indexed lienId);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../Structs.sol";

interface ILendingController {

    function openLien(
        uint256 tokenId,
        uint256 principal,
        address lender,
        address borrower,
        LoanOffer calldata offer
    ) external returns (uint256);

    function closeLien(uint256 lienId) external;

    function releaseCollateral(
        IERC721 collection,
        uint256 tokenId,
        address recipient
    ) external;

    function currentLender(uint256 lienId) external view returns (address);

    function computeCurrentDebt(Lien calldata lien) external view returns (uint256 debt, uint256 fee, uint256 interest);

    function verifyLienIsCurrent(uint256 lienId, Lien calldata lien) external view;

    event LienOpened(uint256 lienId, Lien lien);
    event LienClosed(uint256 lienId);
}

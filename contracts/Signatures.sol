// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {
    Collateral,
    FeeTerms,
    LoanOfferTerms,
    LoanOffer,
    MarketOfferTerms,
    MarketOffer,
    Permit
} from "./Structs.sol";

import { SignaturesERC6492 } from "./lib/SignaturesERC6492.sol";

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Signatures is Initializable {
    bytes32 private _EIP_712_DOMAIN_TYPEHASH;
    
    bytes32 private _COLLATERAL_TYPEHASH;
    bytes32 private _FEE_TERMS_TYPEHASH;

    bytes32 private _LOAN_OFFER_TERMS_TYPEHASH;
    bytes32 private _LOAN_OFFER_TYPEHASH;

    bytes32 private _MARKET_OFFER_TERMS_TYPEHASH;
    bytes32 private _MARKET_OFFER_TYPEHASH;

    bytes32 private _PERMIT_TYPEHASH;

    string private constant _NAME = "Kettle";
    string private constant _VERSION = "1";

    mapping(address => uint256) public nonces;
    uint256[50] private _gap;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function __Signatures_init() internal initializer {
        (
            _EIP_712_DOMAIN_TYPEHASH,
            _COLLATERAL_TYPEHASH,
            _FEE_TERMS_TYPEHASH,
            _LOAN_OFFER_TERMS_TYPEHASH,
            _LOAN_OFFER_TYPEHASH,
            _MARKET_OFFER_TERMS_TYPEHASH,
            _MARKET_OFFER_TYPEHASH,
            _PERMIT_TYPEHASH
        ) = _createTypeHashes();
    }

    function hashLoanOffer(LoanOffer calldata offer) external view returns (bytes32) {
        return _hashLoanOffer(offer);
    }

    function hashMarketOffer(MarketOffer calldata offer) external view returns (bytes32) {
        return _hashMarketOffer(offer);
    }

    function hashPermit(Permit calldata permit) external view returns (bytes32) {
        return _hashPermit(permit);
    }

    function _createTypeHashes()
        internal
        pure
        returns (
            bytes32 eip712DomainTypehash,
            bytes32 collateralTypehash,
            bytes32 feeTermsTypehash,
            bytes32 loanOfferTermsTypehash,
            bytes32 loanOfferTypehash,
            bytes32 marketOfferTermsTypehash,
            bytes32 marketOfferTypehash,
            bytes32 permitTypehash
        ) 
    {
        eip712DomainTypehash = keccak256(
            bytes.concat(
                "EIP712Domain(",
                "string name,",
                "string version,",
                "uint256 chainId,",
                "address verifyingContract",
                ")"
            )
        );

        bytes memory collateralTypestring = bytes.concat(
            "Collateral(",
            "uint8 criteria,",
            "address collection,",
            "uint256 identifier",
            ")"
        );

        collateralTypehash = keccak256(collateralTypestring);

        bytes memory feeTermsTypestring = bytes.concat(
            "FeeTerms(",
            "address recipient,",
            "uint256 rate",
            ")"
        );

        feeTermsTypehash = keccak256(feeTermsTypestring);

        bytes memory loanOfferTermsTypestring = bytes.concat(
            "LoanOfferTerms(",
            "address currency,",
            "uint256 amount,",
            "uint256 maxAmount,",
            "uint256 minAmount,",
            "uint256 rate,",
            "uint256 defaultRate,",
            "uint256 duration,",
            "uint256 gracePeriod",
            ")"
        );

        loanOfferTermsTypehash = keccak256(loanOfferTermsTypestring);

        loanOfferTypehash = keccak256(
            bytes.concat(
                "LoanOffer(",
                "uint8 side,",
                "address maker,",
                "address taker,",
                "Collateral collateral,",
                "LoanOfferTerms terms,",
                "FeeTerms fee,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")",
                collateralTypestring,
                feeTermsTypestring,
                loanOfferTermsTypestring
            )
        );

        bytes memory marketOfferTermsTypestring = bytes.concat(
            "MarketOfferTerms(",
            "address currency,",
            "uint256 amount,",
            "bool withLoan,",
            "uint256 borrowAmount,",
            "bytes32 loanOfferHash,",
            "uint256 rebate",
            ")"
        );

        marketOfferTermsTypehash = keccak256(marketOfferTermsTypestring);

        marketOfferTypehash = keccak256(
            bytes.concat(
                "MarketOffer(",
                "uint8 side,",
                "address maker,",
                "address taker,",
                "Collateral collateral,",
                "MarketOfferTerms terms,",
                "FeeTerms fee,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")",
                collateralTypestring,
                feeTermsTypestring,
                marketOfferTermsTypestring
            )
        );

        permitTypehash = keccak256(
            bytes.concat(
                "Permit(",
                "address taker,",
                "address currency,",
                "uint256 amount,",
                "bytes32 offerHash,",
                "uint256 expiration,",
                "uint256 salt",
                ")"
            )
        );
    }

    function _hashDomain(
        bytes32 eip712DomainTypehash,
        bytes32 nameHash,
        bytes32 versionHash
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    eip712DomainTypehash,
                    nameHash,
                    versionHash,
                    block.chainid,
                    address(this)
                )
            );
    }

    function _hashCollateral(
        Collateral calldata collateral
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _COLLATERAL_TYPEHASH,
                    collateral.criteria,
                    collateral.collection,
                    collateral.identifier
                )
            );
    }

    function _hashFee(
        FeeTerms calldata fee
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _FEE_TERMS_TYPEHASH,
                    fee.recipient,
                    fee.rate
                )
            );
    }

    function _hashLoanOfferTerms(
        LoanOfferTerms calldata terms
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _LOAN_OFFER_TERMS_TYPEHASH,
                    terms.currency,
                    terms.amount,
                    terms.maxAmount,
                    terms.minAmount,
                    terms.rate,
                    terms.defaultRate,
                    terms.duration,
                    terms.gracePeriod
                )
            );
    }

    function _hashLoanOffer(
        LoanOffer calldata offer
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _LOAN_OFFER_TYPEHASH,
                    offer.side,
                    offer.maker,
                    offer.taker,
                    _hashCollateral(offer.collateral),
                    _hashLoanOfferTerms(offer.terms),
                    _hashFee(offer.fee),
                    offer.expiration,
                    offer.salt,
                    nonces[offer.maker]
                )
            );
    }

    function _hashMarketOfferTerms(
        MarketOfferTerms calldata terms
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TERMS_TYPEHASH,
                    terms.currency,
                    terms.amount,
                    terms.withLoan,
                    terms.borrowAmount,
                    terms.loanOfferHash,
                    terms.rebate
                )
            );
    }

    function _hashMarketOffer(
        MarketOffer calldata offer
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TYPEHASH,
                    offer.side,
                    offer.maker,
                    offer.taker,
                    _hashCollateral(offer.collateral),
                    _hashMarketOfferTerms(offer.terms),
                    _hashFee(offer.fee),
                    offer.expiration,
                    offer.salt,
                    nonces[offer.maker]
                )
            );
    }

    function _hashPermit(
        Permit calldata permit
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _PERMIT_TYPEHASH,
                    permit.taker,
                    permit.currency,
                    permit.amount,
                    permit.offerHash,
                    permit.expiration,
                    permit.salt
                )
            );
    }

    function _hashToSign(bytes32 hash) internal view returns (bytes32) {
        bytes32 domain = _hashDomain(
            _EIP_712_DOMAIN_TYPEHASH,
            keccak256(bytes(_NAME)),
            keccak256(bytes(_VERSION))
        );

        return keccak256(abi.encodePacked(bytes2(0x1901), domain, hash));
    }

    function _verifyOfferAuthorization(
        bytes32 offerHash,
        address signer,
        bytes calldata signature
    ) internal {
        bytes32 _hash = _hashToSign(offerHash);
        SignaturesERC6492.verifyAuthorization(_hash, signer, signature);
    }
}

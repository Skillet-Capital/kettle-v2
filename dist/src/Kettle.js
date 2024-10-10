"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kettle = void 0;
const constants_1 = require("./constants");
const ethers_1 = require("ethers");
const types_1 = require("./types");
const utils_1 = require("./utils");
const signature_validator_1 = require("@ambire/signature-validator");
// import { createPublicClient, defineChain } from "viem";
class Kettle {
    constructor(_providerOrSigner, _contractAddress) {
        const provider = "provider" in _providerOrSigner
            ? _providerOrSigner.provider
            : _providerOrSigner;
        if (!provider) {
            throw new Error("Either a provider or custom signer with provider must be provided");
        }
        this.provider = provider;
        this.contractAddress = _contractAddress;
        this.contract = types_1.Kettle__factory.connect(_contractAddress, this.provider);
        this.iface = types_1.Kettle__factory.createInterface();
        this.lendingIface = types_1.LendingController__factory.createInterface();
    }
    connect(_providerOrSigner) {
        return new Kettle(_providerOrSigner, this.contractAddress);
    }
    // ==============================================
    //                CREATE OFFERS
    // ==============================================
    async createMarketOffer(input, maker) {
        const _maker = await this._resolveAddress(maker);
        const offer = await this._formatMarketOffer(_maker, input);
        const approvalActions = [];
        if (!(offer.side === types_1.Side.ASK && input.lien && (0, utils_1.equalAddresses)(input.lien.borrower, _maker))) {
            const _approvalActions = await this._getCreateApprovalActions(input.side, _maker, offer.terms, offer.collateral);
            approvalActions.push(..._approvalActions);
        }
        const createOfferAction = {
            action: types_1.StepAction.SIGN,
            type: "sign-offer",
            offer: offer,
            payload: await this._marketOfferPayload(offer),
            sign: async (signer) => {
                const signature = await this._signMarketOffer(offer, signer);
                return {
                    offer,
                    signature
                };
            }
        };
        return [...approvalActions, createOfferAction];
    }
    async createLoanOffer(input, maker) {
        const _maker = await this._resolveAddress(maker);
        const offer = await this._formatLoanOffer(_maker, input);
        const approvalActions = await this._getCreateApprovalActions(input.side, _maker, offer.terms, offer.collateral);
        const createOfferAction = {
            action: types_1.StepAction.SIGN,
            type: "sign-offer",
            offer: offer,
            payload: await this._loanOfferPayload(offer),
            sign: async (signer) => {
                const signature = await this._signLoanOffer(offer, signer);
                return {
                    offer,
                    signature
                };
            }
        };
        return [...approvalActions, createOfferAction];
    }
    // ==============================================
    //                TAKE OFFERS
    // ==============================================
    async takeMarketOffer(input, taker) {
        const _taker = await this._resolveAddress(taker);
        const proceeds = BigInt(input.offer.terms.amount) - this.mulFee(input.offer.terms.amount, input.offer.fee.rate);
        const approvalActions = await this._getTakeApprovalActions(proceeds, _taker, input);
        const takeOfferAction = {
            action: types_1.StepAction.SEND,
            type: "take-market-offer",
            userOp: (input.lien && input.lienId) ? {
                to: this.contractAddress,
                data: this.iface.encodeFunctionData(this.iface.getFunction("fulfillMarketOfferInLien"), [
                    input.lienId,
                    input.lien,
                    input.offer,
                    input.signature,
                    input.proof ?? []
                ])
            } : {
                to: this.contractAddress,
                data: this.iface.encodeFunctionData(this.iface.getFunction("fulfillMarketOffer"), [
                    input.tokenId,
                    input.offer,
                    input.signature,
                    input.proof ?? []
                ])
            },
            send: async (signer) => {
                let txn;
                if (input.lien && input.lienId) {
                    txn = await this.contract.connect(signer).fulfillMarketOfferInLien(input.lienId, input.lien, input.offer, input.signature, input.proof ?? []);
                }
                else {
                    txn = await this.contract.connect(signer).fulfillMarketOffer(input.tokenId, input.offer, input.signature, input.proof ?? []);
                }
                return this._confirmTransaction(txn.hash);
            }
        };
        return [...approvalActions, takeOfferAction];
    }
    async takeLoanOffer(input, taker) {
        const _taker = await this._resolveAddress(taker);
        const proceeds = (input.amount ?? input.offer.side === types_1.Side.BID)
            ? input.offer.terms.maxAmount
            : input.offer.terms.amount;
        const approvalActions = await this._getTakeApprovalActions(proceeds, _taker, input);
        const takeOfferAction = {
            action: types_1.StepAction.SEND,
            type: "take-loan-offer",
            userOp: (input.lien && input.lienId) ? {
                to: this.contractAddress,
                data: this.iface.encodeFunctionData(this.iface.getFunction("fulfillLoanOfferInLien"), [
                    input.lienId,
                    input?.amount ?? input.offer.terms.maxAmount,
                    input.lien,
                    input.offer,
                    input.signature,
                    input.proof ?? []
                ])
            } : {
                to: this.contractAddress,
                data: this.iface.encodeFunctionData(this.iface.getFunction("fulfillLoanOffer"), [
                    input.tokenId,
                    input?.amount ?? input.offer.terms.maxAmount,
                    input.offer,
                    input.signature,
                    input.proof ?? []
                ])
            },
            send: async (signer) => {
                let txn;
                if (input.lien && input.lienId) {
                    txn = await this.contract.connect(signer).fulfillLoanOfferInLien(input.lienId, input?.amount ?? input.offer.terms.maxAmount, input.lien, input.offer, input.signature, input.proof ?? []);
                }
                else {
                    txn = await this.contract.connect(signer).fulfillLoanOffer(input.tokenId, input?.amount ?? input.offer.terms.maxAmount, input.offer, input.signature, input.proof ?? []);
                }
                return this._confirmTransaction(txn.hash);
            }
        };
        return [...approvalActions, takeOfferAction];
    }
    async escrowMarketOffer(input, taker) {
        const _taker = await this._resolveAddress(taker);
        if (input.offer.side === types_1.Side.BID) {
            throw new Error("Invalid side: cannot take side bid");
        }
        const approvalActions = await this._getTakeApprovalActions(0, _taker, input);
        const takeOfferAction = {
            action: types_1.StepAction.SEND,
            type: "escrow-market-offer",
            userOp: {
                to: this.contractAddress,
                data: this.iface.encodeFunctionData(this.iface.getFunction("escrowMarketOffer"), [
                    input.offer.collateral.identifier,
                    input.offer,
                    input.signature,
                    input.proof ?? []
                ])
            },
            send: async (signer) => {
                const txn = await this.contract.connect(signer).escrowMarketOffer(input.offer.collateral.identifier, input.offer, input.signature, []);
                return this._confirmTransaction(txn.hash);
            }
        };
        return [...approvalActions, takeOfferAction];
    }
    // ==============================================
    //                LENDING ACTIONS
    // ==============================================
    async repay(lienId, lien, payer) {
        const _payer = await this._resolveAddress(payer);
        const { debt } = await this.currentDebt(lien);
        const approvalActions = await this._erc20Approvals(_payer, lien.currency, this.safeFactorMul(debt, 10), false);
        const repayAction = {
            action: types_1.StepAction.SEND,
            type: "repay-loan",
            userOp: {
                to: await this.contract.lending(),
                data: this.lendingIface.encodeFunctionData(this.lendingIface.getFunction("repay"), [lienId, lien])
            },
            send: async (signer) => {
                const controller = await this._lendingController();
                const txn = await controller.connect(signer).repay(lienId, lien);
                return this._confirmTransaction(txn.hash);
            }
        };
        return [...approvalActions, repayAction];
    }
    async claim(lienId, lien, claimer) {
        const _claimer = await this._resolveAddress(claimer);
        const claimAction = {
            action: types_1.StepAction.SEND,
            type: "claim-default",
            userOp: {
                to: await this.contract.lending(),
                data: this.lendingIface.encodeFunctionData(this.lendingIface.getFunction("claim"), [lienId, lien])
            },
            send: async (signer) => {
                const controller = await this._lendingController();
                const txn = await controller.connect(signer).claim(lienId, lien);
                return this._confirmTransaction(txn.hash);
            }
        };
        return [claimAction];
    }
    // ==============================================
    //                 VALIDATIONS
    // ==============================================
    async validateSignature(offer, signature) {
        const payload = offer.kind === types_1.OfferKind.MARKET
            ? await this._marketOfferPayload(offer)
            : await this._loanOfferPayload(offer);
        delete payload['types']['EIP712Domain'];
        const isValidSig = await (0, signature_validator_1.verifyMessage)({
            signer: offer.maker,
            typedData: payload,
            signature,
            // @ts-ignore
            provider: this.provider,
        });
        if (!isValidSig) {
            throw new Error("Invalid signature");
        }
    }
    async validateOffer(offer, lien) {
        const operator = await this.contract.conduit();
        if ((0, utils_1.offerExpired)(offer.expiration)) {
            throw new Error("Offer expired");
        }
        // basic validations for cancelled or nonce
        const validationPromises = [
            this.contract.cancelledOrFulfilled(offer.maker, offer.salt)
                .then((cancelled) => ({
                check: "cancelled",
                valid: !cancelled
            })),
            this.contract.nonces(offer.maker)
                .then((nonce) => ({
                check: "nonce",
                valid: BigInt(nonce) === BigInt(offer.nonce)
            })),
        ];
        if (offer.side === types_1.Side.BID) {
            /**
             * BID OFFER Validations
             * - check the maker has enough currency
             * - check the maker has enough currency approvals
             * - check loan max amount is not exceeded
             */
            validationPromises.push(...[
                (0, utils_1.currencyBalance)(offer.maker, offer.terms.currency, this.provider)
                    .then((balance) => ({
                    check: "balance",
                    valid: balance >= BigInt(offer.kind === types_1.OfferKind.LOAN
                        ? offer.terms.maxAmount
                        : offer.terms.amount),
                    reason: "Insufficient balance"
                })),
                (0, utils_1.currencyAllowance)(offer.maker, offer.terms.currency, operator, this.provider)
                    .then((allowance) => ({
                    check: "allowance",
                    valid: allowance >= BigInt(offer.kind === types_1.OfferKind.LOAN
                        ? offer.terms.maxAmount
                        : offer.terms.amount),
                    reason: "Insufficient allowance"
                }))
            ]);
            // check that loan offer max amount is not exceeded
            if (offer.kind === types_1.OfferKind.LOAN) {
                validationPromises.push(this.contract.amountTaken(this.hashLoanOffer(offer))
                    .then((amountTaken) => ({
                    check: "loan-max-amount",
                    valid: BigInt(offer.terms.amount) - BigInt(amountTaken) > BigInt(offer.terms.maxAmount),
                    reason: "Loan offer max amount exceeded"
                })));
            }
        }
        else {
            /**
             * ASK OFFER Validations
             * - check the maker has enough collateral (if not in lien)
             * - check the maker has enough collateral approvals (if not in lien)
             * - check the maker has enough currency approvals (if rebate)
             * - check offer terms match lien (if lien)
             * - check lien debt covers ask amount (if lien)
             */
            if (!lien) {
                validationPromises.push(...[
                    (0, utils_1.collateralBalance)(offer.maker, offer.collateral.collection, offer.collateral.identifier, this.provider)
                        .then((owns) => ({
                        check: "ownership",
                        valid: owns,
                        reason: "Maker does not own collateral"
                    })),
                    (0, utils_1.collateralApprovals)(offer.maker, offer.collateral.collection, operator, this.provider)
                        .then((approved) => ({
                        check: "approval",
                        valid: approved,
                        reason: "Maker has not approved collateral"
                    }))
                ]);
            }
            if (!offer.soft && offer.kind == types_1.OfferKind.MARKET && BigInt(offer.terms.rebate) > 0) {
                const rebateAmount = this.mulFee(offer.terms.amount, offer.terms.rebate);
                validationPromises.push((0, utils_1.currencyAllowance)(offer.maker, offer.terms.currency, operator, this.provider)
                    .then((allowance) => ({
                    check: "allowance",
                    valid: allowance >= rebateAmount,
                    reason: "Maker has insufficient allowance for rebate"
                })), (0, utils_1.currencyBalance)(offer.maker, offer.terms.currency, this.provider)
                    .then((balance) => ({
                    check: "balance",
                    valid: balance >= rebateAmount,
                    reason: "Maker has insufficient balance for rebate"
                })));
            }
        }
        if (lien) {
            if ((0, utils_1.lienDefaulted)(lien.startTime, lien.duration, lien.gracePeriod)) {
                throw new Error("[match-terms]: Lien is defaulted");
            }
            this._matchTerms({
                currency: offer.terms.currency,
                collection: offer.collateral.collection,
                tokenId: offer.side === types_1.Side.ASK ? offer.collateral.identifier : undefined
            }, lien);
            if (offer.side === types_1.Side.ASK) {
                const netAmount = BigInt(offer.terms.amount) - this.mulFee(offer.terms.amount, offer.fee.rate);
                validationPromises.push(this.currentDebt(lien)
                    .then(({ debt }) => ({
                    check: "debt-covers-ask",
                    valid: BigInt(debt) >= netAmount,
                    reason: "Current lien debt exceeds ask amount"
                })));
            }
        }
        await this._executeValidations(validationPromises);
    }
    async validateTakeOffer(user, input) {
        // validate offer maker params
        await this.validateOffer(input.offer);
        const validationPromises = [];
        if (input.lien) {
            this._matchTerms({
                currency: input.offer.terms.currency,
                collection: input.offer.collateral.collection,
                tokenId: input.tokenId
            }, input.lien);
        }
        if (input.offer.side === types_1.Side.BID && !input.lien) {
            validationPromises.push(types_1.TestERC721__factory.connect(input.offer.collateral.collection, this.provider)
                .ownerOf(input.tokenId)
                .then((owner) => ({
                check: "ownership",
                valid: (0, utils_1.equalAddresses)(owner, input.offer.maker),
                reason: "Taker bot owner of token"
            })));
            if (input.offer.kind === types_1.OfferKind.LOAN) {
                if (!input.amount) {
                    throw new Error("Take loan offer bid requires amount");
                }
                if (BigInt(input.amount) > BigInt(input.offer.terms.maxAmount)) {
                    throw new Error("Amount exceeds loan max amount");
                }
            }
            if (input.offer.soft) {
                throw new Error("Cannot take soft offer as bid");
            }
        }
        else {
            // TODO: validate amount needed if lender is buying asset in lien
            validationPromises.push((0, utils_1.currencyBalance)(user, input.offer.terms.currency, this.provider)
                .then((balance) => ({
                check: "balance",
                valid: balance >= BigInt(input.offer.terms.amount),
                reason: "Taker has insufficient balance for rebate"
            })));
        }
        await this._executeValidations(validationPromises);
    }
    async validateCreateOffer(user, input) {
        console.log(user, input);
        const validationPromises = [];
        if (input.side === types_1.Side.BID) {
            validationPromises.push((0, utils_1.currencyBalance)(user, await this._resolveAddress(input.currency), this.provider)
                .then((balance) => ({
                check: "balance",
                valid: balance >= BigInt(input.amount),
                reason: "Insufficient balance"
            })));
        }
        else {
            if (input.lien) {
                if ((0, utils_1.lienDefaulted)(input.lien.startTime, input.lien.duration, input.lien.gracePeriod)) {
                    throw new Error("[match-terms]: Lien is defaulted");
                }
                this._matchTerms({
                    currency: await this._resolveAddress(input.currency),
                    collection: await this._resolveAddress(input.collection),
                    tokenId: input.side === types_1.Side.ASK ? input.identifier : undefined
                }, input.lien);
            }
            else {
                validationPromises.push((0, utils_1.collateralBalance)(user, await this._resolveAddress(input.collection), input.identifier, this.provider)
                    .then((owns) => ({
                    check: "ownership",
                    valid: owns,
                    reason: "Maker does not own collateral"
                })));
            }
        }
        await this._executeValidations(validationPromises);
    }
    _matchTerms(input, lien) {
        if (!(0, utils_1.equalAddresses)(input.currency, lien.currency)) {
            throw new Error("[match-terms]: Currency mismatch");
        }
        if (!(0, utils_1.equalAddresses)(input.collection, lien.collection)) {
            throw new Error("[match-terms]: Collection mismatch");
        }
        if (input.tokenId && input.tokenId != lien.tokenId) {
            throw new Error("[match-terms]: TokenId mismatch");
        }
    }
    async _executeValidations(validations) {
        const results = await Promise.all(validations);
        for (const result of results) {
            console.log(result);
            if (!result.valid) {
                throw new Error(`[${result.check}]: ${result.reason ?? "Validation failed"}`);
            }
        }
    }
    // ==============================================
    //                CONTRACT METHODS
    // ==============================================
    async currentDebt(lien) {
        const controller = await this._lendingController();
        return controller.computeCurrentDebt(lien);
    }
    // ==============================================
    //                FORMAT METHODS
    // ==============================================
    async _formatMarketOffer(maker, input) {
        return {
            kind: types_1.OfferKind.MARKET,
            soft: input.soft ?? false,
            side: input.side,
            maker,
            taker: input.taker ? (await this._resolveAddress(input.taker)) : constants_1.ADDRESS_ZERO,
            collateral: {
                criteria: input.criteria ?? types_1.Criteria.SIMPLE,
                collection: await this._resolveAddress(input.collection),
                identifier: input.identifier,
            },
            terms: {
                currency: await this._resolveAddress(input.currency),
                amount: input.amount,
                rebate: input.rebate ?? 0,
            },
            fee: {
                recipient: await this._resolveAddress(input.recipient),
                rate: input.fee,
            },
            expiration: input.expiration,
            salt: (0, utils_1.randomSalt)(),
            nonce: await this.contract.nonces(maker).then((_n) => _n.toString())
        };
    }
    async _formatLoanOffer(maker, input) {
        return {
            kind: types_1.OfferKind.LOAN,
            soft: input.soft ?? false,
            side: input.side,
            maker,
            taker: input.taker ? (await this._resolveAddress(input.taker)) : constants_1.ADDRESS_ZERO,
            collateral: {
                criteria: input.criteria ?? types_1.Criteria.SIMPLE,
                collection: await this._resolveAddress(input.collection),
                identifier: input.identifier,
            },
            terms: {
                currency: await this._resolveAddress(input.currency),
                amount: input.amount,
                minAmount: input.minAmount ?? 0,
                maxAmount: input.maxAmount ?? input.amount,
                rate: input.rate,
                defaultRate: input.defaultRate,
                duration: input.duration,
                gracePeriod: input.gracePeriod,
            },
            fee: {
                recipient: await this._resolveAddress(input.recipient),
                rate: input.fee,
            },
            expiration: input.expiration,
            salt: (0, utils_1.randomSalt)(),
            nonce: await this.contract.nonces(maker).then((_n) => _n.toString())
        };
    }
    // ==============================================
    //                APPROVAL METHODS
    // ==============================================
    async _erc20Approvals(user, currency, amount, useMax) {
        const operator = await this.contract.conduit();
        const approvalActions = [];
        const allowance = await (0, utils_1.currencyAllowance)(user, currency, operator, this.provider);
        if (allowance < BigInt(amount)) {
            approvalActions.push({
                action: types_1.StepAction.SEND,
                type: "approve-erc20",
                userOp: {
                    to: currency,
                    data: types_1.TestERC20__factory.createInterface().encodeFunctionData("approve", [operator, useMax ? ethers_1.MaxUint256 : BigInt(amount) - allowance])
                },
                send: async (signer) => {
                    const contract = types_1.TestERC20__factory.connect(currency, signer);
                    const wad = useMax ? ethers_1.MaxUint256 : BigInt(amount) - allowance;
                    const txn = await contract.approve(operator, wad);
                    return this._confirmTransaction(txn.hash);
                }
            });
        }
        return approvalActions;
    }
    async _erc721Approvals(user, collection) {
        const operator = await this.contract.conduit();
        const approvalActions = [];
        const approved = await (0, utils_1.collateralApprovals)(user, collection, operator, this.provider);
        if (!approved) {
            approvalActions.push({
                action: types_1.StepAction.SEND,
                type: "approve-erc721",
                userOp: {
                    to: collection,
                    data: types_1.TestERC721__factory.createInterface().encodeFunctionData("setApprovalForAll", [operator, true])
                },
                send: async (signer) => {
                    const contract = types_1.TestERC721__factory.connect(collection, signer);
                    const txn = await contract.setApprovalForAll(operator, true);
                    return this._confirmTransaction(txn.hash);
                }
            });
        }
        return approvalActions;
    }
    async _getCreateApprovalActions(side, user, terms, collateral) {
        const approvalActions = [];
        if (side === types_1.Side.BID) {
            const _approvalActions = await this._erc20Approvals(user, terms.currency, BigInt(terms.amount), true);
            approvalActions.push(..._approvalActions);
        }
        else {
            const _approvalActions = await this._erc721Approvals(user, collateral.collection);
            approvalActions.push(..._approvalActions);
            if (terms.rebate && BigInt(terms.rebate) > 0) {
                const rebateAmount = this.mulFee(terms.amount, terms.rebate);
                const _approvalActions = await this._erc20Approvals(user, terms.currency, rebateAmount);
                approvalActions.push(..._approvalActions);
            }
        }
        return approvalActions;
    }
    async _getTakeApprovalActions(proceeds, taker, input) {
        const approvalActions = [];
        if (input.offer.side === types_1.Side.BID) {
            // not in lien or is hard , need to approve collateral
            if (!(input.lien && input.lienId)) {
                const _approvalActions = await this._erc721Approvals(taker, input.offer.collateral.collection);
                approvalActions.push(..._approvalActions);
            }
            // in lien,might need to approve extra amount
            if (input.lien && input.lienId) {
                const { debt } = await this.currentDebt(input.lien);
                if (BigInt(debt) > BigInt(proceeds)) {
                    const _approvalActions = await this._erc20Approvals(taker, input.lien.currency, this.safeFactorMul(BigInt(debt) - BigInt(proceeds), 250));
                    approvalActions.push(..._approvalActions);
                }
            }
            // taking ask, needs to approve currency
        }
        else {
            const _approvalActions = await this._erc20Approvals(taker, input.offer.terms.currency, input.offer.terms.amount);
            approvalActions.push(..._approvalActions);
        }
        return approvalActions;
    }
    // ==============================================
    //           PERIPHERAL CONTRACT INIT
    // ==============================================
    async _lendingController() {
        const lendingController = await this.contract.lending();
        return types_1.LendingController__factory.connect(lendingController, this.provider);
    }
    async _escrowController() {
        const escrowController = await this.contract.escrow();
        return types_1.EscrowController__factory.connect(escrowController, this.provider);
    }
    // ==============================================
    //           SIGNER AND PROVIDER METHODS
    // ==============================================
    async _confirmTransaction(hash, confirmations, timeout) {
        try {
            await this.provider.waitForTransaction(hash, confirmations, timeout);
            return hash;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            if (error.message.includes("HardhatEthersProvider.waitForTransaction"))
                return hash;
            throw new Error("Unable to confirm transaction, please check block explorer and try again");
        }
    }
    async _resolveAddress(input) {
        if (typeof input === "string") {
            return input;
        }
        else if (typeof input.getAddress === "function") {
            return await input.getAddress();
        }
        throw new Error("Invalid input: must be string or Addressable");
    }
    // ==============================================
    //           SIGNAUTRE AND DOMAIN METHODS
    // ==============================================
    async _getDomainData() {
        const { chainId } = await this.provider.getNetwork();
        return {
            name: constants_1.KETTLE_CONTRACT_NAME,
            version: constants_1.KETTLE_CONTRACT_VERSION,
            chainId,
            verifyingContract: await this.contract.getAddress()
        };
    }
    async _signMarketOffer(offer, signer) {
        const domain = await this._getDomainData();
        return signer.signTypedData(domain, constants_1.MARKET_OFFER_TYPE, offer);
    }
    async _signLoanOffer(offer, signer) {
        const domain = await this._getDomainData();
        return signer.signTypedData(domain, constants_1.LOAN_OFFER_TYPE, offer);
    }
    async _marketOfferPayload(offer) {
        const domain = await this._getDomainData();
        return ethers_1.TypedDataEncoder.getPayload(domain, constants_1.MARKET_OFFER_TYPE, offer);
    }
    async _loanOfferPayload(offer) {
        const domain = await this._getDomainData();
        return ethers_1.TypedDataEncoder.getPayload(domain, constants_1.LOAN_OFFER_TYPE, offer);
    }
    // ==============================================
    //                    UTILS
    // ==============================================
    hashOffer(offer) {
        return offer.kind === types_1.OfferKind.MARKET
            ? this.hashMarketOffer(offer)
            : this.hashLoanOffer(offer);
    }
    hashMarketOffer(offer) {
        return ethers_1.TypedDataEncoder.hashStruct("MarketOffer", constants_1.MARKET_OFFER_TYPE, offer);
    }
    hashLoanOffer(offer) {
        return ethers_1.TypedDataEncoder.hashStruct("LoanOffer", constants_1.LOAN_OFFER_TYPE, offer);
    }
    hashLien(lien) {
        // TODO: implement abi coder
        return "";
    }
    hashEscrow(escrow) {
        // TODO: implement abi coder
        return "";
    }
    blocktime() {
        return this.provider.getBlock("latest").then((block) => {
            if (!block) {
                throw new Error("Block not found");
            }
            return block.timestamp;
        });
    }
    mulFee(amount, rate) {
        return BigInt(amount) * BigInt(rate) / constants_1.BASIS_POINTS_DIVISOR;
    }
    safeFactorMul(amount, factor) {
        return (BigInt(amount) * (10000n + BigInt(factor))) / 10000n;
    }
    // ==============================================
    //                    EXECUTION
    // ==============================================
    async bundleSendTxns(steps, signer) {
        const results = [];
        for (const step of steps) {
            if (step.action === types_1.StepAction.SEND) {
                const txn = await step.send(signer);
                results.push(txn);
            }
        }
        return results;
    }
    bundleUserOps(steps) {
        const ops = [];
        for (const step of steps) {
            if (step.action === types_1.StepAction.SEND) {
                ops.push(step.userOp);
            }
        }
        return ops;
    }
}
exports.Kettle = Kettle;

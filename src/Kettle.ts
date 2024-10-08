import {
  BYTES_ZERO,
  ADDRESS_ZERO,
  BASIS_POINTS_DIVISOR,
  KETTLE_CONTRACT_NAME,
  KETTLE_CONTRACT_VERSION,
  LOAN_OFFER_TERMS_TYPE,
  MARKET_OFFER_TERMS_TYPE,
  LOAN_OFFER_TYPE,
  MARKET_OFFER_TYPE,
  PERMIT_TYPE,
} from "./constants";

import {
  Provider,
  Signer,
  JsonRpcProvider,
  JsonRpcSigner,
  ZeroAddress,
  TypedDataEncoder,
  Addressable,
  MaxUint256,
  keccak256,
  solidityPacked,
  AbiCoder,
  recoverAddress,
  Signature
} from "ethers";

import type {
  KettleContract,
  CreateMarketOfferInput,
  MarketOffer,
  OfferWithSignature,
  CreateLoanOfferInput,
  LoanOffer,
  GenericOfferTerms,
  CollateralTerms,
  Numberish,
  Lien,
  LienStruct,
  EscrowStruct,
  CurrentDebt,
  TakeOfferInput,
  Validation,
  SendStep,
  SignStep,
  UserOp
} from "./types";

import {
  Criteria,
  OfferKind,
  Side,
  Kettle__factory,
  LendingController__factory,
  EscrowController__factory,
  TestERC20__factory,
  TestERC721__factory,
  StepAction
} from "./types";

import {
  randomSalt,
  collateralApprovals,
  currencyBalance,
  currencyAllowance,
  collateralBalance,
  equalAddresses,
  offerExpired,
  lienDefaulted
} from "./utils";

export class Kettle {

  public contract: KettleContract;
  public contractAddress: string;
  public iface: any;
  public lendingIface: any;

  private provider: Provider;
  private signer?: Signer;

  public constructor(
    _providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner,
    _contractAddress: string
  ) {

    const provider =
      "provider" in _providerOrSigner
        ? _providerOrSigner.provider
        : _providerOrSigner;

    this.signer =
      "getAddress" in _providerOrSigner
        ? (_providerOrSigner as Signer)
        : undefined;

    if (!provider) {
      throw new Error(
        "Either a provider or custom signer with provider must be provided",
      );
    }

    this.provider = provider;

    this.contractAddress = _contractAddress;
    this.contract = Kettle__factory.connect(
      _contractAddress,
      this.provider
    );

    this.iface = Kettle__factory.createInterface();
    this.lendingIface = LendingController__factory.createInterface();
  }

  public connect(_providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner) {
    return new Kettle(_providerOrSigner, this.contractAddress);
  }

  // ==============================================
  //                CREATE OFFERS
  // ==============================================

  public async createMarketOffer(
    input: CreateMarketOfferInput,
    maker: string | Addressable
  ): Promise<(SendStep | SignStep)[]> {
    const _maker = await this._resolveAddress(maker);
    const offer = await this._formatMarketOffer(_maker, input);

    const approvalActions: SendStep[] = [];
    if (!(offer.side === Side.ASK && input.lien && equalAddresses(input.lien.borrower, _maker))) {
      const _approvalActions = await this._getCreateApprovalActions(
        input.side,
        _maker,
        offer.terms,
        offer.collateral
      );

      approvalActions.push(..._approvalActions);
    }

    const createOfferAction: SignStep = {
      action: StepAction.SIGN,
      type: "create-market-offer",
      offer: offer,
      payload: await this._marketOfferPayload(offer),
      sign: async (signer: Signer): Promise<OfferWithSignature> => {
        const signature = await this._signMarketOffer(offer, signer);

        return {
          offer,
          signature
        }
      }
    } as const;

    return [...approvalActions, createOfferAction];
  }

  public async createLoanOffer(
    input: CreateLoanOfferInput,
    maker: string | Addressable
  ): Promise<(SendStep | SignStep)[]> {
    const _maker = await this._resolveAddress(maker);
    const offer = await this._formatLoanOffer(_maker, input);

    const approvalActions = await this._getCreateApprovalActions(
      input.side,
      _maker,
      offer.terms,
      offer.collateral
    );

    const createOfferAction: SignStep = {
      action: StepAction.SIGN,
      type: "create-loan-offer",
      offer: offer,
      payload: await this._loanOfferPayload(offer),
      sign: async (signer: Signer): Promise<OfferWithSignature> => {
        const signature = await this._signLoanOffer(offer, signer);

        return {
          offer,
          signature
        }
      }
    } as const;

    return [...approvalActions, createOfferAction];
  }

  // ==============================================
  //                TAKE OFFERS
  // ==============================================

  public async takeMarketOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    const proceeds = BigInt(input.offer.terms.amount) - this.mulFee(input.offer.terms.amount, input.offer.fee.rate);
    const approvalActions = await this._getTakeApprovalActions(
      proceeds,
      _taker,
      input
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "take-market-offer",
      userOp: (input.lien && input.lienId) ? {
        target: this.contractAddress,
        data: this.iface.encodeFunctionData(
          this.iface.getFunction("fulfillMarketOfferInLien"),
          [
            input.lienId,
            input.lien,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      } : {
        target: this.contractAddress,
        data: this.iface.encodeFunctionData(
          this.iface.getFunction("fulfillMarketOffer"),
          [
            input.tokenId!,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      },
      send: async (signer: Signer | JsonRpcSigner) => {
        let txn;

        if (input.lien && input.lienId) {
          txn = await this.contract.connect(signer).fulfillMarketOfferInLien(
            input.lienId,
            input.lien,
            input.offer as MarketOffer,
            input.signature,
            input.proof ?? []
          );
        } else {
          txn = await this.contract.connect(signer).fulfillMarketOffer(
            input.tokenId!,
            input.offer as MarketOffer,
            input.signature,
            input.proof ?? []
          );
        }

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async takeLoanOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    const proceeds = input.amount ?? input.offer.side === Side.BID
      ? (input.offer as LoanOffer).terms.maxAmount
      : (input.offer as LoanOffer).terms.amount;

    const approvalActions = await this._getTakeApprovalActions(
      proceeds,
      _taker,
      input
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "take-loan-offer",
      userOp: (input.lien && input.lienId) ? {
        target: this.contractAddress,
        data: this.iface.encodeFunctionData(
          this.iface.getFunction("fulfillLoanOfferInLien"),
          [
            input.lienId,
            input?.amount ?? (input.offer as LoanOffer).terms.maxAmount,
            input.lien,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      } : {
        target: this.contractAddress,
        data: this.iface.encodeFunctionData(
          this.iface.getFunction("fulfillLoanOffer"),
          [
            input.tokenId,
            input?.amount ?? (input.offer as LoanOffer).terms.maxAmount,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      },
      send: async (signer: Signer) => {
        let txn;

        if (input.lien && input.lienId) {
          txn = await this.contract.connect(signer).fulfillLoanOfferInLien(
            input.lienId,
            input?.amount ?? (input.offer as LoanOffer).terms.maxAmount,
            input.lien,
            input.offer as LoanOffer,
            input.signature,
            input.proof ?? []
          );
        } else {
          txn = await this.contract.connect(signer).fulfillLoanOffer(
            input.tokenId!,
            input?.amount ?? (input.offer as LoanOffer).terms.maxAmount,
            input.offer as LoanOffer,
            input.signature,
            input.proof ?? []
          );
        }

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async escrowMarketOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    if (input.offer.side === Side.BID) {
      throw new Error("Invalid side: cannot take side bid");
    }

    const approvalActions = await this._getTakeApprovalActions(
      0,
      _taker,
      input
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "escrow-market-offer",
      userOp: {
        target: this.contractAddress,
        data: this.iface.encodeFunctionData(
          this.iface.getFunction("escrowMarketOffer"),
          [
            input.offer.collateral.identifier,
            input.offer as MarketOffer,
            input.signature,
            input.proof ?? []
          ]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).escrowMarketOffer(
          input.offer.collateral.identifier,
          input.offer as MarketOffer,
          input.signature,
          []
        );

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  // ==============================================
  //                LENDING ACTIONS
  // ==============================================

  public async repay(
    lienId: Numberish,
    lien: Lien,
    payer: string | Addressable
  ): Promise<SendStep[]> {
    const _payer = await this._resolveAddress(payer);

    const { debt } = await this.currentDebt(lien);

    const approvalActions = await this._erc20Approvals(
      _payer,
      lien.currency,
      this.safeFactorMul(debt, 10),
      false
    );

    const repayAction: SendStep = {
      action: StepAction.SEND,
      type: "repay-loan",
      userOp: {
        target: await this.contract.lending(),
        data: this.lendingIface.encodeFunctionData(
          this.lendingIface.getFunction("repay"),
          [lienId, lien]
        )
      },
      send: async (signer: Signer) => {
        const controller = await this._lendingController();
        const txn = await controller.connect(signer).repay(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, repayAction];
  }

  public async claim(
    lienId: Numberish,
    lien: Lien,
    claimer: string | Addressable
  ): Promise<SendStep[]> {
    const _claimer = await this._resolveAddress(claimer);

    const claimAction: SendStep = {
      action: StepAction.SEND,
      type: "claim-default",
      userOp: {
        target: await this.contract.lending(),
        data: this.lendingIface.encodeFunctionData(
          this.lendingIface.getFunction("claim"),
          [lienId, lien]
        )
      },
      send: async (signer: Signer) => {
        const controller = await this._lendingController();
        const txn = await controller.connect(signer).claim(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [claimAction];
  }

  // ==============================================
  //                 VALIDATIONS
  // ==============================================

  public async validateSignature(
    offer: MarketOffer | LoanOffer,
    signature: string
  ): Promise<void> {
    const domain = await this._getDomainData();

    const sig = Signature.from(signature);
    if (sig.v !== 27 && sig.v !== 28) {
      throw new Error("Invalid v parameter");
    }

    const _hash = TypedDataEncoder.hash(
      domain,
      offer.kind === OfferKind.MARKET ? MARKET_OFFER_TYPE : LOAN_OFFER_TYPE,
      offer
    );

    const recovered = recoverAddress(_hash, signature);
    if (!equalAddresses(recovered, offer.maker)) {
      throw new Error("Invalid signature");
    }
  }

  public async validateOffer(
    offer: MarketOffer | LoanOffer,
    lien?: Lien
  ): Promise<void> {
    const operator = await this.contract.conduit();

    if (offerExpired(offer.expiration)) {
      throw new Error("Offer expired");
    }

    // basic validations for cancelled or nonce
    const validationPromises: Promise<Validation>[] = [
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
    ]

    if (offer.side === Side.BID) {
      /**
       * BID OFFER Validations
       * - check the maker has enough currency
       * - check the maker has enough currency approvals
       * - check loan max amount is not exceeded
       */
      validationPromises.push(...[
        currencyBalance(offer.maker, offer.terms.currency, this.provider)
          .then((balance) => ({
            check: "balance",
            valid: balance >= BigInt(
              offer.kind === OfferKind.LOAN 
                ? (offer as LoanOffer).terms.maxAmount 
                : offer.terms.amount
              ),
            reason: "Insufficient balance"
          }) as Validation),
        currencyAllowance(offer.maker, offer.terms.currency, operator, this.provider)
          .then((allowance) => ({
            check: "allowance",
            valid: allowance >= BigInt(
              offer.kind === OfferKind.LOAN 
                ? (offer as LoanOffer).terms.maxAmount 
                : offer.terms.amount
              ),
            reason: "Insufficient allowance"
          }) as Validation)
      ])

      // check that loan offer max amount is not exceeded
      if (offer.kind === OfferKind.LOAN) {
        validationPromises.push(
          this.contract.amountTaken(this.hashLoanOffer(offer as LoanOffer))
            .then((amountTaken) => ({
              check: "loan-max-amount",
              valid: BigInt(offer.terms.amount) - BigInt(amountTaken) > BigInt((offer as LoanOffer).terms.maxAmount),
              reason: "Loan offer max amount exceeded"
            }))
          );
      }

    } else {
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
          collateralBalance(offer.maker, offer.collateral.collection, offer.collateral.identifier, this.provider)
            .then((owns) => ({
              check: "ownership",
              valid: owns,
              reason: "Maker does not own collateral"
            }) as Validation),
          collateralApprovals(offer.maker, offer.collateral.collection, operator, this.provider)
            .then((approved) => ({
              check: "approval",
              valid: approved,
              reason: "Collateral not approved"
            }) as Validation)
        ]);
      }

      if (!offer.soft && offer.kind == OfferKind.MARKET && BigInt((offer as MarketOffer).terms.rebate) > 0) {
        const rebateAmount = this.mulFee(offer.terms.amount, (offer as MarketOffer).terms.rebate);

        validationPromises.push(
          currencyAllowance(offer.maker, offer.terms.currency, operator, this.provider)
            .then((allowance) => ({
              check: "allowance",
              valid: allowance >= rebateAmount,
              reason: "Insufficient allowance for rebate"
            }) as Validation),
          currencyBalance(offer.maker, offer.terms.currency, this.provider)
            .then((balance) => ({
              check: "balance",
              valid: balance >= rebateAmount,
              reason: "Insufficient balance for rebate"
            }) as Validation)
        );
      }

      if (lien) {
        this._matchTerms(offer.maker, offer.collateral, offer.terms, lien);

        const netAmount = BigInt(offer.terms.amount) - this.mulFee(offer.terms.amount, offer.fee.rate);
        validationPromises.push(
          this.currentDebt(lien)
            .then(({ debt }) => ({
              check: "debt-covers-ask",
              valid: BigInt(debt) >= netAmount,
              reason: "Current debt exceeds ask amount"
            }) as Validation)
        );
      }
    }

    return this._executeValidations(validationPromises);
  }

  private _matchTerms(
    maker: string,
    collateral: CollateralTerms,
    terms: GenericOfferTerms,
    lien: Lien
  ): void {
    if (!equalAddresses(maker, lien.borrower)) {
      throw new Error("[match-terms]: Borrower mismatch");
    }

    if (!equalAddresses(terms.currency, lien.currency)) {
      throw new Error("[match-terms]: Currency mismatch");
    }

    if (!equalAddresses(collateral.collection, lien.collection)) {
      throw new Error("[match-terms]: Collection mismatch");
    }

    if (collateral.identifier !== lien.tokenId) {
      throw new Error("[match-terms]: TokenId mismatch");
    }

    if (lienDefaulted(lien.startTime, lien.duration, lien.gracePeriod)) {
      throw new Error("[match-terms]: Lien is defaulted");
    }
  }

  private async _executeValidations(validations: Promise<Validation>[]): Promise<void> {
    const results = await Promise.all(validations);

    for (const result of results) {
      if (!result.valid) {
        throw new Error(`[${result.check}]: ${result.reason ?? "Validation failed" }`);
      }
    }
  }

  // ==============================================
  //                CONTRACT METHODS
  // ==============================================

  public async currentDebt(lien: Lien): Promise<CurrentDebt> {
    const controller = await this._lendingController();
    return controller.computeCurrentDebt(lien);
  }

  // ==============================================
  //                FORMAT METHODS
  // ==============================================

  public async _formatMarketOffer(
    maker: string,
    input: CreateMarketOfferInput
  ): Promise<MarketOffer> {

    return {
      kind: OfferKind.MARKET,
      soft: input.soft ?? false,
      side: input.side,
      maker,
      taker: input.taker ? (await this._resolveAddress(input.taker)) : ADDRESS_ZERO,
      collateral: {
        criteria: input.criteria ?? Criteria.SIMPLE,
        collection: await this._resolveAddress(input.collection),
        identifier: input.identifier,
      },
      terms: {
        currency: await this._resolveAddress(input.currency),
        amount: input.amount,
        withLoan: false,
        borrowAmount: 0,
        loanOfferHash: BYTES_ZERO,
        rebate: input.rebate ?? 0,
      },
      fee: {
        recipient: await this._resolveAddress(input.recipient),
        rate: input.fee,
      },
      expiration: input.expiration,
      salt: randomSalt(),
      nonce: await this.contract.nonces(maker).then((_n) => _n.toString())
    }
  }

  public async _formatLoanOffer(
    maker: string,
    input: CreateLoanOfferInput
  ): Promise<LoanOffer> {

    return {
      kind: OfferKind.LOAN,
      soft: input.soft ?? false,
      side: input.side,
      maker,
      taker: input.taker ? (await this._resolveAddress(input.taker)) : ADDRESS_ZERO,
      collateral: {
        criteria: input.criteria ?? Criteria.SIMPLE,
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
      salt: randomSalt(),
      nonce: await this.contract.nonces(maker).then((_n) => _n.toString())
    }
  }

  // ==============================================
  //                APPROVAL METHODS
  // ==============================================

  private async _erc20Approvals(
    user: string,
    currency: string,
    amount: Numberish,
    useMax?: boolean
  ): Promise<SendStep[]> {
    const operator = await this.contract.conduit();

    const approvalActions: SendStep[] = [];

    const allowance = await currencyAllowance(user, currency, operator, this.provider);

    if (allowance < BigInt(amount)) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "erc20-approval",
        userOp: {
          target: currency,
          data: TestERC20__factory.createInterface().encodeFunctionData(
            "approve",
            [operator, useMax ? MaxUint256 : BigInt(amount) - allowance]
          )
        },
        send: async (signer: Signer) => {
          const contract = TestERC20__factory.connect(currency, signer);

          const wad = useMax ? MaxUint256 : BigInt(amount) - allowance;
          const txn = await contract.approve(operator, wad);
          return this._confirmTransaction(txn.hash);
        }
      })
    }

    return approvalActions;
  }

  private async _erc721Approvals(
    user: string,
    collection: string,
  ): Promise<SendStep[]> {
    const operator = await this.contract.conduit();

    const approvalActions: SendStep[] = [];

    const approved = await collateralApprovals(user, collection, operator, this.provider);

    if (!approved) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "erc721-approval",
        userOp: {
          target: collection,
          data: TestERC721__factory.createInterface().encodeFunctionData("setApprovalForAll", [operator, true])
        },
        send: async (signer: Signer) => {
          const contract = TestERC721__factory.connect(collection, signer);
          const txn = await contract.setApprovalForAll(operator, true);
          return this._confirmTransaction(txn.hash);
        }
      })
    }

    return approvalActions;
  }

  private async _getCreateApprovalActions(
    side: Side,
    user: string,
    terms: GenericOfferTerms,
    collateral: CollateralTerms
  ): Promise<SendStep[]> {
    const approvalActions: SendStep[] = [];

    if (side === Side.BID) {
      const _approvalActions = await this._erc20Approvals(
        user,
        terms.currency,
        BigInt(terms.amount),
        true
      );

      approvalActions.push(..._approvalActions);

    } else {
      const _approvalActions = await this._erc721Approvals(
        user,
        collateral.collection
      );

      approvalActions.push(..._approvalActions);

      if (terms.rebate && BigInt(terms.rebate) > 0) {
        const rebateAmount = this.mulFee(terms.amount, terms.rebate);
        const _approvalActions = await this._erc20Approvals(
          user,
          terms.currency,
          rebateAmount
        );

        approvalActions.push(..._approvalActions);
      }
    }

    return approvalActions;
  }

  private async _getTakeApprovalActions(
    proceeds: Numberish,
    taker: string,
    input: TakeOfferInput
  ): Promise<SendStep[]> {
    const approvalActions: SendStep[] = [];

    if (input.offer.side === Side.BID) {

      // not in lien or is hard , need to approve collateral
      if (!(input.lien && input.lienId)) {
        const _approvalActions = await this._erc721Approvals(
          taker,
          input.offer.collateral.collection
        );

        approvalActions.push(..._approvalActions);
      }

      // in lien,might need to approve extra amount
      if (input.lien && input.lienId) {
        const { debt } = await this.currentDebt(input.lien);

        if (BigInt(debt) > BigInt(proceeds)) {
          const _approvalActions = await this._erc20Approvals(
            taker,
            input.lien.currency,
            this.safeFactorMul(BigInt(debt) - BigInt(proceeds), 250)
          );
          approvalActions.push(..._approvalActions);
        }
      }

      // taking ask, needs to approve currency
    } else {
      const _approvalActions = await this._erc20Approvals(
        taker,
        input.offer.terms.currency,
        input.offer.terms.amount
      );

      approvalActions.push(..._approvalActions);
    }

    return approvalActions;
  }

  // ==============================================
  //           PERIPHERAL CONTRACT INIT
  // ==============================================

  private async _lendingController() {
    const lendingController = await this.contract.lending();
    return LendingController__factory.connect(lendingController, this.provider);
  }

  private async _escrowController() {
    const escrowController = await this.contract.escrow();
    return EscrowController__factory.connect(escrowController, this.provider);
  }

  // ==============================================
  //           SIGNER AND PROVIDER METHODS
  // ==============================================

  // private async _getSigner(
  //   accountAddress?: string,
  // ): Promise<Signer | JsonRpcSigner> {
  //   if (this.signer) {
  //     return this.signer;
  //   }

  //   if (!("send" in this.provider)) {
  //     throw new Error(
  //       "Either signer or JsonRpcProvider with signer must be provided",
  //     );
  //   }

  //   return (this.provider as JsonRpcProvider).getSigner(accountAddress);
  // }

  private async _confirmTransaction(
    hash: string,
    confirmations?: number,
    timeout?: number
  ) {
    try {
      await this.provider.waitForTransaction(hash, confirmations, timeout);
      return hash;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("HardhatEthersProvider.waitForTransaction")) return hash;
      throw new Error("Unable to confirm transaction, please check block explorer and try again");
    }
  }

  private async _resolveAddress(input: string | Addressable): Promise<string> {
    if (typeof input === "string") {
      return input;
    } else if (typeof input.getAddress === "function") {
      return await input.getAddress();
    }

    throw new Error("Invalid input: must be string or Addressable");
  }

  // ==============================================
  //           SIGNAUTRE AND DOMAIN METHODS
  // ==============================================

  private async _getDomainData() {
    const { chainId } = await this.provider.getNetwork();

    return {
      name: KETTLE_CONTRACT_NAME,
      version: KETTLE_CONTRACT_VERSION,
      chainId,
      verifyingContract: await this.contract.getAddress()
    }
  }

  private async _signMarketOffer(offer: MarketOffer, signer: Signer): Promise<string> {
    const domain = await this._getDomainData();
    return signer.signTypedData(domain, MARKET_OFFER_TYPE, offer);
  }

  private async _signLoanOffer(offer: LoanOffer, signer: Signer): Promise<string> {
    const domain = await this._getDomainData();
    return signer.signTypedData(domain, LOAN_OFFER_TYPE, offer);
  }

  private async _marketOfferPayload(offer: MarketOffer): Promise<string> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      MARKET_OFFER_TYPE,
      offer
    );
  }

  private async _loanOfferPayload(offer: LoanOffer): Promise<string> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      LOAN_OFFER_TYPE,
      offer
    );
  }

  // ==============================================
  //                    UTILS
  // ==============================================

  public hashOffer(offer: MarketOffer | LoanOffer): string {
    return offer.kind === OfferKind.MARKET
      ? this.hashMarketOffer(offer as MarketOffer)
      : this.hashLoanOffer(offer as LoanOffer);
  }

  public hashMarketOffer(offer: MarketOffer): string {
    return TypedDataEncoder.hashStruct("MarketOffer", MARKET_OFFER_TYPE, offer);
  }

  public hashLoanOffer(offer: LoanOffer): string {
    return TypedDataEncoder.hashStruct("LoanOffer", LOAN_OFFER_TYPE, offer);
  }

  public hashLien(lien: Lien): string {
    // TODO: implement abi coder
    return "";
  }

  public hashEscrow(escrow: EscrowStruct): string {
    // TODO: implement abi coder
    return "";
  }

  public blocktime(): Promise<any> {
    return this.provider.getBlock("latest").then((block) => {
      if (!block) {
        throw new Error("Block not found");
      }
      return block.timestamp
    });
  }

  public mulFee(amount: bigint | string | number, rate: bigint | string | number) {
    return BigInt(amount) * BigInt(rate) / BASIS_POINTS_DIVISOR;
  }

  public safeFactorMul(amount: Numberish, factor: Numberish): bigint {
    return (BigInt(amount) * (10_000n + BigInt(factor))) / 10_000n;
  }

  // ==============================================
  //                    EXECUTION
  // ==============================================

  // public async executeSendTxns(
  //   steps: (SendStep)[],
  //   signer: Signer | JsonRpcSigner
  // ): Promise<string[]> {
  //   const results: string[] = [];

  //   for (const step of steps) {
  //     if (step.action === StepAction.SEND) {
  //       const txn = await step.send(signer);
  //       results.push(txn);
  //     }
  //   }

  //   return results;
  // }

  // public bundleUserOps(
  //   steps: (SendStep)[]
  // ): Promise<string[]> {
  //   const ops: UserOp[] = [];

  //   for (const step of steps) {
  //     if (step.action === StepAction.SEND) {
  //       ops.push(step.userOp);
  //     }
  //   }

  //   return results;
  // }
}

import {
  ADDRESS_ZERO,
  BASIS_POINTS_DIVISOR,
  KETTLE_CONTRACT_NAME,
  KETTLE_CONTRACT_VERSION,
  LOAN_OFFER_TYPE,
  MARKET_OFFER_TYPE
} from "./constants";

import {
  Provider,
  Signer,
  JsonRpcProvider,
  JsonRpcSigner,
  TypedDataEncoder,
  Addressable,
  MaxUint256
} from "ethers";

import type {
  KettleContract,
  CreateMarketOfferInput,
  MarketOffer,
  OfferWithSignature,
  CreateLoanOfferInput,
  LoanOffer,
  Numberish,
  Lien,
  LienStruct,
  CurrentDebt,
  TakeOfferInput,
  Validation,
  SendStep,
  SignStep,
  UserOp,
  Payload,
  ValidateTakeOfferInput
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

import {
  verifyMessage
} from "@ambire/signature-validator";

export class Kettle {

  public contract: KettleContract;
  public contractAddress: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public kettleInterface: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public lendingIface: any;

  private provider: Provider;

  public constructor(
    _providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner,
    _contractAddress: string
  ) {

    const provider =
      "provider" in _providerOrSigner
        ? _providerOrSigner.provider
        : _providerOrSigner;

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

    this.kettleInterface = Kettle__factory.createInterface();
    this.lendingIface = LendingController__factory.createInterface();
  }

  public connect(_providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner) {
    return new Kettle(_providerOrSigner, this.contractAddress);
  }

  // =============================================
  //                 CREATE OFFERS                
  // =============================================

  /**
   * Create a new Market Offer
   * 
   * @param input Offer parameters
   * @param input.lien {Lien} (optional) lien structure
   * @param input.salt {Numberish} (optional) salt to cancel existing offer
   */
  public async createMarketOffer(
    input: CreateMarketOfferInput,
    maker: string | Addressable
  ): Promise<(SendStep | SignStep)[]> {
    const _maker = await this._resolveAddress(maker);
    const offer = await this._formatMarketOffer(_maker, input);

    // get approval steps
    const approvalActions: SendStep[] = await this._getCreateApprovalActions(
      offer,
      _maker,
      input.lien
    );

    let cancelSteps: SendStep[] = [];
    if (input.salt) {
      cancelSteps = await this.cancelOffers([input.salt]);
    }

    // get sign step
    const createOfferAction: SignStep = {
      action: StepAction.SIGN,
      type: "sign-offer",
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

    return [...cancelSteps, ...approvalActions, createOfferAction];
  }

  /**
   * Create a new Loan Offer
   * 
   * @param input Offer parameters
   * @param input.lien {Lien} (optional) lien structure
   * @param input.salt {Numberish} (optional) salt to cancel existing offer
   */
  public async createLoanOffer(
    input: CreateLoanOfferInput,
    maker: string | Addressable
  ): Promise<(SendStep | SignStep)[]> {
    const _maker = await this._resolveAddress(maker);
    const offer = await this._formatLoanOffer(_maker, input);

    // get approval steps
    const approvalActions = await this._getCreateApprovalActions(
      offer,
      _maker,
      input.lien
    );

    let cancelSteps: SendStep[] = [];
    if (input.salt) {
      cancelSteps = await this.cancelOffers([input.salt]);
    }

    // get sign step
    const createOfferAction: SignStep = {
      action: StepAction.SIGN,
      type: "sign-offer",
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

    return [...cancelSteps, ...approvalActions, createOfferAction];
  }

  // =============================================
  //                  TAKE OFFERS                
  // =============================================

  /**
   * Take a Market Offer
   * 
   * @param input Take Offer Input
   * @param input.lienId {Numberish} (optional) lien id
   * @param input.lien {Lien} (optional) lien structure
   */
  public async takeMarketOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    const approvalActions = await this._getTakeApprovalActions(
      input,
      _taker
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "take-market-offer",
      userOp: (input.lien && input.lienId) ? {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("fulfillMarketOfferInLien"),
          [
            input.lienId,
            input.lien,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      } : {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("fulfillMarketOffer"),
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

  /**
   * Take a Loan Offer
   * 
   * @param input Take Offer Input
   * @param input.lienId {Numberish} (optional) lien id
   * @param input.lien {Lien} (optional) lien structure
   */
  public async takeLoanOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    const approvalActions = await this._getTakeApprovalActions(
      input,
      _taker
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "take-loan-offer",
      userOp: (input.lien && input.lienId) ? {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("fulfillLoanOfferInLien"),
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
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("fulfillLoanOffer"),
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

  /**
   * Escrow a Market Offer
   * @notice The offer must be SOFT
   */
  public async escrowMarketOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    if (input.offer.side === Side.BID) {
      throw new Error("Invalid side: cannot take side bid");
    }

    const approvalActions = await this._getTakeApprovalActions(
      input,
      _taker
    );

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "escrow-market-offer",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("escrowMarketOffer"),
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
          input.proof ?? []
        );

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  // ==============================================
  //                LENDING ACTIONS
  // ==============================================

  /**
   * Repay an existing lien
   */
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
      this.safeFactorMul(debt, 100),
      false
    );

    const repayAction: SendStep = {
      action: StepAction.SEND,
      type: "repay-loan",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("repayLien"),
          [lienId, lien]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).repayLien(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, repayAction];
  }

  /**
   * Claim a defaulted lien
   */
  public async claim(
    lienId: Numberish,
    lien: Lien
  ): Promise<SendStep[]> {
    const claimAction: SendStep = {
      action: StepAction.SEND,
      type: "claim-default",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("claimLien"),
          [lienId, lien]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).claimLien(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [claimAction];
  }

  // ==============================================
  //                ORDER ACTIONS
  // ==============================================

  /**
   * Cancel offers
   * @param salts {string[]} salts of offers to cancel
   * @returns 
   */
  public async cancelOffers(salts: Numberish[]): Promise<SendStep[]> {
    const cancelAction: SendStep = {
      action: StepAction.SEND,
      type: "cancel-offers",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("cancelOffers"),
          [salts]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).cancelOffers(salts);
        return this._confirmTransaction(txn.hash);
      }
    };

    return [cancelAction];
  }

  // ==============================================
  //                 VALIDATIONS
  // ==============================================

  public async validateSignature(
    offer: MarketOffer | LoanOffer,
    signature: string
  ): Promise<void> {

    const payload = offer.kind === OfferKind.MARKET
      ? await this._marketOfferPayload(offer as MarketOffer)
      : await this._loanOfferPayload(offer as LoanOffer);

    delete payload['types']['EIP712Domain'];

    const isValidSig = await verifyMessage({
      signer: offer.maker,
      typedData: payload,
      signature,

      // @ts-expect-error provider is not in the interface
      provider: this.provider,
    })

    if (!isValidSig) {
      throw new Error("Invalid signature");
    }
  }

  public async validateOffer(
    offer: MarketOffer | LoanOffer,
    lien?: Lien
  ): Promise<void> {
    const operator = this.contractAddress;

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
              valid: BigInt(offer.terms.amount) - BigInt(amountTaken) >= BigInt((offer as LoanOffer).terms.maxAmount),
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
              reason: "Maker has not approved collateral"
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
              reason: "Maker has insufficient allowance for rebate"
            }) as Validation),
          currencyBalance(offer.maker, offer.terms.currency, this.provider)
            .then((balance) => ({
              check: "balance",
              valid: balance >= rebateAmount,
              reason: "Maker has insufficient balance for rebate"
            }) as Validation)
        );
      }
    }

    if (lien) {
      if (lienDefaulted(lien.startTime, lien.duration, lien.gracePeriod)) {
        throw new Error("[match-terms]: Lien is defaulted");
      }
      
      this._matchTerms({
        currency: offer.terms.currency,
        collection: offer.collateral.collection,
        tokenId: offer.side === Side.ASK ? offer.collateral.identifier : undefined
      }, lien);

      if (offer.side === Side.ASK) {
        const netAmount = BigInt(offer.terms.amount) - this.mulFee(offer.terms.amount, offer.fee.rate);
        validationPromises.push(
          this.currentDebt(lien)
            .then(({ debt }) => ({
              check: "debt-covers-ask",
              valid: netAmount >= BigInt(debt),
              reason: "Current lien debt exceeds ask amount"
            }) as Validation)
        );
      }
    }

    await this._executeValidations(validationPromises);
  }

  public async validateTakeOffer(
    user: string,
    input: ValidateTakeOfferInput
  ): Promise<void>{

    // validate offer maker params
    await this.validateOffer(input.offer);

    const validationPromises: Promise<Validation>[] = [];

    if (input.lien) {
      this._matchTerms({
        currency: input.offer.terms.currency,
        collection: input.offer.collateral.collection,
        tokenId: input.tokenId
      }, input.lien);
    }

    if (input.offer.side === Side.BID && !input.lien) {
      validationPromises.push(
        TestERC721__factory.connect(input.offer.collateral.collection, this.provider)
          .ownerOf(input.tokenId)
          .then((owner) => ({
            check: "ownership",
            valid: equalAddresses(owner, user),
            reason: "Taker not owner of token"
          }))
      );

      if (input.offer.kind === OfferKind.LOAN) {
        if (!input.amount) {
          throw new Error("Take loan offer bid requires amount");
        }

        if (BigInt(input.amount) > BigInt((input.offer as LoanOffer).terms.maxAmount)) {
          throw new Error("Amount exceeds loan max amount");
        }
      }

      if (input.offer.soft) {
        throw new Error("Cannot take soft offer as bid");
      }
    } else {
        // TODO: validate amount needed if lender is buying asset in lien

        validationPromises.push(
          currencyBalance(user, input.offer.terms.currency, this.provider)
            .then((balance) => ({
              check: "balance",
              valid: balance >= BigInt(input.offer.terms.amount),
              reason: "Taker has insufficient balance"
            }) as Validation)
        );
      }
    
    await this._executeValidations(validationPromises);
  }

  public async validateCreateOffer(
    user: string,
    input: CreateMarketOfferInput | CreateLoanOfferInput
  ): Promise<void> {

    console.log(user, input)
    
    const validationPromises: Promise<Validation>[] = [];

    if (input.side === Side.BID) {
      validationPromises.push(
        currencyBalance(user, await this._resolveAddress(input.currency), this.provider)
          .then((balance) => ({
            check: "balance",
            valid: balance >= BigInt(input.amount),
            reason: "Insufficient balance"
          }) as Validation)
      );
    } else {

      if (input.lien) {
        if (lienDefaulted(input.lien.startTime, input.lien.duration, input.lien.gracePeriod)) {
          throw new Error("[match-terms]: Lien is defaulted");
        }

        this._matchTerms(
          {
            currency: await this._resolveAddress(input.currency),
            collection: await this._resolveAddress(input.collection),
            tokenId: input.side === Side.ASK ? input.identifier : undefined
          },
          input.lien
        );

        const netAmount = BigInt(input.amount) - this.mulFee(input.amount, input.fee);
        validationPromises.push(
          this.currentDebt(input.lien)
            .then(({ debt }) => ({
              check: "debt-covers-ask",
              valid: netAmount >= BigInt(debt),
              reason: "Current lien debt exceeds ask amount"
            }) as Validation)
        );
      } else {
        
        validationPromises.push(
          collateralBalance(user, await this._resolveAddress(input.collection), input.identifier, this.provider)
            .then((owns) => ({
              check: "ownership",
              valid: owns,
              reason: "Maker does not own collateral"
            }) as Validation)
        );
      }
    }

    await this._executeValidations(validationPromises);
  }

  private _matchTerms(
    input: {
      tokenId?: Numberish,
      currency: string,
      collection: string,
    },
    lien: Lien,
  ): void {
    if (!equalAddresses(input.currency, lien.currency)) {
      throw new Error("[match-terms]: Currency mismatch");
    }

    if (!equalAddresses(input.collection, lien.collection)) {
      throw new Error("[match-terms]: Collection mismatch");
    }

    if (input.tokenId && input.tokenId != lien.tokenId) {
      throw new Error("[match-terms]: TokenId mismatch");
    }
  }

  private async _executeValidations(validations: Promise<Validation>[]): Promise<void> {
    const results = await Promise.all(validations);

    for (const result of results) {
      console.log(result);
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

  public async currentLender(lienId: Numberish): Promise<string> {
    const controller = await this._lendingController();
    return controller.currentLender(lienId);
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
    const operator = this.contractAddress;

    const approvalActions: SendStep[] = [];

    const allowance = await currencyAllowance(user, currency, operator, this.provider);

    if (allowance < BigInt(amount)) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "approve-erc20",
        userOp: {
          to: currency,
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
    const operator = this.contractAddress;

    const approvalActions: SendStep[] = [];

    const approved = await collateralApprovals(user, collection, operator, this.provider);

    if (!approved) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "approve-erc721",
        userOp: {
          to: collection,
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
    offer: MarketOffer | LoanOffer,
    maker: string,
    lien?: Lien
  ): Promise<SendStep[]> {
    const approvalActions: SendStep[] = [];

    if (offer.side === Side.BID) {
      const _approvalActions = await this._erc20Approvals(
        maker,
        offer.terms.currency,
        BigInt(offer.terms.amount),
        true
      );

      approvalActions.push(..._approvalActions);

    } else {

      // only get erc721 approvals if not in lien
      if (!(lien && equalAddresses(lien.borrower, maker))) {
        const _approvalActions = await this._erc721Approvals(
          maker,
          offer.collateral.collection
        );
  
        approvalActions.push(..._approvalActions);
      }

      if (offer.kind == OfferKind.MARKET && offer.terms.rebate && BigInt(offer.terms.rebate) > 0) {
        const rebateAmount = this.mulFee(offer.terms.amount, offer.terms.rebate);
        const _approvalActions = await this._erc20Approvals(
          maker,
          offer.terms.currency,
          rebateAmount
        );

        approvalActions.push(..._approvalActions);
      }
    }

    return approvalActions;
  }

  private async _getTakeApprovalActions(
    input: TakeOfferInput,
    taker: string
  ): Promise<SendStep[]> {

    // calculate proceeds to taker
    let proceeds = 0n;
    if (input.offer.kind === OfferKind.MARKET) {
      proceeds = BigInt(input.offer.terms.amount) - this.mulFee(input.offer.terms.amount, input.offer.fee.rate);
    } else {
      if (input.offer.side === Side.BID) {
        proceeds = input.amount ?
          BigInt(input.amount) :
          BigInt((input.offer as LoanOffer).terms.maxAmount);
      } else {
        proceeds = BigInt((input.offer as LoanOffer).terms.amount);
      }
    }

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

      // in lien, might need to approve extra amount
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
    const lendingController = await this.contract.LENDING_CONTROLLER();
    return LendingController__factory.connect(lendingController, this.provider);
  }

  private async _escrowController() {
    const escrowController = await this.contract.ESCROW_CONTROLLER();
    return EscrowController__factory.connect(escrowController, this.provider);
  }

  // ==============================================
  //           SIGNER AND PROVIDER METHODS
  // ==============================================

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

  private async _marketOfferPayload(offer: MarketOffer): Promise<Payload> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      MARKET_OFFER_TYPE,
      offer
    );
  }

  private async _loanOfferPayload(offer: LoanOffer): Promise<Payload> {
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

  // public hashLien(lien: Lien): string {
  //   // TODO: implement abi coder
  //   return "";
  // }

  // public hashEscrow(escrow: EscrowStruct): string {
  //   // TODO: implement abi coder
  //   return "";
  // }

  public blocktime(): Promise<number> {
    return this.provider.getBlock("latest").then((block) => {
      if (!block) {
        throw new Error("Block not found");
      }
      return block.timestamp
    });
  }

  public async paymentData(lien: Lien, offer: (MarketOffer | LoanOffer)) {
    let proceeds = 0n;
    let fee = 0n;

    if (offer.kind == OfferKind.MARKET) {
      fee = this.mulFee(offer.terms.amount, offer.fee.rate);
      proceeds = BigInt(offer.terms.amount) - fee;
    } else {
      proceeds = BigInt((offer as LoanOffer).terms.maxAmount)
    }

    const { debt } = await this.currentDebt(lien);
    
    let owed = 0n;
    let payed = 0n;
    
    if (BigInt(debt) > proceeds) {
      owed = BigInt(debt) - proceeds;
    } else {
      payed = proceeds - BigInt(debt);
    }

    return {
      proceeds,
      fee,
      owed,
      payed
    }
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

  public async bundleSendTxns(
    steps: SendStep[],
    signer: Signer | JsonRpcSigner
  ): Promise<string[]> {
    const results: string[] = [];

    for (const step of steps) {
      if (step.action === StepAction.SEND) {
        const txn = await step.send(signer);
        results.push(txn);
      }
    }

    return results;
  }

  public bundleUserOps(
    steps: (SendStep)[]
  ): UserOp[] {
    const ops: UserOp[] = [];

    for (const step of steps) {
      if (step.action === StepAction.SEND) {
        ops.push(step.userOp);
      }
    }

    return ops;
  }
}

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
  AbiCoder
} from "ethers";

import type { 
  KettleContract,
  CreateMarketOfferInput,
  CreateOfferAction,
  ApprovalAction,
  MarketOffer,
  OfferWithSignature,
  TakeOfferAction,
  CreateLoanOfferInput,
  LoanOffer,
  GenericOfferTerms,
  CollateralTerms,
  Numberish,
  Lien,
  LienStruct,
  EscrowStruct,
  CurrentDebt,
  RepayAction,
  ClaimAction,
  Permit,
  TakeOfferInput
} from "./types";

import {
  Criteria,
  OfferType,
  Side,
  Kettle__factory,
  LendingController__factory,
  EscrowController__factory,
  TestERC20__factory,
  TestERC721__factory
} from "./types";

import {
  randomSalt,
  collateralApprovals,
  currencyBalance,
  currencyAllowance,
  collateralBalance,
  equalAddresses
} from "./utils";

export class Kettle {

  public contract: KettleContract;
  public contractAddress: string;
  public iface: any;

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
  }

  public connect(signer: Signer) {
    const _kettle =  new Kettle(signer, this.contractAddress);
    return _kettle;
  }

  // ==============================================
  //                CREATE OFFERS
  // ==============================================

  public async createMarketOffer(
    input: CreateMarketOfferInput,
    accountAddress?: string
  ): Promise<(CreateOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const maker = accountAddress ?? (await signer.getAddress());

    const offer = await this._formatMarketOffer(maker, input);

    const approvalActions: ApprovalAction[] = [];
    if (!(offer.side === Side.ASK && input.lien && equalAddresses(input.lien.borrower, maker))) {
      const _approvalActions = await this._getCreateApprovalActions(
        input.side,
        maker,
        offer.terms,
        offer.collateral
      );

      approvalActions.push(..._approvalActions);
    }

    const createOfferAction: CreateOfferAction = {
      type: "create",
      offer: offer,
      payload: await this._marketOfferPayload(offer),
      create: async (): Promise<OfferWithSignature> => {
        const signature = await this._signMarketOffer(offer, accountAddress);

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
    accountAddress?: string
  ): Promise<(CreateOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const maker = accountAddress ?? (await signer.getAddress());

    const offer = await this._formatLoanOffer(maker, input);

    const approvalActions = await this._getCreateApprovalActions(
      input.side,
      maker,
      offer.terms,
      offer.collateral
    );

    const createOfferAction: CreateOfferAction = {
      type: "create",
      offer: offer,
      payload: await this._loanOfferPayload(offer),
      create: async (): Promise<OfferWithSignature> => {
        const signature = await this._signLoanOffer(offer, accountAddress);

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
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    const proceeds = BigInt(input.offer.terms.amount) - this.mulFee(input.offer.terms.amount, input.offer.fee.rate);
    const approvalActions = await this._getTakeApprovalActions(
      proceeds,
      taker,
      input
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
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
      take: async () => {
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
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    const proceeds = input.amount ?? input.offer.side === Side.BID
      ? (input.offer as LoanOffer).terms.maxAmount
      : (input.offer as LoanOffer).terms.amount;

    const approvalActions = await this._getTakeApprovalActions(
      proceeds,
      taker,
      input
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
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
      take: async () => {
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
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    if (input.offer.side === Side.BID) {
      throw new Error("Invalid side: cannot take side bid");
    }

    const approvalActions = await this._getTakeApprovalActions(
      0,
      taker,
      input
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
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
      take: async () => {
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
    accountAddress?: string
  ): Promise<(ApprovalAction | RepayAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const payer = accountAddress ?? (await signer.getAddress());

    const { debt } = await this.currentDebt(lien);

    const approvalActions = await this._erc20Approvals(
      payer,
      lien.currency,
      this.safeFactorMul(debt, 10),
      false
    );

    const repayAction = {
      type: "repay",
      repay: async () => {
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
    accountAddress?: string
  ): Promise<ClaimAction[]> {

    const signer = await this._getSigner(accountAddress);

    const claimAction = {
      type: "claim",
      claim: async () => {
        const controller = await this._lendingController();
        const txn = await controller.connect(signer).claim(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [claimAction];
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
      kind: OfferType.MARKET,
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
      nonce: await this.contract.nonces(maker)
    }
  }

  public async _formatLoanOffer(
    maker: string, 
    input: CreateLoanOfferInput
  ): Promise<LoanOffer> {

    return {
      kind: OfferType.LOAN,
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
      nonce: await this.contract.nonces(maker)
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
  ): Promise<ApprovalAction[]> {
    const signer = await this._getSigner(user);
    const operator = await this.contract.conduit();

    const approvalActions: ApprovalAction[] = [];

    const allowance = await currencyAllowance(user, currency, operator, this.provider);

    if (allowance < BigInt(amount)) {
      approvalActions.push({
        type: "approval",
        userOp: {
          target: currency,
          data: TestERC20__factory.createInterface().encodeFunctionData(
            "approve", 
            [operator, useMax ? MaxUint256 : BigInt(amount) - allowance]
          )
        },
        approve: async () => {
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
  ): Promise<ApprovalAction[]> {
    const signer = await this._getSigner(user);
    const operator = await this.contract.conduit();

    const approvalActions: ApprovalAction[] = [];

    const approved = await collateralApprovals(user, collection, operator, this.provider);

    if (!approved) {
      approvalActions.push({
        type: "approval",
        userOp: {
          target: collection,
          data: TestERC721__factory.createInterface().encodeFunctionData("setApprovalForAll", [operator, true])
        },
        approve: async () => {
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
  ): Promise<ApprovalAction[]> {

    const signer = await this._getSigner(user);
    const operator = await this.contract.conduit();

    const approvalActions: ApprovalAction[] = [];

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
  ): Promise<ApprovalAction[]> {

    const approvalActions: ApprovalAction[] = [];

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

  private async _getSigner(
    accountAddress?: string,
  ): Promise<Signer | JsonRpcSigner> {
    if (this.signer) {
      return this.signer;
    }

    if (!("send" in this.provider)) {
      throw new Error(
        "Either signer or JsonRpcProvider with signer must be provided",
      );
    }

    return (this.provider as JsonRpcProvider).getSigner(accountAddress);
  }

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

  private async _signMarketOffer(offer: MarketOffer, accountAddress?: string): Promise<string> {
    const signer = await this._getSigner(accountAddress);
    const domain = await this._getDomainData();

    return signer.signTypedData(domain, MARKET_OFFER_TYPE, offer);
  }

  private async _signLoanOffer(offer: LoanOffer, accountAddress?: string): Promise<string> {
    const signer = await this._getSigner(accountAddress);
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
}

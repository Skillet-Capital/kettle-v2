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
  CurrentDebt,
  RepayAction,
  ClaimAction,
  Permit,
  SignPermitAction
} from "./types";

import { Criteria, Kettle__factory, Side } from "./types";

import {
  randomSalt,
  collateralApprovals,
  currencyBalance,
  currencyAllowance,
  collateralBalance,
  equalAddresses
} from "./utils";
import { TestERC20__factory, TestERC721__factory } from "../typechain-types";

export class Kettle {

  public contract: KettleContract;
  public contractAddress: string;

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
  }

  public connect(signer: Signer) {
    return new Kettle(signer, this.contractAddress);
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
      payload: null,
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
      payload: null,
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
    tokenId: number | string | number,
    offer: MarketOffer,
    signature: string,
    proof?: string[],
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    const approvalActions = await this._getTakeApprovalActions(
      offer.side,
      taker,
      offer.terms,
      offer.collateral
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        const txn = await this.contract.connect(signer).fulfillMarketOffer(
          tokenId,
          offer,
          signature,
          proof ?? []
        );

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async takeMarketOfferInLien(
    lienId: Numberish,
    lien: Lien,
    offer: MarketOffer,
    signature: string,
    proof?: string[],
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    let approvalActions: ApprovalAction[] = [];
    if (offer.side === Side.BID) {
      const { debt } = await this.currentDebt(lien);
      const netAmount = BigInt(offer.terms.amount) - this.mulFee(offer.terms.amount, offer.fee.rate);

      if (BigInt(debt) > netAmount) {
        const _approvalActions = await this._erc20Approvals(taker, lien.currency, this.safeFactorMul(BigInt(debt) - netAmount, 100));
        approvalActions.push(..._approvalActions);
      }
    } else {
      const _approvalActions = await this._erc20Approvals(taker, offer.terms.currency, offer.terms.amount);
      approvalActions.push(..._approvalActions);
    }

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        const txn = await this.contract.connect(signer).fulfillMarketOfferInLien(
          lienId,
          lien,
          offer,
          signature,
          proof ?? []
        );

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async takeLoanOffer(
    tokenId: Numberish,
    amount: Numberish,
    offer: LoanOffer,
    signature: string,
    proof?: string[],
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    const approvalActions = await this._getTakeApprovalActions(
      offer.side,
      taker,
      offer.terms,
      offer.collateral
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        const txn = await this.contract.connect(signer).fulfillLoanOffer(
          tokenId,
          amount,
          offer,
          signature,
          proof ?? []
        );

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async escrowMarketOffer(
    offer: MarketOffer,
    signature: string,
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    if (offer.side === Side.BID) {
      throw new Error("Invalid side: cannot take side bid");
    }

    const approvalActions = await this._getTakeApprovalActions(
      offer.side,
      taker,
      offer.terms,
      offer.collateral
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        let txn: any;

        if (offer.side === Side.ASK) {
          txn = await this.contract.connect(signer).escrowBuy(
            offer,
            signature
          );
        } else {
          throw new Error("Invalid side");
        }

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async takeLoanOfferInLien(
    lienId: Numberish,
    amount: Numberish,
    lien: Lien,
    offer: LoanOffer,
    signature: string,
    proof?: string[],
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    const approvalActions: ApprovalAction[] = [];
    if (offer.side === Side.BID) {
      const { debt } = await this.currentDebt(lien);

      if (BigInt(debt) > BigInt(amount)) {
        const _approvalActions = await this._erc20Approvals(taker, lien.currency, this.safeFactorMul(BigInt(debt) - BigInt(amount), 100));
        approvalActions.push(..._approvalActions);
      }
    } else {
      const _approvalActions = await this._erc20Approvals(taker, offer.terms.currency, offer.terms.amount);
      approvalActions.push(..._approvalActions);
    }

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        const txn = await this.contract.connect(signer).fulfillLoanOfferInLien(
          lienId,
          amount ?? offer.terms.maxAmount,
          lien,
          offer,
          signature,
          proof ?? []
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
        const txn = await this.contract.connect(signer).repay(lienId, lien as LienStruct);
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
        const txn = await this.contract.connect(signer).claim(lienId, lien as LienStruct);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [claimAction];
  }

  // ==============================================
  //                CONTRACT METHODS
  // ==============================================

  public async currentDebt(lien: Lien): Promise<CurrentDebt> {
    return this.contract.computeDebt(lien);
  }

  // ==============================================
  //                FORMAT METHODS
  // ==============================================

  public async _formatMarketOffer(
    maker: string, 
    input: CreateMarketOfferInput
  ): Promise<MarketOffer> {

    return {
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
    const operator = await this.contract.getAddress();

    const approvalActions: ApprovalAction[] = [];

    const allowance = await currencyAllowance(user, currency, operator, this.provider);

    if (allowance < BigInt(amount)) {
      approvalActions.push({
        type: "approval",
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
    const operator = await this.contract.getAddress();

    const approvalActions: ApprovalAction[] = [];

    const approved = await collateralApprovals(user, collection, operator, this.provider);

    if (!approved) {
      approvalActions.push({
        type: "approval",
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
    const operator = await this.contract.getAddress();

    const approvalActions: ApprovalAction[] = [];

    if (side === Side.BID) {
      const allowance = await currencyAllowance(
        user,
        terms.currency,
        operator,
        this.provider
      );

      if (allowance < BigInt(terms.amount)) {
        approvalActions.push({
          type: "approval",
          approve: async () => {
            const currency = TestERC20__factory.connect(terms.currency, signer);
            const txn = await currency.approve(operator, MaxUint256);
            return this._confirmTransaction(txn.hash);
          }
        })
      }

      return approvalActions;
    
    } else {
      const approved = await collateralApprovals(
        user,
        collateral.collection,
        operator,
        this.provider
      );
  
      if (!approved) {
        approvalActions.push({
          type: "approval",
          approve: async () => {
            const contract = TestERC721__factory.connect(collateral.collection, signer);
            const tx = await contract.setApprovalForAll(operator, true);
            return this._confirmTransaction(tx.hash);
          }
        })
      }

      if (terms.rebate && BigInt(terms.rebate) > 0) {
        const allowance = await currencyAllowance(
          user,
          terms.currency,
          operator,
          this.provider
        );

        const rebateAmount = this.mulFee(terms.amount, terms.rebate);
        if (allowance < rebateAmount) {
          approvalActions.push({
            type: "approval",
            approve: async () => {
              const currency = TestERC20__factory.connect(terms.currency, signer);
              const txn = await currency.approve(operator, rebateAmount);
              return this._confirmTransaction(txn.hash);
            }
          })
        }
      }

      return approvalActions;
    }
  }

  private async _getTakeApprovalActions(
    side: Side,
    user: string,
    terms: GenericOfferTerms,
    collateral: CollateralTerms
  ): Promise<ApprovalAction[]> {

    const signer = await this._getSigner(user);
    const operator = await this.contract.getAddress();

    const approvalActions: ApprovalAction[] = [];

    if (side === Side.BID) {

      const approved = await collateralApprovals(
        user,
        collateral.collection,
        operator,
        this.provider
      );
  
      if (!approved) {
        approvalActions.push({
          type: "approval",
          approve: async () => {
            const contract = TestERC721__factory.connect(collateral.collection, signer);
            const tx = await contract.setApprovalForAll(operator, true);
            return this._confirmTransaction(tx.hash);
          }
        })
      }

      return approvalActions;
    
    } else {
      const allowance = await currencyAllowance(
        user,
        terms.currency,
        operator,
        this.provider
      );
  
      if (allowance < BigInt(terms.amount)) {
        approvalActions.push({
          type: "approval",
          approve: async () => {
            const currency = TestERC20__factory.connect(terms.currency, signer);
            const txn = await currency.approve(operator, BigInt(terms.amount) - allowance);
            return this._confirmTransaction(txn.hash);
          }
        })
      }

      return approvalActions;
    }
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

  private async _signPermit(permit: Permit, accountAddress?: string): Promise<string> {
    const signer = await this._getSigner(accountAddress);
    const domain = await this._getDomainData();

    return signer.signTypedData(domain, PERMIT_TYPE, permit);
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
    return keccak256(
      solidityPacked(
        [
          "address",  // borrower
          "address",  // collection
          "uint256",  // tokenId
          "address",  // currency
          "uint256",  // principal
          "uint256",  // rate
          "uint256",  // defaultRate
          "uint256",  // duration
          "uint256",  // gracePeriod
          "address",  // recipient
          "uint256",  // fee
          "uint256"   // startTime
        ],
        [
          lien.borrower, 
          lien.collection, 
          lien.tokenId, 
          lien.currency, 
          lien.principal, 
          lien.rate, 
          lien.defaultRate, 
          lien.duration, 
          lien.gracePeriod, 
          lien.recipient, 
          lien.fee, 
          lien.startTime
        ]
      )
    );
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


/**
  public async createPermit(
    type: "market" | "loan",
    offer: MarketOffer | LoanOffer,
    accountAddress?: string
  ): Promise<SignPermitAction[]> {

    const signer = await this._getSigner(accountAddress);
    const taker = accountAddress ?? (await signer.getAddress());

    let offerHash: string;
    if (type === "market") {
      offerHash = this.hashMarketOffer(offer as MarketOffer);
    } else if (type === "loan") {
      offerHash = this.hashLoanOffer(offer as LoanOffer);
    } else {
      throw new Error("Invalid offer type: expected 'market' or 'loan'");
    }

    const signPermitAction: SignPermitAction = {
      type: "permit",
      payload: null,
      permit: async () => {
        const permit: Permit = {
          taker,
          currency: offer.terms.currency,
          amount: offer.terms.amount,
          offerHash: offerHash,
          salt: randomSalt(),
          expiration: await this.blocktime() + (60 * 10), // 10 minutes
          nonce: await this.contract.nonces(taker),
        }

        const signature = await this._signPermit(permit, accountAddress);

        return {
          permit,
          signature
        }
      }
    } as const;

    return [signPermitAction];
  }


 */
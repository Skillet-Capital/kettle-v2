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
  ClaimAction
} from "./types";

import { Criteria, Kettle__factory, Side } from "./types";

import {
  randomSalt,
  collateralApprovals,
  currencyBalance,
  currencyAllowance,
  collateralBalance
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
    const maker = accountAddress ?? (await signer.getAddress());

    const approvalActions = await this._getTakeApprovalActions(
      offer.side,
      maker,
      offer.terms,
      offer.collateral
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        let txn: any;

        if (offer.side === Side.ASK) {
          txn = await this.contract.connect(signer).buy(
            offer,
            signature
          );
        } else if (offer.side === Side.BID) {
          txn = await this.contract.connect(signer).sell(
            tokenId,
            offer,
            signature,
            proof ?? []
          );
        } else {
          throw new Error("Invalid side");
        }

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async takeLoanOffer(
    tokenId: number | string | number,
    offer: LoanOffer,
    signature: string,
    proof?: string[],
    amount?: string | number | bigint,
    accountAddress?: string
  ): Promise<(TakeOfferAction | ApprovalAction)[]> {

    const signer = await this._getSigner(accountAddress);
    const maker = accountAddress ?? (await signer.getAddress());

    const approvalActions = await this._getTakeApprovalActions(
      offer.side,
      maker,
      offer.terms,
      offer.collateral
    );

    const takeOfferAction: TakeOfferAction = {
      type: "take",
      take: async () => {
        let txn: any;

        if (offer.side === Side.ASK) {
          txn = await this.contract.connect(signer).lend(
            offer,
            signature
          );
        } else if (offer.side === Side.BID) {
          txn = await this.contract.connect(signer).borrow(
            tokenId,
            amount ?? offer.terms.maxAmount,
            offer,
            signature,
            proof ?? []
          );
        } else {
          throw new Error("Invalid side");
        }

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
        rebate: 0,
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
  
      const approvalActions: ApprovalAction[] = [];
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

  public async _signMarketOffer(offer: MarketOffer, accountAddress?: string) {
    const signer = await this._getSigner(accountAddress);
    const domain = await this._getDomainData();

    return signer.signTypedData(domain, MARKET_OFFER_TYPE, offer);
  }

  public async _signLoanOffer(offer: LoanOffer, accountAddress?: string) {
    const signer = await this._getSigner(accountAddress);
    const domain = await this._getDomainData();

    return signer.signTypedData(domain, LOAN_OFFER_TYPE, offer);
  }

  // ==============================================
  //                    UTILS
  // ==============================================

  public mulFee(amount: bigint | string | number, rate: bigint | string | number) {
    return BigInt(amount) * BigInt(rate) / BASIS_POINTS_DIVISOR;
  }

  public safeFactorMul(amount: Numberish, factor: Numberish): bigint {
    return (BigInt(amount) * (10_000n + BigInt(factor))) / 10_000n;
  }
}

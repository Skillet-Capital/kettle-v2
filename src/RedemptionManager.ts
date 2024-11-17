import { Addressable, ethers, JsonRpcProvider, JsonRpcSigner, MaxUint256, Provider, Signer, TypedDataEncoder } from "ethers";
import { Asset, ChargeWithSignature, Numberish, OfferWithSignature, Payload, RedemptionCharge, RedemptionManager__factory, RedemptionManagerContract, RedemptionSignStep, SendStep, SignStep, StepAction, TestERC20__factory, TestERC721__factory } from "./types";
import { collateralApprovals, currencyAllowance, randomSalt } from "./utils";
import { REDEMPTION_CHARGE_TYPE, REDEMPTION_MANAGER_NAME, REDEMPTION_MANAGER_VERSION } from "./constants";

export class RedemptionManager {

  public contract: RedemptionManagerContract;
  public contractAddress: string;

  public redemptionManagerInterface: any;

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
    this.contract = RedemptionManager__factory.connect(
      _contractAddress,
      this.provider
    );

    this.redemptionManagerInterface = RedemptionManager__factory.createInterface();
  }

  public async createRedemptionCharge({
    redeemer,
    currency,
    amount,
    expiration,
    assets
  }: {
    redeemer: Addressable;
    currency: Addressable;
    amount: Numberish;
    expiration: Numberish;
    assets: Asset[];
  }): Promise<RedemptionSignStep> {
    const admin = await this.contract.admin();
    const nonce = await this.contract.nonce();

    const redemptionCharge: RedemptionCharge = {
      nonce,
      admin,
      amount,
      expiration,
      salt: randomSalt(),
      assets: await Promise.all(
        assets.map(async (asset) => {
          return {
            collection: await this._resolveAddress(asset.collection),
            tokenId: asset.tokenId,
          };
        })
      ),
      redeemer: await this._resolveAddress(redeemer),
      currency: await this._resolveAddress(currency),
    }

    return {
      action: StepAction.SIGN,
      type: "sign-redemption-charge",
      charge: redemptionCharge,
      payload: await this._redemptionChargePayload(redemptionCharge),
      sign: async (signer: Signer): Promise<ChargeWithSignature> => {
        const signature = await this._signRedemptionCharge(redemptionCharge, signer);
        return { charge: redemptionCharge, signature };
      }
    } as const;
  }

  public async redeem({
    charge,
    signature
  }: ChargeWithSignature,
    taker: Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    const allowanceActions = await this._erc20Approvals(
      _taker,
      charge.currency,
      charge.amount
    );


    const approvalAction = [];
    for (const asset of charge.assets) {
      approvalAction.push(...await this._erc721Approvals(_taker, asset.collection));
    };

    const redeemAction: SendStep = {
      action: StepAction.SEND,
      type: "redeem",
      userOp: {
        to: this.contractAddress,
        data: this.redemptionManagerInterface.encodeFunctionData(
          "redeem",
          [charge, signature]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).redeem(charge, signature);
        return this._confirmTransaction(txn.hash);
      }
    }

    return [...allowanceActions, ...approvalAction, redeemAction];
  }

  private async _signRedemptionCharge(
    charge: RedemptionCharge,
    signer: Signer 
  ): Promise<string> {
    const domain = await this._getDomainData();
    return signer.signTypedData(domain, REDEMPTION_CHARGE_TYPE, charge);
  };

  private async _redemptionChargePayload(charge: RedemptionCharge): Promise<Payload> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      REDEMPTION_CHARGE_TYPE,
      charge
    );
  }

  private async _getDomainData() {
    const { chainId } = await this.provider.getNetwork();

    return {
      name: REDEMPTION_MANAGER_NAME,
      version: REDEMPTION_MANAGER_VERSION,
      chainId,
      verifyingContract: await this.contract.getAddress()
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
}

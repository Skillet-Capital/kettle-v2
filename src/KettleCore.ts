import {
  Provider,
  Signer,
  JsonRpcProvider,
  JsonRpcSigner,
  Addressable,
} from "ethers";

import type { KettleContract } from "./types";
import { Kettle__factory } from "./types";

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

  // ==============================================
  //           SIGNER AND PROVIDER METHODS
  // ==============================================

  async _getSigner(
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

  async _confirmTransaction(
    hash: string,
    confirmations?: number,
    timeout?: number
  ): Promise<string> {
    try {
      await this.provider.waitForTransaction(hash, confirmations, timeout);
      return hash;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("HardhatEthersProvider.waitForTransaction")) return hash;
      throw new Error("Unable to confirm transaction, please check block explorer and try again");
    }
  }

  async _resolveAddress(input: string | Addressable): Promise<string> {
    if (typeof input === "string") {
      return input;
    } else if (typeof input.getAddress === "function") {
      return await input.getAddress();
    }

    throw new Error("Invalid input: must be string or Addressable");
  }

  public _blocktime(): Promise<number> {
    return this.provider.getBlock("latest").then((block) => {
      if (!block) {
        throw new Error("Block not found");
      }
      return block.timestamp
    });
  }
}

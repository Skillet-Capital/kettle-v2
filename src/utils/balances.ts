import { ethers } from "ethers";
import { CollateralTerms } from "../types";
import { TestERC20__factory, TestERC721__factory } from "../../typechain-types";
import { equalAddresses } from "./equalAddresses";

export const currencyBalance = async (
  owner: string,
  currency: string,
  provider: ethers.Provider,
): Promise<bigint> => {
  const contract = TestERC20__factory.connect(currency, provider);
  return contract.balanceOf(owner);
}

export const collateralBalance = async (
  owner: string,
  collection: string,
  tokenId: string | number | bigint,
  provider: ethers.Provider,
) => {
  const contract = TestERC721__factory.connect(collection, provider);
  try {
    const _owner = await contract.ownerOf(tokenId);
    return equalAddresses(_owner, owner);
  } catch {
    return false;
  }
}

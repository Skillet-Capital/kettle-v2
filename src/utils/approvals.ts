import { ethers } from "ethers";
import { TestERC721__factory } from "../types";

export const collateralApprovals = async (
  owner: string,
  collection: string,
  operator: string,
  provider: ethers.Provider,
): Promise<boolean> => {
  const contract = TestERC721__factory.connect(collection, provider);
  return contract.isApprovedForAll(owner, operator);
}

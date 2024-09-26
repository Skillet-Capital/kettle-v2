import { ethers } from "ethers";
import { TestERC20__factory } from "../../typechain-types";

export const currencyAllowance = async (
  owner: string,
  currency: string,
  operator: string,
  provider: ethers.Provider,
): Promise<bigint> => {
  const contract = TestERC20__factory.connect(currency, provider);
  return contract.allowance(owner, operator);
}

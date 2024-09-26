import { ethers } from "ethers";

export const randomSalt = (): string => {
  return `0x${Buffer.from(ethers.randomBytes(8)).toString("hex").padStart(64, "0")}`;
};

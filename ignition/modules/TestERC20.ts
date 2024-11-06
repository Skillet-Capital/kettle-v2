import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const LockModule = buildModule("Kettle", (m) => {
  const currency = m.contract("TestERC20", [6]);

  m.call(currency, "mint", ["0x6a37E847e2CD1ce50fC9F6bbD1C89c35266bB74F", ethers.parseUnits("100000", 6)]);
  m.call(currency, "mint", ["0x2eefe055e429E51Fd5658b05F4Bd88b53434958B", ethers.parseUnits("100000", 6)], { id: "mint2"});

  return { 
    currency,
  };
});

export default LockModule;

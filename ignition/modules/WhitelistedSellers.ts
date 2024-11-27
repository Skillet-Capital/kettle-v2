import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import LockModule from "./Kettle";

const WhitelistSellers = buildModule("WhitelistSellers", (m) => {
  const { escrow } = m.useModule(LockModule);

  m.call(escrow, "whitelistedAskMaker", ["0x11D351894506e13587D4e479b6c38E68891f1492", true], { id: "whitelist_me_1" });

  return {
    escrow
  }
});

export default WhitelistSellers;

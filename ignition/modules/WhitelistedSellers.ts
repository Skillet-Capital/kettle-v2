import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleModule from "./Kettle";

const WhitelistSellers = buildModule("WhitelistSellers", (m) => {
  const { kettle } = m.useModule(KettleModule);

  m.call(kettle, "whitelistAskMaker", ["0x11D351894506e13587D4e479b6c38E68891f1492", true], { id: "whitelist_me_1" });

  return { kettle };
});

export default WhitelistSellers;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleModule from "./Kettle";

const WhitelistSellers = buildModule("whitelist_sellers_dev", (m) => {
  const { kettle } = m.useModule(KettleModule);

  m.call(kettle, "whitelistAskMaker", ["0x11D351894506e13587D4e479b6c38E68891f1492", true], { id: "whitelist_me_1" });
  m.call(kettle, "whitelistAskMaker", ["0x2eefe055e429E51Fd5658b05F4Bd88b53434958B", true], { id: "whitelist_me_2" });
  m.call(kettle, "whitelistAskMaker", ["0x1D75d322906E998b3a34a93f1D69d1f0bDb9e0cC", true], { id: "whitelist_me_3" });

  return { kettle };
});

export default WhitelistSellers;

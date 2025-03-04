import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleModule from "./Kettle";

const WhitelistSellers = buildModule("whitelist_sellers_dev", (m) => {
  const { kettle } = m.useModule(KettleModule);

  m.call(kettle, "whitelistAskMaker", ["0x11D351894506e13587D4e479b6c38E68891f1492", true], { id: "whitelist_me_1" });
  m.call(kettle, "whitelistAskMaker", ["0x2eefe055e429E51Fd5658b05F4Bd88b53434958B", true], { id: "whitelist_me_2" });
  m.call(kettle, "whitelistAskMaker", ["0x1D75d322906E998b3a34a93f1D69d1f0bDb9e0cC", true], { id: "whitelist_me_3" });
  m.call(kettle, "whitelistAskMaker", ["0x940C2d8c0420Ef01BF8cc8e9d053C0E3Ee35449b", true], { id: "whitelist_me_4" });
  m.call(kettle, "whitelistAskMaker", ["0x3ebabb4da024d3346e0b42fc16c6e64fc5212870", true], { id: "whitelist_me_5" });

  m.call(kettle, "whitelistAskMaker", ["0xc15937B5D8fA57C71BCdad2b8cB2825E75AeD0fD", true], { id: "test_1" });

  m.call(kettle, "whitelistBidTaker", ["0x11d351894506e13587d4e479b6c38e68891f1492", true], { id: "whitelist_me_6" });
  m.call(kettle, "whitelistBidTaker", ["0x6a37E847e2CD1ce50fC9F6bbD1C89c35266bB74F", true], { id: "whitelist_me_7" });

  return { kettle };
});

export default WhitelistSellers;

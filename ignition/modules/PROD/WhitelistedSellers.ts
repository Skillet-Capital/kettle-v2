import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleModule from "./Kettle";

const WhitelistSellers = buildModule("whitelist_sellers_prod", (m) => {
  const { kettle } = m.useModule(KettleModule);

  m.call(kettle, "whitelistAskMaker", ["0x940C2d8c0420Ef01BF8cc8e9d053C0E3Ee35449b", true], { id: "whitelist_me_1" });
  m.call(kettle, "whitelistAskMaker", ["0x05c473fe2a7d83105576b5f8a03b7a2cb3ef7bfd", true], { id: "whitelist_me_2" });

  return { kettle };
});

export default WhitelistSellers;

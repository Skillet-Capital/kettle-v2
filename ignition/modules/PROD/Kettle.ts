import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KettleModule = buildModule("kettle_prod", (m) => {
  const owner = m.getAccount(0);

  const PROD_TOKEN_SUPPLIER = "0x6b83081d6dd1b817b8c44535578c4c7ba765d675";
  const PROD_REDEMPTION_ADMIN = "0x5b090b3c859a475644353c3596c2b92ae98c6006";
  const PROD_REDEMPTION_WALLET = "0x630aa3ff3f3d5b9ebea9bef30016778a7d3f6436";
  const PROD_ESCROW_SETTLER = "0x5add6f3bd1428ec4fddaacde0e39bf394558373f";
  const PROD_OFFER_MANAGER = "0x4f0b4fab88f7864dc200f43b11303b99bdda4f78";

  // Deploy Kettle Implementation
  const kettleImplementation = m.contract("Kettle", [], { id: "KettleImplementation" });

  // Deploy Kettle Proxy
  const kettleProxy = m.contract("TransparentUpgradeableProxy", [
    kettleImplementation,
    owner,
    "0x",
  ], { id: "KettleProxy" });

  const kettleProxyAdminAddress = m.readEventArgument(
    kettleProxy,
    "AdminChanged",
    "newAdmin",
    { id: "KettleProxyAdminChanged" }
  );

  const kettleProxyAdmin = m.contractAt("ProxyAdmin", kettleProxyAdminAddress, { id: "KettleProxyAdmin" });

  const kettle = m.contractAt("Kettle", kettleProxy, { id: "Kettle" });

  m.call(kettle, "__Kettle_init", [
    owner,
    PROD_TOKEN_SUPPLIER,
    PROD_REDEMPTION_ADMIN,
    PROD_REDEMPTION_WALLET,
    PROD_REDEMPTION_WALLET,
    PROD_ESCROW_SETTLER,
    PROD_OFFER_MANAGER
  ]);

  return { 
    kettle, 
    kettleProxyAdmin 
  };
});

export default KettleModule;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KettleModule = buildModule("kettle_dev", (m) => {
  const owner = m.getAccount(0);

  const DEV_TOKEN_SUPPLIER = "0xd50e88321Ac15643C25A23C784eD850A97527580";
  const DEV_REDEMPTION_ADMIN = "0x00BDaaDb9DdF3800703725A71c97069495915191";
  const DEV_REDEMPTION_WALLET = "0x0cFe2D2beEe2fA2D653d1Dd253231648794dD2a8";
  const DEV_ESCROW_SETTLER = "0x3fA6CC706d30F55cb71b65869D871229abeBAD74";
  const DEV_OFFER_MANAGER = "0xf2A3d3a6aE80059B517B2735786cF86b46725C56";

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
    DEV_TOKEN_SUPPLIER,
    DEV_REDEMPTION_ADMIN,
    DEV_REDEMPTION_WALLET,
    DEV_REDEMPTION_WALLET,
    DEV_ESCROW_SETTLER,
    DEV_OFFER_MANAGER
  ]);

  return { 
    kettle, 
    kettleProxyAdmin 
  };
});

export default KettleModule;

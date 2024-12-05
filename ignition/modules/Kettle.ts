import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KettleModule = buildModule("Kettle", (m) => {
  const owner = m.getAccount(0);

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

  m.call(kettle, "__Kettle_init", [owner]);

  const TOKEN_SUPPLIER = "0xd50e88321Ac15643C25A23C784eD850A97527580";
  const REDEMPTION_ADMIN = "0x00BDaaDb9DdF3800703725A71c97069495915191";
  const REDEMPTION_WALLET = "0x0cFe2D2beEe2fA2D653d1Dd253231648794dD2a8";

  m.call(kettle, "setTokenSupplier", [TOKEN_SUPPLIER]);
  m.call(kettle, "setRedemptionAdmin", [REDEMPTION_ADMIN]);
  m.call(kettle, "setRedemptionWallet", [REDEMPTION_WALLET]);
  m.call(kettle, "setRedemptionFeeCollector", [REDEMPTION_WALLET]);

  return { 
    kettle, 
    kettleProxyAdmin 
  };
});

export default KettleModule;

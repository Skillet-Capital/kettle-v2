import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RedemptionManagerModule = buildModule("RedemptionManager", (m) => {
  const owner = m.getAccount(0);

  // Deploy Redemption Manager Implementation
  const redemptionManagerImplementation = m.contract("RedemptionManager", [], 
    { id: "RedemptionManagerImplementation" }
  );

  // Deploy Redemption Manager Proxy
  const redemptionManagerProxy = m.contract("TransparentUpgradeableProxy", [
    redemptionManagerImplementation,
    owner,
    "0x"
  ], { id: "RedemptionManagerProxy" });

  const redemptionManagerProxyAddress = m.readEventArgument(
    redemptionManagerProxy,
    "AdminChanged",
    "newAdmin",
    { id: "RedemptionManagerProxyChanged" }
  );

  const redemptionManagerProxyAdmin = m.contractAt("ProxyAdmin", 
    redemptionManagerProxyAddress, 
    { id: "RedemptionManagerProxyAdmin" }
  );

  const redemptionManager = m.contractAt("RedemptionManager", 
    redemptionManagerProxy, 
    { id: "RedemptionManager" }
  );

  m.call(redemptionManager, "initialize", [
    owner,
    owner,
    owner
  ]);

  return {
    redemptionManagerImplementation,
    redemptionManager,
    redemptionManagerProxyAdmin
  }
});

export default RedemptionManagerModule;

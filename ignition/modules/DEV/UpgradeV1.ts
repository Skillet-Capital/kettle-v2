import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleModule from "./Kettle"; 

const KettleUpgradeModule = buildModule("kettle_upgrade_dev_v1", (m) => {
  const owner = m.getAccount(0);

  const { kettleProxyAdmin, kettleProxy } = m.useModule(KettleModule);

  // Deploy the new Kettle implementation
  const kettleV2Implementation = m.contract("KettleV2", [], { id: "KettleImplementationV2" });

  // Use the proxy admin to upgrade the proxy to the new implementation
  m.call(kettleProxyAdmin, "upgradeAndCall", [kettleProxy, kettleV2Implementation, "0x"], {
    from: owner
  });

  // Get a contract instance pointing to the upgraded proxy
  const kettleV2 = m.contractAt("KettleV2", kettleProxy, { id: "Kettle" });

  return { kettleV2 };
});

export default KettleUpgradeModule;

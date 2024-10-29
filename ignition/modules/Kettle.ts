import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("Kettle", (m) => {
  const owner = m.getAccount(0);

  // Deploy Lender Receipt
  const receipt = m.contract("LenderReceipt");

  // Deploy Lending Controller Implementation
  const lendingImplementation = m.contract("LendingController", [], { id: "LendingControllerImplementation" });

  // Deploy Lending Controller Proxy
  const lendingProxy = m.contract("TransparentUpgradeableProxy", [
    lendingImplementation,
    owner,
    "0x"
  ], { id: "LendingControllerProxy" });

  const lendingProxyAdminAddress = m.readEventArgument(
    lendingProxy,
    "AdminChanged",
    "newAdmin",
    { id: "LendingControllerProxyAdminChanged" }
  );

  const lendingProxyAdmin = m.contractAt("ProxyAdmin", lendingProxyAdminAddress, { id: "LendingControllerProxyAdmin" });
  
  const lending = m.contractAt("LendingController", lendingProxy, { id: "LendingController" });

  m.call(lending, "__LendingController_init", [owner, receipt]);

  m.call(receipt, "setSupplier", [lending, 1]);

  // Deploy Escrow Controller Implementation
  const escrowImplementation = m.contract("EscrowController", [], { id: "EscrowControllerImplementation" });

  // Deploy Escrow Controller Proxy
  const escrowProxy = m.contract("TransparentUpgradeableProxy", [
    escrowImplementation,
    owner,
    "0x",
  ], { id: "EscrowControllerProxy" });

  const escrowProxyAdminAddress = m.readEventArgument(
    escrowProxy,
    "AdminChanged",
    "newAdmin",
    { id: "EscrowControllerProxyAdminChanged" }
  );

  const escrowProxyAdmin = m.contractAt("ProxyAdmin", escrowProxyAdminAddress, { id: "EscrowControllerProxyAdmin" });

  const escrow = m.contractAt("EscrowController", escrowProxy, { id: "EscrowController" });

  m.call(escrow, "__EscrowController_init", [owner]);

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

  m.call(kettle, "__Kettle_init", [owner, lending, escrow]);

  m.call(lending, "setKettle", [kettle]);
  m.call(escrow, "setKettle", [kettle]);

  return { 
    receipt,
    lending, 
    escrow, 
    kettle, 
    lendingProxyAdmin, 
    escrowProxyAdmin, 
    kettleProxyAdmin 
  };
});

export default LockModule;

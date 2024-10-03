import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import 'hardhat-ignore-warnings';
import "hardhat-tracer";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 100,
            details: {
              yulDetails: {
                optimizerSteps: "u",
              },
            },
          },
        },
      },
    ]
  },
  warnings: "off",
  networks: {
    hardhat: {
      allowBlocksWithSameTimestamp: true,
      allowUnlimitedContractSize: true
    }
  },
  gasReporter: {
    enabled: false
  },
  contractSizer: {
    only: [
      ":Kettle$",
      ":Signatures$",
      ":OfferController$",
      ":LendingController$",
      ":EscrowController$",
    ]
  },
};

export default config;

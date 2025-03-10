import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import 'hardhat-ignore-warnings';
import "hardhat-tracer";

import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
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
    },
    ...(process.env.PK && process.env.BLAST_RPC && {
      blast: {
        url: process.env.BLAST_RPC,
        accounts: [
          process.env.PK!
        ]
      }
    }),
    ...(process.env.PK && process.env.BASE_RPC && {
      base: {
        url: process.env.BASE_RPC,
        accounts: [
          process.env.PK!
        ]
      }
    })
  },
  etherscan: {
    apiKey: {
      blast_sepolia: "blast_sepolia",
      blast: "PTQ5343WRG7127WRWQUQMBABZHDSZUTPFW",
      base: "228ZGK626T79PAIYKYFI631RIW2NMY52BT"
    },
    customChains: [
      {
        network: "blast_sepolia",
        chainId: 168587773,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io"
        }
      },
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  },
  gasReporter: {
    enabled: true
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

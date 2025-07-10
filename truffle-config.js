require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

/**
 * Use this file to configure your Truffle project for JCM-P2P.
 * Configured for Mumbai Testnet with Infura and secure mnemonic handling.
 * More details: https://trufflesuite.com/docs/truffle/reference/configuration
 */

module.exports = {
  /**
   * Networks define how you connect to your Ethereum client.
   * Mumbai Testnet is set for JCM-P2P development.
   */
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://polygon-mumbai.infura.io/v3/${process.env.PROJECT_ID}`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Mocha testing options (customize as needed)
  mocha: {
    timeout: 100000,
  },

  // Compiler settings for Solidity
  compilers: {
    solc: {
      version: "0.8.0", // Matches PredictionMarket.sol pragma
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  // Plugins (optional, add if needed later)
  plugins: [
    'truffle-plugin-verify'
  ],

  // API keys for verification (add to .env if using plugins)
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },

  // Truffle DB (disabled for now)
  db: {
    enabled: false,
  },
};
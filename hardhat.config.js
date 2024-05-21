require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);}});
 module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    },
    goerli: {
      url: "https://goerli.infura.io/v3/a37a5adc26bb4186b3c4bdaf30fbcbc6",
      accounts: ["de9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0"]
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/UNzNMmOTyx6YCczHzQt4Joa34juE3zuA",
      accounts: ["49e2690bd706337df7d8f7fe4bf335b569a84c012404590bf0386e93738a4636"]
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/a37a5adc26bb4186b3c4bdaf30fbcbc6",
      accounts: ["de9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0"]
    },
    etherscan: {
      url: "https://api.etherscan.io/api",
      apiKey: "9V2YWK271G29S13EIETXMGGU3ZSU2I1W1V" 
    }
  }
};


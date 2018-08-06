// Allows us to use ES6 in our migrations and tests.
require("babel-register");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "<mnemonic words>";
const walletUrl = "https://ropsten.infura.io/<private key>";
module.exports = {
  networks: {
    development : {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
	ropsten: {
		provider: new HDWalletProvider(mnemonic, walletUrl),
		network_id: 3, // official id of the ropsten network
		gas: 6000000
	}
  }
}

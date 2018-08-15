const contract = require("truffle-contract");

const metacoin_artifact = require("../build/contracts/MetaCoin.json");
const MetaCoin = contract(metacoin_artifact);

module.exports = {
  start: function(callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[0];

      callback(self.accounts);
    });
  },
  refreshBalance: function(account, callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    let meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
	  //console.log(JSON.stringify(instance));
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  
  //sendCoin: function(amount, sender, receiver, data, callback) {
	sendCoin: function(callback) {
		const self = this;

		self.web3.eth.getAccounts(function(err, accs) {
		if (err != null) {
			console.log("There was an error fetching your accounts.");
			return;
		}

		if (accs.length == 0) {
			console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			return;
		}
		self.accounts = accs;
		self.account = self.accounts[0];
		console.log("self.account=" + self.account);
		const sender = self.account;//"0x6a5d3e1f95da565fde011617b6804402b50924d6";
		const receiver = "0xeca49d2a4ad1a01412f57736efc6f40765e5b56d";
		const amount = 1000000000000000000;
		const data = "5678";
		MetaCoin.setProvider(self.web3.currentProvider);
		let meta;
		MetaCoin.deployed().then(function(instance) {
			meta = instance;
			// address receiver, uint amount, string data
			//console.log(JSON.stringify(instance));
			return meta.sendCoin(receiver, amount, data, {from: sender});
		}).then(function() {
		  self.refreshBalance(sender, function (answer) {
			callback(answer);
		  });
		}).catch(function(e) {
			console.log(e);
			callback("ERROR 404");
		});

	});
	
  }
  
  
}

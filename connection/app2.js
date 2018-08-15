const contract     = require("truffle-contract");
const BigNumber = require("bignumber.js");

const lottery_artifact = require("../build/contracts/IndexLottery.json");
const Lottery = contract(lottery_artifact);
const ADDR_LOTTERY = "0x0b7919440a9d6cc13333f95891599c90b42455f2";


module.exports = {

	start : function(callback) {
		
		const self = this;
		
		Lottery.setProvider(self.web3.currentProvider);
		
		self.web3.eth.getAccounts(function(err, accs) {
			
			if (err != null) {
				console.log(err);
				return;
			}

			if (accs.length == 0) {
				console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
				return;
			}
			
			console.log(">>>	0:" + accs[0]);
			
			callback(accs);

		
		});
		
	},
	
	ethGetBalance : function (reqAccount, callback) {
		
		const self = this;

		Lottery.setProvider(self.web3.currentProvider);
			
		self.web3.eth.getBalance(reqAccount, function(error, result) {

			if (error != null) {
				console.log(error);
				return;
			}
			
			const ethVal = self.web3.fromWei(result, "ether");

			console.log(reqAccount + ":" + ethVal);
			
			callback(ethVal);

		});

	},
	
	getBalance : function(callback) {
		
		const self = this;
		const address = ADDR_LOTTERY;
		console.log("###	[getBalance]	address=" + address);
		
		Lottery.setProvider(self.web3.currentProvider);

		let instance;
		Lottery.deployed().then(function(_instance) {
			instance = _instance;
			return instance.getBalance.call(address, {from: address});
		}).then(function(value) {
			const amount = self.web3.fromWei(value.valueOf(), "ether");
			callback(address, amount);
		}).catch(function(e) {
			console.log(e);
		});
		
	},

	deposit : function(amount, sender, callback) {
		
		const self = this;
		const receiver = ADDR_LOTTERY;
		//sender = "0x7d7a8bdd19e3cb5e56f4b431a03df65625da1022";
		
		const weiAmt =  BigNumber(self.web3.toWei(amount, "ether")).toFixed();
		
		console.log("###	[deposit]	amount=" + weiAmt + ", sender=" + sender + ", receiver=" + receiver);
		
		Lottery.setProvider(self.web3.currentProvider);
		
		self.web3.eth.sendTransaction(
			{from:sender,to:receiver,value:weiAmt},
			function(error, result) {
				if (error != null) {
					console.log(error);
					return;
				}
				console.log("result=" + result);
				
				let instance;
				let from_balance;
				let to_balance;
				
				let from_wallet_balance;
				let to_wallet_balance;
				Lottery.deployed().then(function(_instance) {
					instance = _instance;
					return instance.getBalance.call(sender, {from: sender});
				}).then(function(weiValue) {
					from_balance = self.web3.fromWei(weiValue.valueOf(), "ether");
					return instance.getBalance.call(receiver, {from: receiver});
				}).then(function(weiValue) {
					to_balance = self.web3.fromWei(weiValue.valueOf(), "ether");
					self.ethGetBalance(
						sender,
						function(value) {
							from_wallet_balance = value;
							console.log("$$$$	" + sender + ":" + from_wallet_balance + "			" + from_balance);
						}
					);
				}).then(function() {
					self.ethGetBalance(
						receiver,
						function(value) {
							to_wallet_balance = value;
							console.log("$$$$	" + receiver + ":" + to_wallet_balance + "		" + to_balance);
						}
					);
				}).then(function() {
					callback(from_balance, to_balance);
				}).catch(function(e) {
					console.log(e);
				});
				
			}
		);
		
	},
	
	
	buy : function(sender, count, data, gas, callback) {
		
		const self = this;
		const gasPrice = BigNumber(gas).multipliedBy(1000000000);
		const amount = self.web3.toWei(BigNumber(0.02).multipliedBy(count).toFixed(), "ether");
		const receiver = ADDR_LOTTERY;
		let tranArg = {from:sender, value:amount, data:data};
		
		console.log("###	[buy]	count=" + count + ", amount=" + amount + ", sender=" + sender + ", receiver=" + receiver + ", data=" + data);
		
		Lottery.setProvider(self.web3.currentProvider);
		
		let instance;
		Lottery.deployed().then(function(_instance) {
			instance = _instance;
			//console.log(">>>	instance=" + JSON.stringify(instance));
			console.log(">>>	instance=" + instance.address);
			return instance.buyLottery.sendTransaction(tranArg.value, tranArg.data, tranArg.from, tranArg);
		}).then(function(result) {
			console.log(">>>	buyLottery=" + result);
			return instance.getBalance.call();
		}).then(function(result) {
			console.log(">>>	getBalance=" + result);
			callback(result);
		}).catch(function(e) {
			console.log(e);
			callback("ERROR 404");
		});
		
	}
  
}

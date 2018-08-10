const contract     = require("truffle-contract");
const BigNumber = require("bignumber.js");

const lottery_artifact = require("../build/contracts/IndexLottery.json");
const Lottery = contract(lottery_artifact);
const ADDR_LOTTERY = "0xc7f8f3397ca9e25dd5ee69eca2c271ece6ec27cb";


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
	
	getCurrentBalance : function(callback) {
		
		const self = this;
		const address = ADDR_LOTTERY;
		console.log("###	[getCurrentBalance]	address=" + address);
		
		Lottery.setProvider(self.web3.currentProvider);

		let meta;
		Lottery.deployed().then(function(instance) {
			meta = instance;
			return meta.getBalance.call(address, {from: address});
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
		const weiAmt =  BigNumber(self.web3.toWei(amount, "ether")).toFixed();

		console.log("###	[deposit]	amount=" + weiAmt + ", sender=" + sender + ", receiver=" + ADDR_LOTTERY);
		
		Lottery.setProvider(self.web3.currentProvider);

		let meta;
		Lottery.deployed().then(function(instance) {
			meta = instance;
			return meta.transferFrom.sendTransaction(
				sender, receiver, weiAmt, 
				{from:sender},
				function(err, result) {
					if (error != null) {
						console.log(error);
						return;
					}
					console.log("deposit	=>	" + result);
				}
				
				);
		  
			/*
			return
			self.web3.eth.sendTransaction(
				{
					from:sender,
					to:receiver,
					value:weiAmt
				},
				function(err, result) {
					if (error != null) {
						console.log(error);
						return;
					}
					console.log("deposit	=>	" + result);
				}
			);
			 */
		  
		  
		  
		}).then(function() {
//			self.getCurrentBalance(function (address, amount) {
//				callback(address, amount);
//			});
//		}).then(function() {
//			self.getAccountBalance(sender, function (address, amount) {
//				callback(address, amount);
//			});
		}).catch(function(e) {
			console.log(e);
			callback("ERROR 404");
		});
		
	},
	
	buy : function(sender, count, data, gas, callback) {
		
		const self = this;
		const gasPrice = BigNumber(gas).multipliedBy(1000000000);
		const amount = self.web3.toWei(BigNumber(0.02).multipliedBy(count).toFixed(), "ether");
		const receiver = ADDR_LOTTERY;
		
		console.log("###	[buy]	count=" + count + ", amount=" + amount + ", sender=" + sender + ", receiver=" + receiver + ", data=" + data);
		
		
		Lottery.setProvider(self.web3.currentProvider);

		let meta;
		Lottery.deployed().then(function(instance) {
			meta = instance;
			
			return
			self.web3.eth.sendTransaction(
				{
					from:sender,
					to:receiver,
					value:amount,
					gasPrice:gasPrice
				},
				function(err, result) {
					if (error != null) {
						console.log(error);
						return;
					}
					console.log(result);
				}
			);
			
		}).then(function() {
//			self.getCurrentBalance(sender, function (address, amount) {
//				callback(amount);
//			});
		}).catch(function(e) {
			console.log(e);
			callback("ERROR 404");
		});
		
	}
  
}

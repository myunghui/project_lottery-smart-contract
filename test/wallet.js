const WalletManager     = artifacts.require("./WalletManager.sol");

contract("WalletManager", function(accounts) {
	
	const acct = accounts[0];
	console.log(">>>	" + accounts[0]);
	const acct2 = accounts[1];
	
	
it("Case 1", function() {
	
	let instance;
	WalletManager.deployed().then(function(_instance) {
		instance = _instance;
		return instance.getBalance.call(acct2, {from:acct2});
	}).then(function(result) {
		console.log(">>>	1 : " + result);
		assert.equal(result, 0, "getBalance Error");
		return instance.deposit.sendTransaction({from:acct2, value:1000, gas:400000});
	}).then(function(result) {
		console.log(">>>	2 : " + result);
		return instance.getBalance.call(acct2, {from:acct2});
	}).then(function(result) {
		console.log(">>>	3 : " + result);
		assert.equal(result, 1000, "getBalance Error");
		//assert.equal(result, 9, "getBalance Error");
	});
	
});


});

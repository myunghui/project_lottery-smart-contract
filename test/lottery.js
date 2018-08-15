const IndexLottery     = artifacts.require("./IndexLottery.sol");
const LotteryPayment = artifacts.require("./LotteryPayment.sol");

contract("IndexLottery", function(accounts) {
	
	const ownerAcct   = accounts[0];
	const customer_1 = accounts[1];
	const customer_2 = accounts[2];
	console.log(">>>	ownerAcct=" + ownerAcct);
	console.log(">>>	customer_1=" + customer_1);
	console.log(">>>	customer_2=" + customer_2);
	
	it("Case 1", function() {
		
		let instance;
		let itemID;
		let ctrAddr;
		
		let num=1;
		let assertBalance=0;
		let tranArg = [];
		tranArg.push({from:customer_1, value:  40000000000000000, data:"3456"});
		tranArg.push({from:customer_1, value:200000000000000000, data:"1234"});
		tranArg.push({from:customer_2, value:  60000000000000000, data:"3456"});
		assertBalance += tranArg[0].value;
		assertBalance += tranArg[1].value;
		assertBalance += tranArg[2].value;
		let assertTotalCnt = assertBalance/20000000000000000;
		IndexLottery.deployed().then(function(_instance) {
			instance = _instance;
//			event LogFallback(address who, uint256 amt);
//			instance.LogFallback({}).watch((error, result) => {
//				if (error != null) {
//					console.log(error);
//				}
//				itemID = result.args.itemID;
//			});
			
			return instance.getBalance.call();
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : getBalance=" + result);
			assert.equal(result, 0, "getBalance Error");
			return instance.getThisAddress.call();
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : getThisAddress=" + result);
			return instance.owner.call();
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : owner=" + result);
			assert.equal(result, ownerAcct, "owner Error");
			ctrAddr = result;
			return instance.buyLottery.sendTransaction(tranArg[0].value, tranArg[0].data, tranArg[0].from, tranArg[0]);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : sendTransaction=" + result);
			ctrAddr = result;
			return instance.buyLottery.sendTransaction(tranArg[1].value, tranArg[1].data, tranArg[1].from, tranArg[1]);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : sendTransaction=" + result);
			ctrAddr = result;
			return instance.buyLottery.sendTransaction(tranArg[2].value, tranArg[2].data, tranArg[2].from, tranArg[2]);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : sendTransaction=" + result);
			return instance.getLotCnt.call("3456", customer_1);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : 3456." + customer_1 + " -> " + result);
			return instance.getLotCnt.call("1234", customer_1);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : 1234." + customer_1 + " -> " + result);
			return instance.getLotCnt.call("3456", customer_2);
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : 3456." + customer_2 + " -> " + result);
			return instance.totalCount.call();
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : totalCount=" + result);
			assert.equal(result, assertTotalCnt, "buyLottery & getLotCnt Error");
			return instance.getBalance.call();
		}).then(function(result) {
			console.log(">>>	Case 1 - " + (num++) + " : getBalance=" + result);
			assert.equal(result, assertBalance, "getBalance Error");
		});
		
	});

	/*
	it("Case 2", function() {
		
		let instance;
		let itemID;
		let ctrAddr;
		IndexLottery.deployed().then(function(_instance) {
			instance = _instance;
//			event LogFallback(address who, uint256 amt);
//			instance.LogFallback({}).watch((error, result) => {
//				if (error != null) {
//					console.log(error);
//				}
//				itemID = result.args.itemID;
//			});
			
			return instance.getBalance.call();
		}).then(function(result) {
			console.log(">>>	Case 2 - 1 : getBalance=" + result);
			//assert.equal(result, 0, "getBalance Error");
			return instance.send(60000000000000000,customer,"7890",
				{from:customer, value:60000000000000000, data:"7890"}
			);
		}).then(function(result) {
			console.log(">>>	Case 2 - 2 : fallback=" + JSON.stringify(result) + "\n\n" +
							result.data);
			return instance.getLotCnt.call("7890", customer);
		}).then(function(result) {
			console.log(">>>	Case 2 - 3 : getLotCnt=" + result);
			assert.equal(result, 3, "buyLottery & getLotCnt Error");
		});
		
	});
*/
});

// Import the page"s CSS. Webpack will know what to do with it.
import "../styles/app.css";

// Import libraries we need.
import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import {BigNumber} from "bignumber.js";

// Import our contract artifacts and turn them into usable abstractions.
import IndexLotteryArtifact from "../../build/contracts/IndexLottery.json";

// LotteryContract is our usable abstraction, which we"ll use through the code below.
let LotteryContract  = contract(IndexLotteryArtifact);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts;
let account;
let baseBlock;
let logs = "";
let address;
let deployedContract;


const ADDR_LOTTERY  = "0xf12b5dd4ead5f743c6baa640b0216200e89b60da";
const ADDR_PAYMENT = "";
const URL_PRIVATE     = "http://127.0.0.1:9545";

const App = {
  start: function () {
    const self = this;

    // Bootstrap the LotteryContract abstraction for Use.
    LotteryContract.setProvider(web3.currentProvider);
	
	deployedContract = LotteryContract.at(ADDR_LOTTERY);
	
	document.getElementById("address_constract").innerHTML = ADDR_LOTTERY;

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
		
		if (err != null) {
			App.writeLog("There was an error fetching your accounts.");
			return;
		}

		if (accs.length === 0) {
			App.writeLog("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			return;
		}
		accounts = accs;
		
		// 복권계약 owner
		account = accounts[0];
		document.getElementById("account").innerHTML = account.valueOf();
		
		// 구매자 요청 목록
		for(let k = 1; k < accounts.length; k++) {
			const opt = document.createElement("option");
			opt.setAttribute("value", accounts[k]);
			opt.text = k + ":" + accounts[k];//walletNames[i];
			document.getElementById("request_list").appendChild(opt);
		}
		document.getElementById("request_list").size = accounts.length - 1;
		
		console.log(">>>	" + account);
				
		App.getBlockNumber();
		
		App.refreshContractInfo();
		
    });
	
  },
  
	ethGetBalance : function (reqAccount, elementId) {

			web3.eth.getBalance(reqAccount, function(error, result) {
			
			if (error != null) {
				console.log(error);
				App.writeLog("balanceOf 호출 실패");
				return;
			}
			
			//const myEther = BigNumber(result);
			const ethVal = web3.fromWei(result, "ether");
			
			App.writeLog(reqAccount + ":" + ethVal);
			
			document.getElementById(elementId).value = ethVal;
			
		});

	},
	
	/**
	 * 블럭 정보 조회
	 */
	getBlockNumber : function() {
		
		web3.eth.getBlockNumber(function(error, result) {

			if (error != null) {
				console.log(error);
				App.writeLog("getBlockNumber error!");
				baseBlock = -1;
			} else {
				baseBlock = result;
				App.writeLog("getBlockNumber => baseBlock : " + baseBlock);
			}

		});

	},
	
	/**
	 * 로그 출력
	 * @param {string} msg
	 */
	writeLog : function (msg) {

		logs = logs + "[" + new Date().toLocaleString() + "] 	" + msg + "\n";
		document.getElementById("logs").textContent = logs;

		console.log(msg);

	},

	/**
	 * 복권 계약 및 Owner 잔고 조회
	 */
	refreshContractInfo : function () {
		
		new Promise(function(resolve, reject) {
				
			App.ethGetBalance(account,             "balance");
		
			return resolve();
			
		}).then(function () {
			
			App.ethGetBalance(ADDR_LOTTERY, "balance_constract");
			
		}).catch(function(e) {
			
			console.log(e);
			
		});
		
	},
	
	/**
	 * 복권 계약 address 조회
	 */
	getThisAddress : function () {
		
		LotteryContract.deployed().then(function (instance) {
			
			instance.getThisAddress(function(error, result) {

				if (error != null) {
					console.log(error);
					App.writeLog("getThisAddress error!");
				} else {
					App.writeLog(">>>	" + result);
					document.getElementById("address").innerHTML = result;
				}
				
			});
			
		}).catch(function (e) {
			
		  console.log(e);		  
		  App.writeLog("getThisAddress error!");	  
		  
		});
	
	},
	
	/**
	 * 복권 계약 운용 재원 입금
	 */
	deposit : function () {
		
		const depositObj = document.getElementById("deposit_amt");
		console.log(depositObj.value);
		const amt = web3.toWei(depositObj.value, "ether");
		
		new Promise(function(resolve, reject) {
			web3.eth.sendTransaction (
				{
					from:account, 
					to:ADDR_LOTTERY, 
					value:amt
				},
				function (error, result) {
					
					console.log(error);
					App.writeLog(error.toString());
					console.log(result); 
					App.writeLog(result);
					depositObj.value = 0;
					
				}
			);
			
			return resolve();
			
		}).then(function () {
			
			App.refreshContractInfo();
			
		}).catch(function(e) {
			
			console.log(e);
			
		});
	
	
	},
	
	/**
	 * 구매요청 지갑으로부터 복권계약으로 금액과 데이터를 전송
	 * 
	 * @param wallet
	 * @param count
	 * @param lotData
	 * @param gasPrice
	 */
	buy : function (wallet, count, lotData, gasPrice) {
		
		// 단위 환산
		const amt      = web3.toWei(count * 0.02, "ether");
		const calcGas = BigNumber(gasPrice).multipliedBy(1000000000);
		
		App.writeLog("wallet=" + wallet + ", count=" + count + ", lotData=" + lotData + ", gasPrice=" + gasPrice + ", amt=" + amt);
		
		App.writeLog("Initiating transaction... (please wait)");
		App.writeLog(wallet + "=" + web3.isAddress(wallet));
		App.writeLog("web3.eth.defaultAccount=" + web3.eth.defaultAccount);
		
		// Dapp 수행
		App.writeLog("!!!!	" + JSON.stringify(deployedContract));
		new Promise(function(resolve, reject) {
			App.writeLog("# 0");
			deployedContract.approve.sendTransaction(
				wallet, amt,
				{from:account, to:ADDR_LOTTERY, gas:10000000000},
				function(error, result) {
					
					if (error != null) {
						console.log(error);
						App.writeLog("approve error!");
						return;
					}
					
					App.writeLog("# 1");
					App.writeLog(account + " -> " + wallet + "(" + amt + ")");

				}
			);
			
			App.writeLog("# 2");
			
			return resolve();
			
		}).then(function () {

			App.writeLog("# 3");
			// 인출
			web3.eth.sendTransaction (
				{
					from:wallet, 
					to:ADDR_LOTTERY, 
					value:amt, 
					data:lotData,
					gas:calcGas
				},
				function(error, result) {
					console.log(error);
					App.writeLog(error.toString());
					console.log(result);
					App.writeLog(result);
				}
			);
			
		}).then(function () {
			
			// TODO 인출 권한 회수
			
			
		}).catch(function(e) {
			
			console.log(e);
			
		});

	/*
	//LotteryContract.deployed().then(function (instance) {
		let instance = LotteryContract.at(ADDR_LOTTERY);
		instance.transferFrom.call({from:account, to:ADDR_LOTTERY, data:lotData, value:amt}, function(error, result) {
			if (error != null) {
				App.writeLog("transferFrom call error!");
				console.log(error);
				return;
			}
			if (result) {
				instance.transferFrom.sendTransaction(
					wallet,
					ADDR_LOTTERY,
					amt,
					{from:account, gasPrice:gas},
					function(error, result) {
						if (error != null) {
							App.writeLog("transferFrom sendTransaction error!");
							console.log(error);
							return;
						}
						App.writeLog(account + " -> " + wallet + "(" + amt + ")");
					}
				);
			}
		});
		
	//}).catch(function (e) {
	//	
	//	console.log(e);
	//	
	//});
		
*/


  }
  
}

window.App = App;

window.addEventListener("load", function () {
	
	window.web3 = new Web3(new Web3.providers.HttpProvider(URL_PRIVATE));
	
	web3.version.getNetwork((err, netId) => {
	  switch (netId) {
		case "1":
		  console.log("This is mainnet");
		  break;
		case "2":
		  console.log("This is the deprecated Morden test network.");
		  break;
		case "3":
		  console.log("This is the ropsten test network.");
		  break;
		case "4":
		  console.log("This is the Rinkeby test network.");
		  break;
		case "42":
		  console.log("This is the Kovan test network.");
		  break;
		default:
		  console.log("This is an unknown network.");
	  }
	});

  App.start();
  
});

const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require("web3");
const truffle_connect = require("./connection/app2.js");
const truffle_connect_meta = require("./connection/app.js");
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static("public_static"));

app.get("/getAccounts", (req, res) => {
	
  console.log("**** GET / getAccounts ****");
  truffle_connect.start((accountList) => {
	  
    console.log(accountList);
	let accounts = accountList;
	let response = [];
	response[0] = accounts;
	truffle_connect.getBalance((conractAddress, conractBalance) => {
		
		response[1] = conractAddress;
		response[2] = conractBalance;
		
		truffle_connect.ethGetBalance(accounts[0], (ownerBalance) => {
		
			response[3] = accounts[0];
			response[4] = ownerBalance;
			console.log("response=" + JSON.stringify(response));
			
			res.send(response);
		
		});
		
	});
	
  });
  
});

app.post("/ethGetBalance", (req, res) => {
	
	console.log("**** POST /ethGetBalance ****");
	console.log(req.body);
	let currentAcount = req.body.account;

	truffle_connect.ethGetBalance(currentAcount, (answer) => {
		res.send(answer);
	});

});

app.post("/sendCoin", (req, res) => {
  console.log("**** POST /sendCoin ****");
  truffle_connect_meta.sendCoin((result) => {
    res.send(result);
  });
});


app.post("/buy", (req, res) => {
  console.log("**** POST / buy ****");
  console.log(req.body);

  let sender = req.body.sender;
  let count  = req.body.count;
  let data   = req.body.data;
  let gas   = req.body.gas;

  truffle_connect.buy(sender, count, data, gas, (balance) => {
    res.send(balance);
  });
  
});


app.post("/getBalance", (req, res) => {
	
  console.log("**** POST / getBalance ****");
  console.log(req.body);
  
  truffle_connect.getBalance((address, balance) => {
    res.send(address, balance);
  });
  
});

app.post("/deposit", (req, res) => {
  console.log("**** POST / deposit ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;

  truffle_connect.deposit(amount, sender, (from_balance, to_balance) => {
	let response = [from_balance, to_balance];
    res.send(response);
  });
  
});



app.listen(port, () => {

	let provider;
	if (typeof web3 !== "undefined") {
		console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
		// Use Mist/MetaMask's provider
		provider = web3.currentProvider;
	} else {
		console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		provider = new Web3.providers.HttpProvider("http://localhost:8545");
	}
	
	truffle_connect.web3           =  new Web3(provider);
	truffle_connect_meta.web3  =  new Web3(provider);
	console.log("Express Listening at http://localhost:" + port);
  
});

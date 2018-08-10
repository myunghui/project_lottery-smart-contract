
/**
 * 로그 출력
 * @param {string} msg
 */
let logs;
function writeLog(msg) {

	logs = logs + "[" + new Date().toLocaleString() + "] 	" + msg + "\n";
	$("#logs").text(logs);

	console.log(msg);

}

$(document).ready(function () {
	
	let curraccount;
	let selectedAccount;

	new Promise((resolve, reject) => {
		$.get("/getAccounts", 
			function (response) {
				const accounts           = response[0];
				const conractAddress  = response[1];
				const conractBalance  = response[2];
				const ownerAddress    = response[3];
				const ownerBalance    = response[4];	
				writeLog("accounts=" + accounts + ",\n conractAddress=" + conractAddress + ",\n conractBalance=" + conractBalance + ",\n ownerAddress=" + ownerAddress + ",\n ownerBalance=" + ownerBalance);
				
				// 구매자 요청 목록
				for(let k = 1; k < accounts.length; k++){
					curraccount = accounts[k];
					$("#request_list").append("<option value='" + curraccount + "'>" + k + ":" + curraccount + "</option>");
				}
				$("#request_list").attr("size", accounts.length - 1);

				$("#contract_address").text(conractAddress);
				$("#contract_balance").val(conractBalance);
				$("#contract_owner").text(ownerAddress);
				$("#contract_owner_balance").val(ownerBalance);
				
				writeLog("getAccounts!!");
				
		});
			
		return resolve();
		
	}).then(function () {
		
		$.getJSON("https://ethgasstation.info/json/ethgasAPI.json", function(data) {
			console.log(data);
			let gasInfo = data["safeLow"] / 10;
			$("#gas_price").val(gasInfo);
			writeLog("gas safeLow : " + gasInfo);
		});
	
	}).catch(function (err) {
		console.error(err); // Error 출력
	});
	
	
	$("#request_list").click(function () {
		
		writeLog("request_list ethGetBalance...");
		const selectAccount = $("#request_list option:selected").val();
		console.log("account=" + selectAccount);
		$("#wallet").val(selectAccount);
		$.post("/ethGetBalance", 
			{account : selectAccount}, 
			function (response) {
				$("#wallet_balance").val(response);
				writeLog("request_list ethGetBalance !!" + "		response=" + response);
			}
		);
		
	});
	
	$("#submit").click(function () {
		
		selectedAccount = $("#request_list").val();
		console.log(selectedAccount);
		$.post("/getBalance", 
			{account : selectedAccount}, 
			function (response) {
				$("#account").text(selectedAccount);
				$("#balance").text(response[0]);
				const current_account_index = response[1].indexOf(selectedAccount);
				response[1].splice(current_account_index,1); //remove the selected account from the list of accounts you can send to.
				const list= $("#all-accounts > ol");
				for(let i=0;i< response[1].length;i++){
					li="<li>"+response[1][i]+"</li>";
					list.append(li);
				}
			}
		);
		
	});

	$("#send").click(function () {
		
		writeLog("Sending...");
		let amount = $("#amount").val();
		let receiver = $("#receiver").val();
		let data = "3456";
		$.post("/sendCoin", 
			{amount : amount, sender : selectedAccount, receiver : receiver, data: data}, 
			function (response) {
				$("#balance").text(response);
				writeLog("Sent!!");
			}
		);
		
	});

	$("#buy").click(function () {
		
		writeLog("Buying...");
		
		let sender = $("#wallet").val();
		let count  = $("#count").val();
		let data   =  $("#lottery_data").val();
		$.post("/buy", 
			{sender : sender, count : count, data : data}, 
			function (response) {
				$("#contract_balance").text(response);
				writeLog("Buy!!");
			}
		);
		
	});
	
	$("#deposit").click(function () {
		
		writeLog("Deposit...");
		let amount = $("#deposit_amt").val();
		let sender   = $("#contract_owner").text();
		console.log(">>>	" + amount);
		console.log(">>>	" + sender);
		$.post("/deposit", 
			{amount : amount, sender : sender}, 
			function (response) {
				$("#lottery_balance").text(response);
				writeLog("Deposit Sent!!");
			}
		);
		
	});
  
})

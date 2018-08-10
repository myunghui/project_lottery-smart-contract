pragma solidity ^0.4.17;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	mapping (address => uint) balances;

	event LogTransfer(address indexed _from, address indexed _to, uint256 _value, string _data);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	mapping (address => string) datas;
	function sendCoin(address receiver, uint amount, string data) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		
		datas[msg.sender] =data;
		
		emit LogTransfer(msg.sender, receiver, amount, data);
		
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}

const IndexLottery     = artifacts.require("./IndexLottery.sol");
const LotteryPayment = artifacts.require("./LotteryPayment.sol");
module.exports = function(deployer) {
	deployer.deploy(LotteryPayment);
	deployer.link(LotteryPayment, IndexLottery);
	deployer.deploy(IndexLottery);
};

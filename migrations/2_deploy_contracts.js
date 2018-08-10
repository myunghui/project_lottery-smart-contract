const ConvertLib        = artifacts.require("./ConvertLib.sol");
const MetaCoin          = artifacts.require("./MetaCoin.sol");
const IndexLottery     = artifacts.require("./IndexLottery.sol");
const LotteryPayment = artifacts.require("./LotteryPayment.sol");

module.exports = function(deployer) {
	deployer.deploy(ConvertLib);
	deployer.link(ConvertLib, MetaCoin);
	deployer.deploy(MetaCoin);
	deployer.deploy(LotteryPayment);
	deployer.link(LotteryPayment, IndexLottery);
	deployer.deploy(IndexLottery);
};



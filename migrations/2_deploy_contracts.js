const ConvertLib        = artifacts.require("./ConvertLib.sol");
const MetaCoin          = artifacts.require("./MetaCoin.sol");
const IndexLottery     = artifacts.require("./IndexLottery.sol");
const LotteryPayment = artifacts.require("./LotteryPayment.sol");
const WalletManager  = artifacts.require("./WalletManager.sol");

module.exports = function(deployer) {
	deployer.deploy(ConvertLib);
	deployer.link(ConvertLib, MetaCoin);
	deployer.deploy(MetaCoin);
	deployer.deploy(LotteryPayment);
	deployer.link(LotteryPayment, IndexLottery);
	deployer.deploy(IndexLottery);
	deployer.link(ConvertLib, WalletManager);
	deployer.deploy(WalletManager);
};



const PredictionMarket = artifacts.require("PredictionMarket");

module.exports = function (deployer) {
  deployer.deploy(PredictionMarket).then(() => {
    const instance = PredictionMarket.deployed();
    return instance.createMarket("Will Gor Mahia win next match?", { from: accounts[0] });
  });
};
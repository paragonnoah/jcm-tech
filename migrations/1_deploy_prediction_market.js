const PredictionMarket = artifacts.require("PredictionMarket");

module.exports = function (deployer) {
  deployer.deploy(PredictionMarket, "Will Gor Mahia win next match?");
};
const PredictionMarket = artifacts.require("PredictionMarket");

contract("PredictionMarket", (accounts) => {
  it("should create a market", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.createMarket("Test Market", "Test", 180, 220, { from: accounts[0] });
    const market = await instance.markets(1);
    assert(market.question === "Test Market", "Market not created correctly");
  });

  it("should place a bet", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.deposit({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
    await instance.placeBet(1, true, web3.utils.toWei("0.1", "ether"), { from: accounts[0] });
    const balance = await instance.getBalance(accounts[0]);
    assert(balance.lt(web3.utils.toWei("1", "ether")), "Bet not placed correctly");
  });

  it("should resolve a market", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.resolveMarket(1, true, { from: accounts[0] });
    const market = await instance.markets(1);
    assert(market.isResolved === true, "Market not resolved");
  });

  it("should withdraw payout", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.withdrawPayout(1, { from: accounts[0] });
    const balance = await instance.getBalance(accounts[0]);
    assert(balance.gt(web3.utils.toWei("0.9", "ether")), "Payout not withdrawn");
  });
});
const PredictionMarket = artifacts.require("PredictionMarket");

contract("PredictionMarket", (accounts) => {
  it("should create a market and allow betting", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.createMarket("Will 2027 election favor party X?", { from: accounts[0] });
    await instance.placeBet(1, true, { value: web3.utils.toWei("1", "ether"), from: accounts[1] });
    const yesBet = await instance.betsYes(accounts[1], 1);
    assert.equal(web3.utils.fromWei(yesBet.toString(), "ether"), "1", "Bet amount should be 1 ETH");
  });

  it("should resolve market and allow withdrawal", async () => {
    const instance = await PredictionMarket.deployed();
    await instance.resolveMarket(1, true, { from: accounts[0] });
    const isResolved = await instance.isResolved(1);
    assert.equal(isResolved, true, "Market should be resolved");
    await instance.withdrawWinnings(1, { from: accounts[1] });
    const yesBet = await instance.betsYes(accounts[1], 1);
    assert.equal(yesBet.toString(), "0", "Winnings should be withdrawn");
  });
});
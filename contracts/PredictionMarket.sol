// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PredictionMarket is Ownable {
    using SafeMath for uint256;

    struct Market {
        string question;
        string marketType;
        uint256 oddsYes;
        uint256 oddsNo;
        uint256 totalYesStake;
        uint256 totalNoStake;
        uint256 progress; // 0-100
        bool isResolved;
        bool outcome; // true for Yes, false for No
        mapping(address => uint256) yesStakes;
        mapping(address => uint256) noStakes;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    mapping(address => uint256) public userBalances;

    event MarketCreated(uint256 marketId, string question, string marketType);
    event BetPlaced(uint256 marketId, address user, bool choice, uint256 amount);
    event MarketResolved(uint256 marketId, bool outcome);
    event PayoutWithdrawn(uint256 marketId, address user, uint256 amount);

    constructor() {
        marketCount = 0;
    }

    // Create a new market
    function createMarket(string memory _question, string memory _marketType, uint256 _oddsYes, uint256 _oddsNo) public onlyOwner {
        require(_oddsYes > 0 && _oddsNo > 0, "Odds must be greater than 0");
        marketCount = marketCount.add(1);
        markets[marketCount] = Market(_question, _marketType, _oddsYes, _oddsNo, 0, 0, 0, false, false);
        emit MarketCreated(marketCount, _question, _marketType);
    }

    // Deposit ETH to user balance (mock for now)
    function deposit() public payable {
        userBalances[msg.sender] = userBalances[msg.sender].add(msg.value);
    }

    // Place a bet on a market
    function placeBet(uint256 _marketId, bool _choice, uint256 _amount) public {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market is resolved");
        require(userBalances[msg.sender] >= _amount, "Insufficient balance");

        userBalances[msg.sender] = userBalances[msg.sender].sub(_amount);
        if (_choice) {
            market.yesStakes[msg.sender] = market.yesStakes[msg.sender].add(_amount);
            market.totalYesStake = market.totalYesStake.add(_amount);
        } else {
            market.noStakes[msg.sender] = market.noStakes[msg.sender].add(_amount);
            market.totalNoStake = market.totalNoStake.add(_amount);
        }

        // Update progress (simplified logic)
        uint256 totalStake = market.totalYesStake.add(market.totalNoStake);
        market.progress = totalStake > 0 ? (market.totalYesStake.mul(100).div(totalStake)) : 0;

        emit BetPlaced(_marketId, msg.sender, _choice, _amount);
    }

    // Resolve a market (admin only)
    function resolveMarket(uint256 _marketId, bool _outcome) public onlyOwner {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market already resolved");
        market.isResolved = true;
        market.outcome = _outcome;
        emit MarketResolved(_marketId, _outcome);
    }

    // Withdraw payout (mock M-Pesa conversion)
    function withdrawPayout(uint256 _marketId) public {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        Market storage market = markets[_marketId];
        require(market.isResolved, "Market not resolved");

        uint256 userYesStake = market.yesStakes[msg.sender];
        uint256 userNoStake = market.noStakes[msg.sender];
        uint256 payout = 0;

        if (market.outcome && userYesStake > 0) {
            payout = userYesStake.mul(market.oddsYes).div(100); // Simplified payout
        } else if (!market.outcome && userNoStake > 0) {
            payout = userNoStake.mul(market.oddsNo).div(100); // Simplified payout
        }

        require(payout > 0, "No winnings to withdraw");
        market.yesStakes[msg.sender] = 0;
        market.noStakes[msg.sender] = 0;
        userBalances[msg.sender] = userBalances[msg.sender].add(payout);

        // Mock M-Pesa conversion (to be replaced with API)
        if (payout > 0) {
            uint256 mpesaEquivalent = payout.mul(150); // 1 ETH = 150 KES (example rate)
            emit PayoutWithdrawn(_marketId, msg.sender, mpesaEquivalent);
        }
    }

    // Get user balance
    function getBalance(address _user) public view returns (uint256) {
        return userBalances[_user];
    }
}
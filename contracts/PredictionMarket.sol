// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
    address public owner;
    string public marketQuestion;
    uint public marketId; // Unique ID for each market (elections, football, etc.)
    uint public totalPool;
    mapping(address => mapping(uint => uint)) public betsYes; // User bets for Yes per market
    mapping(address => mapping(uint => uint)) public betsNo; // User bets for No per market
    mapping(uint => bool) public isResolved;
    mapping(uint => bool) public outcome; // true = Yes, false = No per market
    uint public marketCount; // Total number of markets created

    enum MarketType { Election, Football } // Categories from Phase 1 research
    mapping(uint => MarketType) public marketType;

    event BetPlaced(address indexed bettor, uint marketId, bool choice, uint amount);
    event MarketCreated(uint marketId, string question, MarketType marketType);
    event MarketResolved(uint marketId, bool outcome);
    event WinningsWithdrawn(address indexed winner, uint marketId, uint amount);

    constructor() {
        owner = msg.sender;
        marketCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    // Create a new market (e.g., 2027 election or football match)
    function createMarket(string memory _question, MarketType _type) public onlyOwner {
        marketId = marketCount++;
        marketQuestion = _question;
        marketType[marketId] = _type;
        isResolved[marketId] = false;
        emit MarketCreated(marketId, _question, _type);
    }

    // Place a bet on a specific market
    function placeBet(uint _marketId, bool _choice) public payable {
        require(isResolved[_marketId] == false, "Market is already resolved.");
        require(msg.value > 0, "Bet amount must be greater than 0.");
        require(_marketId < marketCount, "Invalid market ID.");

        if (_choice) {
            betsYes[msg.sender][_marketId] += msg.value;
        } else {
            betsNo[msg.sender][_marketId] += msg.value;
        }
        totalPool += msg.value;

        emit BetPlaced(msg.sender, _marketId, _choice, msg.value);
    }

    // Resolve a market with an outcome
    function resolveMarket(uint _marketId, bool _outcome) public onlyOwner {
        require(isResolved[_marketId] == false, "Market is already resolved.");
        require(_marketId < marketCount, "Invalid market ID.");
        isResolved[_marketId] = true;
        outcome[_marketId] = _outcome;
        emit MarketResolved(_marketId, _outcome);
    }

    // Withdraw winnings for a specific market
    function withdrawWinnings(uint _marketId) public {
        require(isResolved[_marketId], "Market is not yet resolved.");
        require(_marketId < marketCount, "Invalid market ID.");
        uint payout;
        uint totalBets = betsYes[msg.sender][_marketId] + betsNo[msg.sender][_marketId];
        if (outcome[_marketId] && betsYes[msg.sender][_marketId] > 0) {
            payout = (betsYes[msg.sender][_marketId] * totalPool) / totalBets;
            betsYes[msg.sender][_marketId] = 0;
        } else if (!outcome[_marketId] && betsNo[msg.sender][_marketId] > 0) {
            payout = (betsNo[msg.sender][_marketId] * totalPool) / totalBets;
            betsNo[msg.sender][_marketId] = 0;
        }
        require(payout > 0, "No winnings to withdraw.");
        payable(msg.sender).transfer(payout);
        emit WinningsWithdrawn(msg.sender, _marketId, payout);
    }

    // Placeholder for payment integration (e.g., M-Pesa callback)
    function processPayment(address _user, uint _amount) public onlyOwner {
        // This is a stub for future M-Pesa/Airtel Money integration
        // Will require off-chain API calls in Phase 3
        emit BetPlaced(_user, marketId, true, _amount); // Simulate bet for now
    }

    // Fallback function to handle unused ETH
    receive() external payable {}
}
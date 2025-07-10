// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
    address public owner;
    string public marketQuestion;
    uint public totalPool;
    mapping(address => uint) public betsYes;
    mapping(address => uint) public betsNo;
    bool public isResolved;
    bool public outcome; // true = Yes, false = No

    event BetPlaced(address indexed bettor, bool choice, uint amount);
    event MarketResolved(bool outcome);

    constructor(string memory _question) {
        owner = msg.sender;
        marketQuestion = _question;
        isResolved = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    function placeBet(bool _choice) public payable {
        require(!isResolved, "Market is already resolved.");
        require(msg.value > 0, "Bet amount must be greater than 0.");

        if (_choice) {
            betsYes[msg.sender] += msg.value;
        } else {
            betsNo[msg.sender] += msg.value;
        }
        totalPool += msg.value;

        emit BetPlaced(msg.sender, _choice, msg.value);
    }

    function resolveMarket(bool _outcome) public onlyOwner {
        require(!isResolved, "Market is already resolved.");
        isResolved = true;
        outcome = _outcome;
        emit MarketResolved(_outcome);
    }

    function withdrawWinnings() public {
        require(isResolved, "Market is not yet resolved.");
        uint payout;
        if (outcome && betsYes[msg.sender] > 0) {
            payout = (betsYes[msg.sender] * totalPool) / (betsYes[msg.sender] + betsNo[msg.sender]);
            betsYes[msg.sender] = 0;
        } else if (!outcome && betsNo[msg.sender] > 0) {
            payout = (betsNo[msg.sender] * totalPool) / (betsYes[msg.sender] + betsNo[msg.sender]);
            betsNo[msg.sender] = 0;
        }
        require(payout > 0, "No winnings to withdraw.");
        payable(msg.sender).transfer(payout);
    }

    // Fallback function to handle unused ETH
    receive() external payable {}
}
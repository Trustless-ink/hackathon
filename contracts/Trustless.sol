// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./Libs/UInt256Array.sol";

contract Trustless is ERC1155URIStorage, Ownable, AutomationCompatible {
  using Uint256Array for Uint256Array.Uint256s;

  event ProjectCreated(address indexed fundraiser, uint project, uint amount);
  event Contribution(address indexed contributor, uint project, uint amount);
  event GoalAchieved(address indexed fundraiser, uint project, uint amount);
  event TokenIssued(address indexed issuedTo, uint project, uint quantity);
  event FundsReleased(address indexed issuedTo, uint project, uint quantity);
  event RefundIssued(address indexed issuedTo, uint project, uint amount);
  event MilestoneAchieved(uint project, uint amount);
  event ProjectCancelled(uint project);

  Uint256Array.Uint256s fundraiseQueue;

  uint public projectCount;
  mapping(uint => Project) projects;

  struct Project {
    uint id;
    uint intervalTime;      // time in minutes
    uint timestamp;         // timestamp of last funds released
    uint milestones;        // number of milestones
    uint goal;
    uint balance;
    address fundraiser;
    bool active;
    bool fundraising;
    bool terminated;
    uint availableToWithdraw;
  }

  /**
   * Modifiers
   */
  modifier stillFundraising(uint tokenId) {
    Project memory project = projects[tokenId];
    require(project.fundraising && project.active, "Fundraising campaign is closed");
    require(project.balance < project.goal, "Campaign is inactive.");
    _;
  }

  modifier onlyFundraiser(uint tokenId) {
    require(msg.sender == projects[tokenId].fundraiser, "Only the fundraiser can execute this method.");
    _;
  }

  modifier onlyContributors(uint tokenId) {
    require(balanceOf(msg.sender, tokenId) > 0, "Only the contributors can execute this method.");
    _;
  }

  constructor() ERC1155("") {}

  /**
   * Getters
   */
  function projectGoal(uint tokenId) external view returns (uint) {
    return projects[tokenId].goal;
  }

  function projectBalance(uint tokenId) external view returns (uint) {
    return projects[tokenId].balance;
  }

  function availableToWithdraw(uint tokenId) external view returns (uint) {
    return projects[tokenId].availableToWithdraw;
  }

  function fundraiser(uint tokenId) external view returns (address) {
    return projects[tokenId].fundraiser;
  }

  function nextMilestone(uint tokenId) public view returns (uint) {
    return projects[tokenId].timestamp + (projects[tokenId].intervalTime * 1 minutes);
  }

  function isFundraising(uint tokenId) external view returns (bool) {
    return projects[tokenId].fundraising;
  }

  function isTerminated(uint tokenId) external view returns (bool) {
    return projects[tokenId].terminated;
  }

  function isActive(uint tokenId) external view returns (bool) {
    return projects[tokenId].active;
  }

  function refundBalance(uint tokenId) public view returns (uint) {
    require(projects[tokenId].terminated, "Project is not terminated");
    uint amount = balanceOf(msg.sender, tokenId);
    uint refundAmount;
    Project memory project = projects[tokenId];

    if (project.balance < project.goal) {
      uint ratio = project.balance / project.goal;
      refundAmount = ratio * amount / 100;
    } else {
      refundAmount = amount;
    }
    return refundAmount;
  }
  /**
   * Methods
   */
  function create(
    uint _goal,
    string memory _tokenURI,
    uint _intervalTime, // In minutes
    uint _milestones
  ) external returns (uint) {
    require(_goal > 0, "Fundraising goal must be greater than 0");

    projectCount++;
    Project memory newProject = Project({
      id: projectCount,
      intervalTime: _intervalTime,
      timestamp: block.timestamp,
      milestones: _milestones,
      goal: _goal,
      balance: 0,
      fundraiser: msg.sender,
      active: true,
      fundraising: true,
      terminated: false,
      availableToWithdraw: 0
    });

    _setURI(projectCount, _tokenURI);
    projects[projectCount] = newProject;
    emit ProjectCreated(msg.sender, projectCount, _goal);
    return projectCount;
  }

  function contribute(uint tokenId) public payable stillFundraising(tokenId) {
    Project storage project = projects[tokenId];
    require(msg.sender != project.fundraiser, "Fundraiser cannot contribute to own campaign");
    require(msg.value >= 0.01 ether, "Minimum contribution amount is 0.01 ETH");

    project.balance += msg.value;
    emit Contribution(msg.sender, tokenId, msg.value);

    if (msg.value > 0) {
      _mint(msg.sender, tokenId, msg.value, '');
      emit TokenIssued(msg.sender, tokenId, msg.value);
    }

    if (project.balance >= project.goal) {
      project.fundraising = false;
      fundraiseQueue.push(tokenId);
      emit GoalAchieved(project.fundraiser, tokenId, project.goal);
    }
  }
  /**
   * withdraw milestone fundraised
   */
  function withdrawFunds(uint tokenId) external onlyFundraiser(tokenId) {
    require(projects[tokenId].availableToWithdraw > 0, "No funds available");
    uint amount = projects[tokenId].availableToWithdraw;
    projects[tokenId].availableToWithdraw = 0;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed.");

    emit FundsReleased(msg.sender, tokenId, amount);
  }
  /**
   * Withdraw Refund
   */
  function refund(uint tokenId) external onlyContributors(tokenId) {
    require(projects[tokenId].terminated, "Project is not terminated");
    uint amount = balanceOf(msg.sender, tokenId);
    uint refundAmount = refundBalance(tokenId);
    _burn(msg.sender, tokenId, amount);
    (bool success, ) = msg.sender.call{value: refundAmount}("");
    require(success, "Transfer failed.");

    emit FundsReleased(msg.sender, tokenId, amount);
  }
  /**
   * Cancel Campaign
   */
  function cancel(uint tokenId) external onlyOwner {
    Project storage project = projects[tokenId];
    project.active = false;
    project.terminated = true;
    fundraiseQueue.remove(tokenId);
  }
  /**
   * Chainlink Upkeep logic
   */
  function checkUpkeep(bytes calldata checkData) external view returns (bool upkeepNeeded, bytes memory) {
    for (uint i = 0; i < fundraiseQueue.size(); i++) {
      uint tokenId = fundraiseQueue.atIndex(i);

      if (tokenId > 0 && block.timestamp >= nextMilestone(tokenId)) {
        return (true, abi.encodePacked(tokenId));
      }
    }
    return (false, checkData);
  }

  function performUpkeep(bytes calldata performData) external {
    uint tokenId = uint256(bytes32(performData));
    Project storage project = projects[tokenId];

    if (project.active && !project.fundraising) {
      uint amount = project.balance / project.milestones;
      project.balance -= amount;
      project.availableToWithdraw += amount;
      project.milestones -= 1;
      project.timestamp = block.timestamp;

      if (project.milestones < 1) {
        project.active = false;
        fundraiseQueue.remove(tokenId);
      }
      emit MilestoneAchieved(tokenId, amount);
    }
  }
  /**
   * Receive function issue the basic token if msg.sender is paying directly
   */
  receive() external payable {}
}

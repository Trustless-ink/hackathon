// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract Trustless is ERC1155URIStorage {
  event ProjectCreated(address indexed fundraiser, uint project, uint amount);
  event Contribution(address indexed contributor, uint project, uint amount);
  event GoalAchieved(address indexed fundraiser, uint project, uint amount);
  event TokenIssued(address indexed issuedTo, uint project, uint quantity);
  event FundsReleased(address indexed issuedTo, uint project, uint quantity);
  event RefundIssued(address indexed issuedTo, uint project, uint amount);
  event MilestoneAchieved(uint project, uint amount);
  event ProjectCancelled(uint project);

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
  /**
   * Receive function issue the basic token if msg.sender is paying directly
   */
  receive() external payable {}
}

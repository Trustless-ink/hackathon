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

  constructor() ERC1155("") {}

  /**
   * Receive function issue the basic token if msg.sender is paying directly
   */
  receive() external payable {}
}

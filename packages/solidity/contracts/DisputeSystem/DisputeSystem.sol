// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../JobContract/JobContract.sol";
import "../UserSystem/UserManager/UserManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DisputeSystem is Ownable {
    JobContract public contractInstance;
    UserManager public userManager;

    struct Dispute {
        uint256 totalVotes;
        bool resolved;
        mapping(address => bool) juryVotes;
        mapping(address => bool) userVotes;
    }

    mapping(string => Dispute) public disputes;
    mapping(address => bool) public juryMembers;

    event JuryMemberAdded(address indexed member);
    event DisputeCreated(string indexed contractId);
    event Voted(address indexed voter, string indexed contractId);

    function initialize(JobContract _contract, UserManager _userManager) external onlyOwner {
        contractInstance = _contract;
        userManager = _userManager;
    }

    function addJuryMember(address member) external onlyOwner {
        juryMembers[member] = true;
        emit JuryMemberAdded(member);
    }

    function createDispute(string calldata _contractId) external {
        JobContract.Contract memory contractInfo = contractInstance.getContract(_contractId);
        require(contractInfo.state != JobContract.State.CompleteWithSuccess, "Contract already completed successfully");
        require(block.timestamp > contractInfo.endTimestamp, "Contract duration has not yet passed");

        Dispute storage dispute = disputes[_contractId];
        dispute.totalVotes = 0;
        dispute.resolved = false;
        emit DisputeCreated(_contractId);
    }

    function vote(string calldata _contractId) external {
        Dispute storage dispute = disputes[_contractId];
        require(!dispute.resolved, "Dispute already resolved");

        // Check if voter is a jury member
        if(juryMembers[msg.sender]) {
            require(!dispute.juryVotes[msg.sender], "Jury member has already voted");
            dispute.juryVotes[msg.sender] = true;
        } 
        else {
            // Check if voter is a verified user
            require(userManager.isUserVerified(msg.sender), "User not verified");
            require(!dispute.userVotes[msg.sender], "User has already voted");
            dispute.userVotes[msg.sender] = true;
        }
        
        dispute.totalVotes++;
        
        if(dispute.totalVotes >= 3) {
            resolveDispute(_contractId);
        }
        
        emit Voted(msg.sender, _contractId);
    }

    function resolveDispute(string calldata _contractId) private {
        Dispute storage dispute = disputes[_contractId];
        require(dispute.totalVotes >= 3, "Not enough votes to resolve dispute");
        dispute.resolved = true;
        
        // Handle dispute resolution logic here
    }
}

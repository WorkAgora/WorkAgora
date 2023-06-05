// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../JobContract/JobContract.sol';
import '../UserSystem/UserManager/UserManager.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract DisputeSystem is Ownable {
    JobContract public jobContract;
    UserManager public userManager;
    uint256 public minReputationToVote;
    uint256 public juryVotesCount;
    uint256 public userVotesCount;
    uint256 public disputeExpiryTime = 2 weeks;

    mapping(string => Dispute) public disputes;
    mapping(address => bool) public juryMembers;

    event JuryMemberAdded(address indexed member);
    event DisputeCreated(string indexed contractId, uint256 disputeExpiryTimestamp);
    event Voted(address indexed voter, string indexed contractId);

    struct Vote {
        address voter;
        uint256 contractorPct;
        uint256 employerPct;
    }

    struct Dispute {
        bool ongoing;
        uint256 disputeExpiryTimestamp;
        Vote[] votes;
    }

    function initialize(
        JobContract _contract,
        UserManager _userManager,
        address[] calldata _juryMembers,
        uint256 _minReputationToVote,
        uint256 _juryVotesCount,
        uint256 _userVotesCount
    ) external onlyOwner {
        jobContract = _contract;
        userManager = _userManager;
        minReputationToVote = _minReputationToVote;
        juryVotesCount = _juryVotesCount;
        userVotesCount = _userVotesCount;

        for (uint i = 0; i < _juryMembers.length; i++) {
            juryMembers[_juryMembers[i]] = true;
            emit JuryMemberAdded(_juryMembers[i]);
        }
    }

    function initiateDispute(string calldata _contractId) external {
        JobContract.Contract memory record = jobContract.getContract(_contractId);
        require(userManager.isUserVerified(msg.sender), 'User not verified'); // check for ban
        require(record.state == JobContract.State.Started, 'Contract not started');
        require(block.timestamp > record.endTimestamp, 'Too early to open a dispute');
        require(
            msg.sender == record.employerAddress || msg.sender == record.contractorAddress,
            'Only employers and contractors can initiate disputes'
        );

        // Create dispute
        Dispute storage dispute = disputes[_contractId];
        dispute.ongoing = true;
        dispute.disputeExpiryTimestamp = block.timestamp + disputeExpiryTime;

        // Update contract
        jobContract.initiateDispute(_contractId);

        emit DisputeCreated(_contractId, dispute.disputeExpiryTimestamp);
    }

    function castVote(
        string calldata _contractId,
        uint256 _contractorPct,
        uint256 _employerPct
    ) external {
        require(
            _contractorPct + _employerPct == 100,
            'Sum of contractor and employer percents must 100'
        );

        Dispute storage dispute = disputes[_contractId];
        require(dispute.ongoing, 'Dispute is not ongoing');
        for (uint i = 0; i < dispute.votes.length; i++) {
            // Iterating here is fine, array length remains small
            require(msg.sender != dispute.votes[i].voter, 'Already voted');
        }
        require(userManager.isUserVerified(msg.sender), 'User not verified');
        require(
            !userManager.hasNegativeReputation(msg.sender),
            'Can not vote with negative reputation'
        );
        require(
            uint256(userManager.getTotalReputation(msg.sender)) > minReputationToVote,
            'Not enough reputation to vote'
        );

        JobContract.Contract memory record = jobContract.getContract(_contractId);
        require(
            msg.sender != record.employerAddress && msg.sender != record.contractorAddress,
            'Employers and contractors can not vote on their own disputes'
        );

        dispute.votes.push(
            Vote({voter: msg.sender, contractorPct: _contractorPct, employerPct: _employerPct})
        );

        uint256 totalVotesCount = juryVotesCount + userVotesCount;
        if (dispute.votes.length == totalVotesCount) {
            finalizeDispute(_contractId);
        }
    }

    // function finalizeExpiredDispute(string calldata _contractId) external {
    //     Dispute memory dispute = disputes[_contractId];
    //     require(dispute.ongoing, 'Dispute is not ongoing');
    //     require(block.timestamp > dispute.disputeExpiryTimestamp, 'Dispute did not expire valid');

    // }

    function finalizeDispute(string memory _contractId) public {
        Dispute memory dispute = disputes[_contractId];
        bool disputeExpired = block.timestamp > dispute.disputeExpiryTimestamp;
        uint256 contractorPct;
        uint256 employerPct;
        if (disputeExpired) {
            contractorPct = 50;
            employerPct = 50;
        } else {
            require(
                dispute.votes.length == juryVotesCount + userVotesCount,
                'Cannot finalize the dispute yet'
            );

            uint contractorPctVotes = 0;
            uint employerPctVotes = 0;

            for (uint i = 0; i < dispute.votes.length; i++) {
                Vote memory vote = dispute.votes[i];

                // Each jury vote counts as 2 votes
                uint8 multiplier = juryMembers[vote.voter] ? 2 : 1;
                contractorPctVotes += multiplier * vote.contractorPct;
                employerPctVotes += multiplier * vote.employerPct;
            }

            contractorPct = contractorPctVotes / dispute.votes.length;
            employerPct = employerPctVotes / dispute.votes.length;
        }

        // Finalize
        jobContract.finalizeDispute(_contractId, contractorPct, employerPct);
        dispute.ongoing = false;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../UserManager/UserManager.sol';
import '../../JobContract/JobContract.sol';

interface IReputationCard {
    // TODO
}

contract ReputationCard is IReputationCard {
    struct Review {
        address reviewer;
        uint8 rating;
        bytes32 messageHash;
        uint256 jobContractId;
    }

    mapping(uint256 => uint256) public reputation;
    mapping(address => Review[]) public reviews;
    mapping(address => mapping(uint256 => bool)) private reviewedContracts;

    function updateReputation(uint256 _userId, int256 _amount) external {
        uint256 rep = reputation[_userId];
        if (_amount < 0) {
            uint256 absAmount = uint256(-_amount);
            if (absAmount > rep) {
                rep = 0;
            } else {
                rep -= absAmount;
            }
        } else {
            rep += uint256(_amount);
        }
        reputation[_userId] = rep;
    }

    function addReview(
        address _address,
        uint8 _rating,
        string calldata _message,
        uint256 _jobContractId
    ) external {
        require(_rating >= 0 && _rating <= 5, 'rating must be between 0 and 5');
        require(!reviewedContracts[_address][_jobContractId], 'jobContract already reviewed');
        bytes32 messageHash = keccak256(abi.encodePacked(_message));
        reviews[_address].push(Review(msg.sender, _rating, messageHash, _jobContractId));
        reviewedContracts[_address][_jobContractId] = true;
    }

    function getReview(
        address _address,
        uint256 _index
    )
        public
        view
        returns (address reviewer, uint8 rating, bytes32 messageHash, uint256 jobContractId)
    {
        require(_index < reviews[_address].length, 'index out of bounds');
        Review storage review = reviews[_address][_index];
        return (review.reviewer, review.rating, review.messageHash, review.jobContractId);
    }

    function getReviewsCount(address _address) public view returns (uint256) {
        return reviews[_address].length;
    }
}

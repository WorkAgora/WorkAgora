// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../User/User.sol";
import "../../JobContract/JobContract.sol";

interface IReputationCard {
    // Update the reputation score with the given amount (positive or negative)
    function updateReputation(int256 _amount) external;

    // Get the current reputation score
    function getReputation() external view returns (uint256);

    // Add a review with the given rating, message, and associated JobContract
    // Ensures that the user has not reviewed the JobContract before
    function addReview(
        uint256 rating,
        string calldata message,
        JobContract jobContract
    ) external;

    // Get the review at the specified index
    function getReview(uint256 index) external view returns (User reviewer, uint256 rating, bytes32 messageHash, JobContract jobContract);

    // Get the total number of reviews
    function getReviewsCount() external view returns (uint256);
}

contract ReputationCard is IReputationCard {
    struct Review {
        User reviewer;
        uint256 rating;
        bytes32 messageHash;
        JobContract jobContract;
    }

    uint256 private reputation;
    Review[] private reviews;
    mapping(JobContract => bool) private reviewedContracts;

    constructor() {
        reputation = 0;
    }

    function updateReputation(int256 _amount) external override {
        if (_amount < 0) {
            uint256 absAmount = uint256(-_amount);
            if (absAmount > reputation) {
                reputation = 0;
            } else {
                reputation -= absAmount;
            }
        } else {
            reputation += uint256(_amount);
        }
    }

    function getReputation() external view override returns (uint256) {
        return reputation;
    }

    function addReview(
        uint256 rating,
        string calldata message,
        JobContract jobContract
    ) external {
        require(rating >= 0 && rating <= 5, "Rating must be between 0 and 5");
        require(!reviewedContracts[jobContract], "JobContract already reviewed");
        User reviewer = User(msg.sender);
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        reviews.push(Review(reviewer, rating, messageHash, jobContract));
    }

    function getReview(uint256 index) public view returns (User reviewer, uint256 rating, bytes32 messageHash, JobContract jobContract) {
        require(index < reviews.length, "Index out of bounds");
        Review storage review = reviews[index];
        return (review.reviewer, review.rating, review.messageHash, review.jobContract);
    }

    function getReviewsCount() public view returns (uint256) {
        return reviews.length;
    }
}

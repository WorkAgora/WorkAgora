// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../User/User.sol";
import "../../JobContract/JobContract.sol";
import "./IReputationCard.sol";

contract ReputationCard is IReputationCard {
    struct Review {
        User reviewer;
        uint256 rating;
        bytes32 messageHash;
        JobContract jobContract;
    }

    uint256 private reputation;
    Review[] private reviews;

    constructor() {
        reputation = 0;
    }

    // Update the reputation score with the given amount (positive or negative)
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

    // Get the current reputation score
    function getReputation() external view override returns (uint256) {
        return reputation;
    }

    function addReview(
        User reviewer,
        uint256 rating,
        bytes32 messageHash,
        JobContract jobContract
    ) external {
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

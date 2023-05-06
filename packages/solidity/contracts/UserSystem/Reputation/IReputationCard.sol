// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IReputationCard {
    // Add functions and events specific to the ReputationCard

    // Update the reputation score with the given amount (positive or negative)
    function updateReputation(int256 _amount) external;

    // Get the current reputation score
    function getReputation() external view returns (uint256);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title IReputable
 * @dev The IReputable interface defines the functions for reputation management
 */
interface IReputable {
    /**
     * @dev Updates the reputation score of a user
     * @param _userId The user ID
     * @param _amount The amount to add to the user's reputation score
     */
    function updateReputation(uint256 _userId, int256 _amount) external;

    /**
     * @dev Retrieves the reputation score of a user
     * @param _userId The user ID
     * @return int256 The reputation score of the user
     */
    function getReputation(uint256 _userId) external view returns (int256);
}

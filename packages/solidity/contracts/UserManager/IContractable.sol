// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../JobContract/JobContract.sol';

/**
 * @title IContractable
 * @dev The IContractable interface defines the functions for contract management
 */
interface IContractable {
    /**
     * @dev Initializes the contract with the job contract
     * @param _jobContract The address of the job contract
     */
    function initialize(JobContract _jobContract) external;

    /**
     * @dev Sets the contract ID for a user
     * @param _userId The user ID
     * @param _contractId The contract ID
     */
    function setContract(uint256 _userId, string calldata _contractId) external;
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './UserManager.sol';
import '../JobContract/JobContract.sol';

/**
 * @title IUserManager
 * @dev The IUserManager interface defines the functions for user management
 */
interface IUserManager {
    /**
     * @dev Role enum representing the two roles in the contract: Employer and Contractor
     */
    enum Role {
        Employer,
        Contractor
    }

    /**
     * @dev Initializes the user manager with necessary contracts and signature authority
     * @param _sigAuthority The address of the signature authority
     * @param _employer The address of the employer contract
     * @param _contractor The address of the contractor contract
     * @param _jobContract The address of the job contract
     */
    function initialize(
        address _sigAuthority,
        Employer _employer,
        Contractor _contractor,
        JobContract _jobContract
    ) external;

    /**
     * @dev Finalizes a job contract and updates reputations of contractor and employer
     * @param _contractor The address of the contractor
     * @param _employer The address of the employer
     * @param reputation The reputation score to update
     */
    function finalize(address _contractor, address _employer, uint128 reputation) external;

    /**
     * @dev Verifies a user by checking the provided signature
     * @param _address The address of the user to be verified
     * @param _kycId The KYC id of the user
     * @param _signature The signature provided by the user
     */
    function verifyUser(
        address _address,
        string calldata _kycId,
        bytes calldata _signature
    ) external;

    /**
     * @dev Checks if a user is verified
     * @param _address The address of the user to check
     * @return bool The verification status of the user
     */
    function isUserVerified(address _address) external view returns (bool);

    /**
     * @dev Retrieves the reputation of a user based on their role
     * @param _address The address of the user
     * @param _role The role of the user (employer/contractor)
     * @return int256 The reputation score of the user
     */
    function getReputation(address _address, Role _role) external view returns (int256);

    /**
     * @dev Retrieves the total reputation of a user
     * @param _address The address of the user
     * @return int256 The total reputation score of the user
     */
    function getTotalReputation(address _address) external view returns (int256);

    /**
     * @dev Checks if a user has a negative reputation
     * @param _address The address of the user
     * @return bool Whether the user has a negative reputation
     */
    function hasNegativeReputation(address _address) external view returns (bool);

    /**
     * @dev Retrieves the employer ID for a user
     * @param _address The address of the user
     * @return uint256 The employer ID of the user
     */
    function getEmployerId(address _address) external view returns (uint256);

    /**
     * @dev Retrieves the contractor ID for a user
     * @param _address The address of the user
     * @return uint256 The contractor ID of the user
     */
    function getContractorId(address _address) external view returns (uint256);
}

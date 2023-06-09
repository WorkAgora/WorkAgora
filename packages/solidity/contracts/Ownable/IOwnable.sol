//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title IOwnable
 * @dev Interface for an Ownable contract. This interface includes the method signatures required,
 * and should be implemented by any contract which needs to manage contract ownership.
 */
interface IOwnable {
    /**
     * @dev Method for setting the contract owner
     * @param _owner The address of the new contract owner
     */
    function setOwner(address _owner) external;

    /**
     * @dev Method for retrieving the contract owner
     * @return address Returns the address of the current contract owner
     */
    function owner() external view returns (address);
}

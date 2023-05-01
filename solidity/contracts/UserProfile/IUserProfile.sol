//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @dev Interface for the User Profile
 *
 * This contract is use to handle the eReputation of worker or contractor
 * Rating requirements :
 * - You must have a work contract between the two address to be able to rate someone
 * - You must have a signature from the admin address (our private key)
 * - Work contract must be validated
 *
 * This contract also keep track of the user:
 * - KYC or not
 * - wallet address
 *
 */
interface IUserProfile {

}
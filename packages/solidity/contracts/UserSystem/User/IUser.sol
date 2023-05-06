// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IUser {
    // Event emitted when a user is successfully verified
    event UserVerified(address indexed walletAddress);

    // Initializes the User contract with the given kycSystem address
    function initialize(address _kycSystem) external;

    // Verifies a user using their wallet address, KYC ID, and a signature
    // The signature should be signed by the KYC system to ensure validity
    function verifyUser(address _address, string calldata _kycId, bytes calldata _signature) external;

    // Checks if a user is verified by checking if their wallet address has an associated KYC ID
    function isUserVerified(address _walletAddress) external view returns (bool);
}

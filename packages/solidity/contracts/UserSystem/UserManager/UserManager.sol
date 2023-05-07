// SPDX-License-Identifier: MIT
// Consolidating Employer and Contractor contracts in this file to avoid
// compilation error: "Definition of base has to precede definition of derived contract."
pragma solidity ^0.8.18;

import "../Reputation/ReputationCardHolder.sol";
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

interface IUserManager {
    // Event emitted when a user is successfully verified
    event UserVerified(address indexed _address);

    // Initializes the User contract with the given kycSystem address
    function initialize(address _kycSystem) external;

    // Verifies a user using their wallet address, KYC ID, and a signature
    // The signature should be signed by the KYC system to ensure validity
    function verifyUser(address _address, string calldata _kycId, bytes calldata _signature) external;

    // Checks if a user is verified by checking if their wallet address has an associated KYC ID
    function isUserVerified(address _address) external view returns (bool);
}

interface IEmployer {
    // Add other functions specific to the Employer
}

interface IContractor {
    // Add other functions specific to the Contractor
}

contract UserManager is IUserManager {
    using ECDSA for bytes32;

    address public kycSystem;
    mapping(address => string) public verifiedUsers;
    mapping(address => address) public Employers;
    mapping(address => address) public Contractors;

    function initialize(address _kycSystem) public {
        require(kycSystem == address(0), 'already initialized');
        kycSystem = _kycSystem;
    }

    function verifyUser(address _address, string calldata _kycId, bytes calldata _signature) public {
        require(!isUserVerified(_address), 'already verified');
        bytes32 messagehash = keccak256(abi.encodePacked(_address, _kycId));
        require(messagehash.toEthSignedMessageHash().recover(_signature) == kycSystem, 'invalid signature');

        Employer employer = new Employer();
        Employers[_address] = address(employer);
        Contractor contractor = new Contractor();
        Contractors[_address] = address(contractor);

        verifiedUsers[_address] = _kycId;
        emit UserVerified(_address);
    }

    function isUserVerified(address _address) public view returns (bool) {
        return bytes(verifiedUsers[_address]).length > 0;
    }
}

contract Employer is IEmployer, ReputationCardHolder {
    // Add other functions specific to the Employer
}

contract Contractor is IContractor, ReputationCardHolder {
    // Add other functions specific to the Contractor
}

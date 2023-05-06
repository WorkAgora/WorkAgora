// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './IUser.sol';
import '../Contractor/Contractor.sol';
import '../Employer/Employer.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract User is IUser {
    using ECDSA for bytes32;

    address public kycSystem;
    mapping(address => string) public verifiedUsers;
    mapping(address => address) public Employers;
    mapping(address => address) public Contractors;

    function initialize(address _kycSystem) public {
        require(kycSystem == address(0), 'Already initialized');
        kycSystem = _kycSystem;
    }

    function verifyUser(address _address, string calldata _kycId, bytes calldata _signature) public {
        require(!isUserVerified(_address), 'Already verified');
        bytes32 messagehash = keccak256(bytes(abi.encodePacked(_address, _kycId)));
        require(messagehash.toEthSignedMessageHash().recover(_signature) == kycSystem, 'invalid signature');

        Employer employer = new Employer();
        Employers[_address] = address(employer);
        Contractor contractor = new Contractor();
        Contractors[_address] = address(contractor);

        verifiedUsers[_address] = _kycId;
    }

    function isUserVerified(address _walletAddress) public view returns (bool) {
        return bytes(verifiedUsers[_walletAddress]).length > 0;
    }
}

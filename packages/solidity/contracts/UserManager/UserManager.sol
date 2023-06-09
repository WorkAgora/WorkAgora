// SPDX-License-Identifier: MIT
// Consolidating Employer and Contractor contracts in this file to avoid
// compilation error: "Definition of base has to precede definition of derived contract."
pragma solidity ^0.8.18;

import './IUserManager.sol';
import '../JobContract/JobContract.sol';
import '../Ownable/Ownable.sol';
import './Contractable.sol';
import './Reputable.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

// Proxied
contract UserManager is IUserManager, Ownable {
    using ECDSA for bytes32;

    address public sigAuthority;
    Employer public employer;
    Contractor public contractor;
    JobContract public jobContract;
    mapping(address => UserInfo) public verifiedUsers;
    uint256 private idCounter;

    struct UserInfo {
        string kycId;
        uint256 employerId;
        uint256 contractorId;
    }

    modifier onlyVerifiedUser(address _address) {
        require(isUserVerified(_address), 'User not verified');
        _;
    }

    modifier onlyJobContract() {
        require(msg.sender == address(jobContract), 'Caller is not job contract');
        _;
    }

    function initialize(
        address _sigAuthority,
        Employer _employer,
        Contractor _contractor,
        JobContract _jobContract
    ) external override onlyOwner {
        require(address(employer) == address(0), 'Already initialized');
        employer = Employer(_employer);
        contractor = Contractor(_contractor);
        jobContract = JobContract(_jobContract);
        sigAuthority = _sigAuthority;
    }

    function finalize(
        address _contractor,
        address _employer,
        uint128 reputation
    ) external override onlyJobContract {
        int256 reputationChange = int256(uint256(reputation)); // safe since from uint128
        uint256 contractorId = getContractorId(_contractor);
        contractor.updateReputation(contractorId, reputationChange);
        uint256 employerId = getEmployerId(_employer);
        employer.updateReputation(employerId, reputationChange);
    }

    // Verification
    function verifyUser(
        address _address,
        string calldata _kycId,
        bytes calldata _signature
    ) external override {
        require(!isUserVerified(_address), 'Already verified');
        bytes32 messagehash = keccak256(abi.encodePacked(_address, _kycId));
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == sigAuthority,
            'Invalid signature'
        );
        verifiedUsers[_address] = UserInfo(_kycId, ++idCounter, ++idCounter);
    }

    function isUserVerified(address _address) public override view returns (bool) {
        return bytes(verifiedUsers[_address].kycId).length > 0;
    }

    // Reputation
    function getReputation(
        address _address,
        Role _role
    ) public override view onlyVerifiedUser(_address) returns (int256) {
        if (_role == Role.Employer) {
            return employer.getReputation(getEmployerId(_address));
        } else {
            return contractor.getReputation(getContractorId(_address));
        }
    }

    function getTotalReputation(
        address _address
    ) external override view onlyVerifiedUser(_address) returns (int256) {
        return getReputation(_address, Role.Contractor) + getReputation(_address, Role.Employer);
    }

    function hasNegativeReputation(
        address _address
    ) external override view onlyVerifiedUser(_address) returns (bool) {
        return
            getReputation(_address, Role.Contractor) < 0 ||
            getReputation(_address, Role.Employer) < 0;
    }

    // IDs
    function getEmployerId(
        address _address
    ) public override view onlyVerifiedUser(_address) returns (uint256) {
        return verifiedUsers[_address].employerId;
    }

    function getContractorId(
        address _address
    ) public override view onlyVerifiedUser(_address) returns (uint256) {
        return verifiedUsers[_address].contractorId;
    }
}

contract Employer is Contractable, Reputable {
    // TODO: employer secondary features here
}

contract Contractor is Contractable, Reputable {
    // TODO: contractor secondary features here
}

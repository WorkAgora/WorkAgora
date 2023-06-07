// SPDX-License-Identifier: MIT
// Consolidating Employer and Contractor contracts in this file to avoid
// compilation error: "Definition of base has to precede definition of derived contract."
pragma solidity ^0.8.18;

import '../JobContract/JobContract.sol';
import '../Ownable/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

interface IUserManager {
    // // Event emitted when a user is successfully verified
    event UserVerified(address indexed _address);

    // // Initializes the User contract with the given sigAuthority address
    // function initialize(address _sigAuthority) external;

    // // Verifies a user using their wallet address, KYC ID, and a signature
    // // The signature should be signed by the KYC system to ensure validity
    // function verifyUser(address _address, string calldata _kycId, bytes calldata _signature) external;

    // // Checks if a user is verified by checking if their wallet address has an associated KYC ID
    // function isUserVerified(address _address) external view returns (bool);
}

interface IEmployer {
    // Add other functions specific to the Employer
}

interface IContractor {
    // Add other functions specific to the Contractor
}

contract UserManager is IUserManager, Ownable {
    using ECDSA for bytes32;

    address public sigAuthority;
    Employer public employer;
    Contractor public contractor;
    JobContract public jobContract;
    mapping(address => UserInfo) public verifiedUsers;
    uint256 private idCounter;

    enum Role {
        Employer,
        Contractor
    }

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
    ) external onlyOwner {
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
    ) external onlyJobContract {
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
    ) external {
        require(!isUserVerified(_address), 'Already verified');
        bytes32 messagehash = keccak256(abi.encodePacked(_address, _kycId));
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == sigAuthority,
            'Invalid signature'
        );
        verifiedUsers[_address] = UserInfo(_kycId, ++idCounter, ++idCounter);
        emit UserVerified(_address);
    }

    function isUserVerified(address _address) public view returns (bool) {
        return bytes(verifiedUsers[_address].kycId).length > 0;
    }

    // Reputation
    function getReputation(
        address _address,
        Role _role
    ) public view onlyVerifiedUser(_address) returns (int256) {
        if (_role == Role.Employer) {
            return employer.getReputation(getEmployerId(_address));
        } else {
            return contractor.getReputation(getContractorId(_address));
        }
    }

    function getTotalReputation(
        address _address
    ) external view onlyVerifiedUser(_address) returns (int256) {
        return getReputation(_address, Role.Contractor) + getReputation(_address, Role.Employer);
    }

    function hasNegativeReputation(
        address _address
    ) external view onlyVerifiedUser(_address) returns (bool) {
        return
            getReputation(_address, Role.Contractor) < 0 ||
            getReputation(_address, Role.Employer) < 0;
    }

    // IDs
    function getEmployerId(
        address _address
    ) public view onlyVerifiedUser(_address) returns (uint256) {
        return verifiedUsers[_address].employerId;
    }

    function getContractorId(
        address _address
    ) public view onlyVerifiedUser(_address) returns (uint256) {
        return verifiedUsers[_address].contractorId;
    }
}

contract Reputable {
    mapping(uint256 => int256) public reputation;

    function updateReputation(uint256 _userId, int256 _amount) external {
        reputation[_userId] += _amount;
    }

    function getReputation(uint256 _userId) external view returns (int256) {
        return reputation[_userId];
    }
}

contract Contractable is Ownable {
    JobContract jobContract;
    mapping(uint256 => string) public contractIds;

    modifier onlyJobContract() {
        require(msg.sender == address(jobContract), 'Caller is not job contract');
        _;
    }

    function initialize(JobContract _jobContract) external onlyOwner {
        require(address(jobContract) == address(0), 'Already initialized');
        jobContract = JobContract(_jobContract);
    }

    function setContract(uint256 _userId, string calldata _contractId) external onlyJobContract {
        require(bytes(contractIds[_userId]).length == 0, 'Contract already set');
        contractIds[_userId] = _contractId;
    }
}

contract Employer is Contractable, Reputable {
    // TODO: employer secondary features here
}

contract Contractor is Contractable, Reputable {
    // TODO: contractor secondary features here
}

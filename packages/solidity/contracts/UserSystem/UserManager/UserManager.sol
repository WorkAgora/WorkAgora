// SPDX-License-Identifier: MIT
// Consolidating Employer and Contractor contracts in this file to avoid
// compilation error: "Definition of base has to precede definition of derived contract."
pragma solidity ^0.8.18;

import '../Reputation/ReputationCard.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

interface IUser {
    // // Event emitted when a user is successfully verified
    event UserVerified(address indexed _address);

    // // Initializes the User contract with the given kycSystem address
    // function initialize(address _kycSystem) external;

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

contract User is IUser {
    using ECDSA for bytes32;

    uint256 private idCounter;

    address public kycSystem;
    ReputationCard public reputationCard;
    Employer public employer;
    Contractor public contractor;
    mapping(address => UserInfo) public verifiedUsers;

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
        require(isUserVerified(_address), 'user not verified');
        _;
    }

    function initialize(
        address _kycSystem,
        address _reputationCard,
        address _employer,
        address _contractor
    ) public {
        require(kycSystem == address(0), 'Already initialized');
        reputationCard = ReputationCard(_reputationCard);
        employer = Employer(_employer);
        contractor = Contractor(_contractor);
        // reputationCard.initialize(this);
        // employer.initialize(this);
        // contractor.initialize(this);
        kycSystem = _kycSystem;
    }

    function verifyUser(
        address _address,
        string calldata _kycId,
        bytes calldata _signature
    ) public {
        require(!isUserVerified(_address), 'Already verified');
        bytes32 messagehash = keccak256(abi.encodePacked(_address, _kycId));
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == kycSystem,
            'Invalid signature'
        );
        verifiedUsers[_address] = UserInfo(_kycId, ++idCounter, ++idCounter);
        emit UserVerified(_address);
    }

    function isUserVerified(address _address) public view returns (bool) {
        return bytes(verifiedUsers[_address].kycId).length > 0;
    }

    function getReputation(
        address _address,
        Role _role
    ) external view onlyVerifiedUser(_address) returns (uint256) {
        uint256 id;
        if (_role == Role.Employer) {
            id = verifiedUsers[_address].employerId;
        } else if (_role == Role.Contractor) {
            id = verifiedUsers[_address].contractorId;
        } else {
            revert('Invalid role');
        }
        return reputationCard.reputation(id);
    }
}

// contract Reputable {
//     User public user;
//     ReputationCard public reputationCard;

//     modifier onlyVerifiedUser(address _address) {
//         require(user.isUserVerified(_address), 'user not verified');
//         _;
//     }

//     function initialize(User _user, ReputationCard _reputationCard) public {
//         require(user == address(0), 'Already initialized');
//         require(reputationCard == address(0), 'Already initialized');
//         user = _user;
//         reputationCard = _reputationCard;
//     }
// }

contract Employer is IEmployer {
    uint256 private tmp1;
}

contract Contractor is IContractor {
    uint256 private tmp2;
}

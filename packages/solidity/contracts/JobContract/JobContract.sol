//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../UserSystem/UserManager/UserManager.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract JobContract {
    using ECDSA for bytes32;

    struct Contract {
        uint256 contractId;
        uint256 priceUsd;
        uint256 durationDays;
        uint256 creationExpiryTimestamp;
        address contractorAddress;
        address employerAddress;
        State state;
        string ipfsJmiHash;
    }

    enum State {
        Started,
        CompleteWithSuccess,
        OngoingDispute,
        CompleteWithDispute
    }

    User user;
    mapping(uint256 => Contract) public contracts;

    function initialize(User _user) external {
        require(address(user) == address(0), 'Already initialized');
        user = User(_user);
    }

    function create(
        uint256 _contractId,
        uint256 _priceUsd,
        uint256 _durationDays,
        uint256 _creationExpiryTimestamp,
        address _contractorAddress,
        address _employerAddress,
        string calldata _ipfsJmiHash,
        bytes calldata _signature
    ) external {
        require(contracts[_contractId].contractId == 0, 'ContractId already exists');
        require(_creationExpiryTimestamp >= block.timestamp, 'Creation timestamp expired');
        require(msg.sender == _employerAddress, 'Only the employer can create the contract');
        require(_contractorAddress != _employerAddress, 'Invalid C/E addresses');
        require(user.isUserVerified(_contractorAddress), 'Unverified contractor');
        require(user.isUserVerified(_employerAddress), 'Unverified employer');
        require(_durationDays > 0, 'Duration must be at least 1 day');

        bytes32 messagehash = keccak256(
            abi.encodePacked(
                _contractId,
                _priceUsd,
                _durationDays,
                _creationExpiryTimestamp,
                _contractorAddress,
                _employerAddress,
                _ipfsJmiHash
            )
        );
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == user.authority(),
            'Invalid signature'
        );

        contracts[_contractId] = Contract(
            _contractId,
            _priceUsd,
            _durationDays,
            _creationExpiryTimestamp,
            _contractorAddress,
            _employerAddress,
            State.Started,
            _ipfsJmiHash
        );
    }
}

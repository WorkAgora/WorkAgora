//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../UserSystem/UserManager/UserManager.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract JobContract {
    using ECDSA for bytes32;

    struct Contract {
        string contractId;
        State state;
        uint256 totalAmountUsd;
        uint256 durationDays;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
    }

    struct CreateParams {
        string contractId;
        uint256 totalAmountUsd;
        uint8 initialDepositPct;
        uint8 lockedAmountPct;
        uint8 deferredAmountPct;
        uint256 durationDays;
        uint256 creationExpiryTimestamp;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
    }

    enum State {
        Started,
        CompleteWithSuccess,
        OngoingDispute,
        CompleteWithDispute
    }

    User user;
    mapping(string => Contract) public contracts;

    function initialize(User _user) external {
        require(address(user) == address(0), 'Already initialized');
        user = User(_user);
    }

    function create(CreateParams calldata _params, bytes calldata _signature) external {
        require(
            bytes(contracts[_params.contractId].contractId).length == 0,
            'ContractId already exists'
        );
        require(_params.creationExpiryTimestamp >= block.timestamp, 'Creation timestamp expired');
        require(msg.sender == _params.employerAddress, 'Only the employer can create the contract');
        require(_params.contractorAddress != _params.employerAddress, 'Invalid C/E addresses');
        require(user.isUserVerified(_params.contractorAddress), 'Unverified contractor');
        require(user.isUserVerified(_params.employerAddress), 'Unverified employer');
        require(_params.durationDays > 0, 'Duration must be at least 1 day');
        require(
            _params.initialDepositPct + _params.lockedAmountPct + _params.deferredAmountPct == 100,
            'Sum of initialDepositPct, lockedAmountPct and deferredAmountPct must be 100'
        );

        bytes32 messagehash = keccak256(
            abi.encodePacked(
               _params.contractId,
                _params.totalAmountUsd,
                _params.initialDepositPct,
                _params.lockedAmountPct,
                _params.deferredAmountPct,
                _params.durationDays,
                _params.creationExpiryTimestamp,
                _params.contractorAddress,
                _params.employerAddress,
                _params.ipfsJmiHash
            )
        );
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == user.authority(),
            'Invalid signature'
        );

        contracts[_params.contractId] = Contract(
            _params.contractId,
            State.Started,
            _params.totalAmountUsd,
            _params.durationDays,
            _params.contractorAddress,
            _params.employerAddress,
            _params.ipfsJmiHash
        );
    }
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../UserSystem/UserManager/UserManager.sol';
import '../PriceController/PriceController.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract JobContract is Ownable {
    using ECDSA for bytes32;

    struct Contract {
        string contractId;
        State state;
        uint256 totalAmountToken;
        uint8 lockedAmountPct;
        uint8 deferredAmountPct;
        PaymentToken paymentToken;
        uint256 durationDays;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
        string ipfsJfiHash;
    }

    struct CreateParams {
        string contractId;
        uint256 totalAmountUsd;
        PaymentToken paymentToken;
        uint8 initialDepositPct;
        uint8 lockedAmountPct;
        uint8 deferredAmountPct;
        uint256 durationDays;
        uint256 creationExpiryTimestamp;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
    }

    struct FinalizationParams {
        string contractId;
        string ipfsJfiHash;
    }

    enum State {
        None,
        Started,
        CompleteWithSuccess,
        OngoingDispute,
        CompleteWithDispute
    }

    UserManager user;
    PriceController priceController;
    mapping(string => Contract) public contracts;

    function initialize(address _user, address _priceController) external onlyOwner {
        require(address(user) == address(0), 'Already initialized');
        user = UserManager(_user);
        priceController = PriceController(_priceController);
    }

    function create(CreateParams calldata _params, bytes calldata _signature) external {
        require(verifyCreationSignature(_params, _signature), 'Invalid signature');
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
            priceController.isTokenSet(_params.paymentToken),
            'Token not set in price controller'
        );
        require(
            _params.initialDepositPct + _params.lockedAmountPct + _params.deferredAmountPct == 100,
            'Sum of initialDepositPct, lockedAmountPct and deferredAmountPct must be 100'
        );

        (, IERC20 token) = priceController.getTokenData(_params.paymentToken);
        uint256 totalAmountToken = priceController.getTokenPriceFromUsd(
            _params.paymentToken,
            _params.totalAmountUsd
        );
        transferCreationFunds(_params, token, totalAmountToken);

        contracts[_params.contractId] = Contract(
            _params.contractId,
            State.Started,
            totalAmountToken,
            _params.lockedAmountPct,
            _params.deferredAmountPct,
            _params.paymentToken,
            _params.durationDays,
            _params.contractorAddress,
            _params.employerAddress,
            _params.ipfsJmiHash,
            ''
        );
    }

    function finalize(FinalizationParams calldata _params, bytes calldata _signature) external {
        require(verifyFinalizationSignature(_params, _signature), 'Invalid signature');
        require(contracts[_params.contractId].state == State.Started, 'Invalid contract state');

        Contract storage record = contracts[_params.contractId];
        (, IERC20 token) = priceController.getTokenData(record.paymentToken);
        transferFinalizationFunds(record, token);

        record.state = State.CompleteWithSuccess;
        record.ipfsJfiHash = _params.ipfsJfiHash;
    }

    function transferCreationFunds(
        CreateParams calldata _params,
        IERC20 token,
        uint256 totalAmountToken
    ) internal {
        uint256 employerBalance = token.balanceOf(_params.employerAddress);
        require(employerBalance >= totalAmountToken, 'Insufficient balance');

        if (_params.initialDepositPct > 0) {
            uint256 initialDepositAmount = (totalAmountToken * _params.initialDepositPct) / 100;
            // transfer from employer to contractor
            require(
                token.transferFrom(
                    _params.employerAddress,
                    _params.contractorAddress,
                    initialDepositAmount
                ),
                'transferFrom failed from employer to contractor'
            );
        }

        if (_params.lockedAmountPct > 0) {
            uint256 lockedAmount = (totalAmountToken * _params.lockedAmountPct) / 100;
            // transfer from employer to contract
            require(
                token.transferFrom(_params.employerAddress, address(this), lockedAmount),
                'transfer failed from employer to contract'
            );
        }
    }

    function verifyCreationSignature(
        CreateParams calldata _params,
        bytes calldata _signature
    ) internal view returns (bool) {
        bytes32 messagehash = keccak256(
            abi.encodePacked(
                _params.contractId,
                _params.totalAmountUsd,
                _params.paymentToken,
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
        return messagehash.toEthSignedMessageHash().recover(_signature) == user.sigAuthority();
    }

    function transferFinalizationFunds(Contract memory record, IERC20 token) internal {
        if (record.lockedAmountPct > 0) {
            uint256 lockedAmount = (record.totalAmountToken * record.lockedAmountPct) / 100;
            // transfer from contract to contractor
            require(
                token.transfer(record.contractorAddress, lockedAmount),
                'transfer failed from contract to contractor'
            );
        }

        if (record.deferredAmountPct > 0) {
            uint256 deferredAmount = (record.totalAmountToken * record.deferredAmountPct) / 100;
            // transfer from employer to contractor
            require(
                token.transferFrom(
                    record.employerAddress,
                    record.contractorAddress,
                    deferredAmount
                ),
                'transferFrom failed from employer to contractor'
            );
        }
    }

    function verifyFinalizationSignature(
        FinalizationParams calldata _params,
        bytes calldata _signature
    ) internal view returns (bool) {
        bytes32 messagehash = keccak256(abi.encodePacked(_params.contractId, _params.ipfsJfiHash));
        return messagehash.toEthSignedMessageHash().recover(_signature) == user.sigAuthority();
    }
}

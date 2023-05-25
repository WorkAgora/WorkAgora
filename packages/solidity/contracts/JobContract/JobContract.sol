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
        uint256 totalAmountUsd;
        PaymentToken paymentToken;
        uint256 durationDays;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
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

    enum State {
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
        require(verifySignature(_params, _signature), 'Invalid signature');
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
        uint256 totalAmountInTokens = getContractPrice(
            _params.paymentToken,
            _params.totalAmountUsd
        );
        transferFunds(_params, token, totalAmountInTokens);

        contracts[_params.contractId] = Contract(
            _params.contractId,
            State.Started,
            _params.totalAmountUsd,
            _params.paymentToken,
            _params.durationDays,
            _params.contractorAddress,
            _params.employerAddress,
            _params.ipfsJmiHash
        );
    }

    function transferFunds(
        CreateParams calldata _params,
        IERC20 token,
        uint256 totalAmountInTokens
    ) internal {
        uint256 employerBalance = token.balanceOf(_params.employerAddress);
        require(employerBalance >= totalAmountInTokens, 'Insufficient balance');

        if (_params.initialDepositPct > 0) {
            uint256 initialDepositAmount = (totalAmountInTokens * _params.initialDepositPct) / 100;
            // transfer from the employer to the contract
            require(
                token.transferFrom(_params.employerAddress, address(this), initialDepositAmount),
                'transferFrom failed from employer to contract'
            );
            // then from the contract to the contractor
            require(
                token.transfer(_params.contractorAddress, initialDepositAmount),
                'transfer failed from contract to contractor'
            );
        }

        if (_params.lockedAmountPct > 0) {
            uint256 lockedAmount = (totalAmountInTokens * _params.lockedAmountPct) / 100;
            // transfer from the employer to the contract
            require(
                token.transferFrom(_params.employerAddress, address(this), lockedAmount),
                'transfer failed from employer to contract'
            );
        }
    }

    function getContractPrice(
        PaymentToken _paymentToken,
        uint256 _amountUsd
    ) public view returns (uint256) {
        (PriceConsumer priceConsumer, ) = priceController.getTokenData(_paymentToken);
        return _amountUsd * uint256(priceConsumer.getLatestPrice());
    }

    function verifySignature(
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
}

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

        checkEmployerBalance(_params);
        verifySignature(_params, _signature);

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

    function checkEmployerBalance(CreateParams calldata _params) internal view {
        (PriceConsumer priceConsumer, IERC20 token) = priceController.getTokenData(
            _params.paymentToken
        );
        uint256 totalAmountInTokens = _params.totalAmountUsd * uint256(priceConsumer.getLatestPrice());
        uint256 employerBalance = token.balanceOf(_params.employerAddress);
        require(employerBalance >= totalAmountInTokens, 'Insufficient balance');
    }

    function getEmployerBalance(CreateParams calldata _params) public view returns(uint256) {
        (, IERC20 token) = priceController.getTokenData(
            _params.paymentToken
        );
        return token.balanceOf(_params.employerAddress);
    }

    function getContractPrice(CreateParams calldata _params) public view returns(uint256) {
        (PriceConsumer priceConsumer,) = priceController.getTokenData(
            _params.paymentToken
        );
        return _params.totalAmountUsd * uint256(priceConsumer.getLatestPrice());
    }

    function verifySignature(
        CreateParams calldata _params,
        bytes calldata _signature
    ) internal view {
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
        require(
            messagehash.toEthSignedMessageHash().recover(_signature) == user.sigAuthority(),
            'Invalid signature'
        );
    }
}

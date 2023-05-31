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
        State state;
        uint128 totalAmountUsd;
        uint256 totalAmountToken;
        uint8 lockedAmountPct;
        uint8 deferredAmountPct;
        PaymentToken paymentToken;
        uint256 endTimestamp;
        address contractorAddress;
        address employerAddress;
        string ipfsJmiHash;
        string ipfsJfiHash;
    }

    struct CreateParams {
        string contractId;
        uint128 totalAmountUsd;
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
    Employer employer;
    Contractor contractor;
    PriceController priceController;
    uint8 feePct;
    mapping(string => Contract) public contracts;

    function initialize(
        UserManager _user,
        PriceController _priceController,
        Employer _employer,
        Contractor _contractor,
        uint8 _feePct
    ) external onlyOwner {
        require(address(user) == address(0), 'Already initialized');
        require(_feePct < 100, 'Invalid fee');
        user = _user;
        priceController = _priceController;
        employer = _employer;
        contractor = _contractor;
        feePct = _feePct;
    }

    function create(CreateParams calldata _params, bytes calldata _signature) external {
        require(verifyCreationSignature(_params, _signature), 'Invalid signature');
        require(contracts[_params.contractId].state == State.None, 'ContractId already exists');
        require(_params.creationExpiryTimestamp >= block.timestamp, 'Creation timestamp expired');
        require(msg.sender == _params.employerAddress, 'Only the employer can create the contract');
        require(_params.contractorAddress != _params.employerAddress, 'Invalid C/E addresses');
        require(user.isUserVerified(_params.contractorAddress), 'Unverified contractor');
        require(user.isUserVerified(_params.employerAddress), 'Unverified employer');
        require(_params.durationDays > 0, 'Duration must be at least 1 day');
        require(_params.totalAmountUsd > 0, 'Usd amount must be at least 1');
        require(
            priceController.isTokenSet(_params.paymentToken),
            'Token not set in price controller'
        );
        require(
            _params.initialDepositPct + _params.lockedAmountPct + _params.deferredAmountPct == 100,
            'Sum of initialDepositPct, lockedAmountPct and deferredAmountPct must be 100'
        );
        require(
            _params.lockedAmountPct >= feePct,
            'Not enough locked amount to cover contract fees'
        );

        // Transfer funds
        (, IERC20 token) = priceController.getTokenData(_params.paymentToken);
        uint256 totalAmountToken = priceController.getTokenPriceFromUsd(
            _params.paymentToken,
            _params.totalAmountUsd
        );
        transferCreationFunds(_params, token, totalAmountToken);

        // Store contract
        uint256 endTimestamp = block.timestamp + (_params.durationDays * 1 days);
        contracts[_params.contractId] = Contract(
            State.Started,
            _params.totalAmountUsd,
            totalAmountToken,
            _params.lockedAmountPct,
            _params.deferredAmountPct,
            _params.paymentToken,
            endTimestamp,
            _params.contractorAddress,
            _params.employerAddress,
            _params.ipfsJmiHash,
            ''
        );

        // Store contractId for employer and contractor
        uint256 employerId = user.getEmployerId(_params.employerAddress);
        employer.setContract(employerId, _params.contractId);
        uint256 contractorId = user.getContractorId(_params.contractorAddress);
        contractor.setContract(contractorId, _params.contractId);
    }

    function finalize(FinalizationParams calldata _params, bytes calldata _signature) external {
        require(verifyFinalizationSignature(_params, _signature), 'Invalid signature');
        require(contracts[_params.contractId].state == State.Started, 'Invalid contract state');

        Contract storage record = contracts[_params.contractId];

        // Transfer funds
        (, IERC20 token) = priceController.getTokenData(record.paymentToken);
        transferFinalizationFunds(record, token);

        // Update contract
        record.state = State.CompleteWithSuccess;
        record.ipfsJfiHash = _params.ipfsJfiHash;

        // Set reputation
        uint128 reputation = record.totalAmountUsd / 100 + 1;
        user.setContractFinalized(record.contractorAddress, record.employerAddress, reputation);
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

        uint256 lockedAmount = (totalAmountToken * _params.lockedAmountPct) / 100;
        // transfer from employer to contract
        require(
            token.transferFrom(_params.employerAddress, address(this), lockedAmount),
            'transfer failed from employer to contract'
        );
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
        uint256 contractorLockedAmountPct = record.lockedAmountPct - feePct;
        if (contractorLockedAmountPct > 0) {
            uint256 amount = (record.totalAmountToken * contractorLockedAmountPct) / 100;
            // transfer from contract to contractor + deduct fees
            require(
                token.transfer(record.contractorAddress, amount),
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

    function getContract(string calldata _contractId) public view returns (Contract memory) {
        return contracts[_contractId];
    }
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../DisputeSystem/DisputeSystem.sol';
import '../UserManager/UserManager.sol';
import '../Ownable/Ownable.sol';
import '../PriceController/PriceController.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Proxied
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
    DisputeSystem disputeSystem;
    uint8 feePct;
    mapping(string => Contract) public contracts;

    modifier onlyDisputeSystem() {
        require(msg.sender == address(disputeSystem), 'Caller is not dispute system');
        _;
    }
    
    function initialize(
        UserManager _user,
        PriceController _priceController,
        Employer _employer,
        Contractor _contractor,
        DisputeSystem _disputeSystem,
        uint8 _feePct
    ) external onlyOwner {
        require(address(user) == address(0), 'Already initialized');
        require(_feePct < 100, 'Invalid fee');
        user = _user;
        priceController = _priceController;
        employer = _employer;
        contractor = _contractor;
        feePct = _feePct;
        disputeSystem = _disputeSystem;
    }

    function create(CreateParams calldata _params, bytes calldata _signature) external payable {
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

        uint256 endTimestamp = block.timestamp + (_params.durationDays * 1 days);
        (uint256 totalAmountToken, ) = priceController.getTokenPriceFromUsd(
            _params.paymentToken,
            _params.totalAmountUsd
        );

        // Store contract
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

        // Transfer funds
        PriceController.TokenData memory data = priceController.getTokenData(_params.paymentToken);
        transferCreationFunds(_params, data.token, totalAmountToken);
    }

    function finalize(
        FinalizationParams calldata _params,
        bytes calldata _signature
    ) external payable {
        Contract storage record = contracts[_params.contractId];
        require(verifyFinalizationSignature(_params, _signature), 'Invalid signature');
        require(record.state == State.Started, 'Invalid contract state');

        // Update contract
        record.state = State.CompleteWithSuccess;
        record.ipfsJfiHash = _params.ipfsJfiHash;

        // Set reputation
        uint128 reputation = record.totalAmountUsd / 100 + 1;
        user.finalize(record.contractorAddress, record.employerAddress, reputation);

        // Transfer funds
        PriceController.TokenData memory data = priceController.getTokenData(record.paymentToken);
        transferFinalizationFunds(record, data.token);
    }

    function transferCreationFunds(
        CreateParams calldata _params,
        IERC20 token,
        uint256 totalAmountToken
    ) internal {
        bool isNativeTransfer = address(token) == address(0);
        uint256 initialDepositAmount = (totalAmountToken * _params.initialDepositPct) / 100;
        uint256 lockedAmount = (totalAmountToken * _params.lockedAmountPct) / 100;

        if (isNativeTransfer) {
            uint256 deferredAmount = (totalAmountToken * _params.deferredAmountPct) / 100;
            require(msg.sender.balance >= deferredAmount, 'Insufficient balance');
            require(msg.value == initialDepositAmount + lockedAmount, 'Unexpected transfer amount');
        } else {
            // ERC20
            uint256 employerBalance = token.balanceOf(_params.employerAddress);
            require(employerBalance >= totalAmountToken, 'Insufficient balance');
        }

        if (_params.initialDepositPct > 0) {
            // initial deposit - transfer from employer to contractor
            if (isNativeTransfer) {
                payable(_params.contractorAddress).transfer(initialDepositAmount);
            } else {
                // ERC20
                require(
                    token.transferFrom(
                        _params.employerAddress,
                        _params.contractorAddress,
                        initialDepositAmount
                    ),
                    'transferFrom failed from employer to contractor'
                );
            }
        }

        // locked amount - transfer from employer to contract
        if (isNativeTransfer) {
            // keep locked amount in contract
        } else {
            // ERC20
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
        bool isNativeTransfer = address(token) == address(0);
        uint256 lockedAmountPct = record.lockedAmountPct - feePct;
        uint256 lockedAmount = (record.totalAmountToken * lockedAmountPct) / 100;
        uint256 deferredAmount = (record.totalAmountToken * record.deferredAmountPct) / 100;

        if (isNativeTransfer) {
            require(msg.value == deferredAmount, 'Unexpected transfer amount');
        }

        if (lockedAmount > 0) {
            // locked amount - transfer from contract to contractor with deducted fees
            if (isNativeTransfer) {
                payable(record.contractorAddress).transfer(lockedAmount);
            } else {
                // ERC20
                require(
                    token.transfer(record.contractorAddress, lockedAmount),
                    'transfer failed from contract to contractor'
                );
            }
        }

        if (deferredAmount > 0) {
            // transfer from employer to contractor
            if (isNativeTransfer) {
                payable(record.contractorAddress).transfer(deferredAmount);
            } else {
                // ERC20
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

    // Disputes
    function initiateDispute(string calldata _contractId) external onlyDisputeSystem {
        Contract storage record = contracts[_contractId];
        record.state = State.OngoingDispute;
    }

    function finalizeDispute(
        string calldata _contractId,
        uint256 contractorPct,
        uint256 employerPct
    ) external onlyDisputeSystem {
        Contract storage record = contracts[_contractId];
        record.state = State.CompleteWithDispute;
    }
}

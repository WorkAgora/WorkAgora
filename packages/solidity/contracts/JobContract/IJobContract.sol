//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../UserManager/UserManager.sol';
import '../PriceController/PriceController.sol';
import '../DisputeSystem/DisputeSystem.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title IJobContract
 * @dev Interface for the JobContract contract. This interface includes the method signatures, and enums and structs required,
 * and should be implemented by any contract which needs to manage jobs and related entities (like contracts, employers, contractors, etc.).
 */
interface IJobContract {
    /**
     * @dev Enum representing the state of a job contract.
     */
    enum State {
        None, // Default state, contract not initialized
        Started, // Contract started
        CompleteWithSuccess, // Contract completed successfully
        OngoingDispute, // There's an ongoing dispute for the contract
        CompleteWithDispute // Contract completed with dispute
    }

    /**
     * @dev Struct representing a contract related to a job.
     */
    struct Contract {
        State state; // State of the contract
        uint128 totalAmountUsd; // Total amount of the contract in USD
        uint256 totalAmountToken; // Total amount of the contract in a specific token
        uint8 lockedAmountPct; // Percentage of total amount which is locked
        uint8 deferredAmountPct; // Percentage of total amount which is deferred
        IPriceController.PaymentToken paymentToken; // Token used for the contract
        uint256 endTimestamp; // End timestamp of the contract
        address contractorAddress; // Address of the contractor
        address employerAddress; // Address of the employer
        string ipfsJmiHash; // IPFS hash related to the job
        string ipfsJfiHash; // IPFS hash related to the finalization
    }

    /**
     * @dev Struct representing the parameters to create a job contract.
     */
    struct CreateParams {
        string contractId; // Unique contract ID
        uint128 totalAmountUsd; // Total amount of the contract in USD
        IPriceController.PaymentToken paymentToken; // Token used for the contract
        uint8 initialDepositPct; // Initial deposit percentage
        uint8 lockedAmountPct; // Locked amount percentage
        uint8 deferredAmountPct; // Deferred amount percentage
        uint256 durationDays; // Duration of the contract in days
        uint256 creationExpiryTimestamp; // Expiry timestamp of the contract creation
        address contractorAddress; // Address of the contractor
        address employerAddress; // Address of the employer
        string ipfsJmiHash; // IPFS hash related to the job
    }

    /**
     * @dev Struct representing the parameters to finalize a job contract.
     */
    struct FinalizationParams {
        string contractId; // Contract ID to finalize
        string ipfsJfiHash; // IPFS hash related to the finalization
    }

    /**
     * @dev Initialize a job contract with various contracts and parameters.
     * @param _user Address of the UserManager contract
     * @param _priceController Address of the PriceController contract
     * @param _employer Address of the Employer contract
     * @param _contractor Address of the Contractor contract
     * @param _disputeSystem Address of the DisputeSystem contract
     * @param _feePct Fee percentage
     */
    function initialize(
        UserManager _user,
        PriceController _priceController,
        Employer _employer,
        Contractor _contractor,
        DisputeSystem _disputeSystem,
        uint8 _feePct
    ) external;

    /**
     * @dev Create a new job contract.
     * @param _params Parameters for creating a new job contract
     * @param _signature Digital signature for the new job contract
     */
    function create(CreateParams calldata _params, bytes calldata _signature) external payable;

    /**
     * @dev Finalize a job contract.
     * @param _params Parameters for finalizing the job contract
     * @param _signature Digital signature for the finalization
     */
    function finalize(
        FinalizationParams calldata _params,
        bytes calldata _signature
    ) external payable;

    /**
     * @dev Get the details of a job contract.
     * @param _contractId Contract ID to get the details of
     * @return Contract details
     */
    function getContract(string calldata _contractId) external view returns (Contract memory);

    /**
     * @dev Initiate a dispute for a job contract.
     * @param _contractId Contract ID to initiate a dispute for
     */
    function initiateDispute(string calldata _contractId) external;

    /**
     * @dev Finalize a dispute for a job contract.
     * @param _contractId Contract ID to finalize the dispute for
     * @param contractorPct Percentage of the total contract amount to give to the contractor
     * @param employerPct Percentage of the total contract amount to give to the employer
     */
    function finalizeDispute(
        string calldata _contractId,
        uint256 contractorPct,
        uint256 employerPct
    ) external;
}

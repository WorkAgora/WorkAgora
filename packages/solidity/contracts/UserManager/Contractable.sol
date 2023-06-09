// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './IContractable.sol';
import '../Ownable/Ownable.sol';

contract Contractable is IContractable, Ownable {
    JobContract jobContract;
    mapping(uint256 => string) public contractIds;

    modifier onlyJobContract() {
        require(msg.sender == address(jobContract), 'Caller is not job contract');
        _;
    }

    function initialize(JobContract _jobContract) external override onlyOwner {
        require(address(jobContract) == address(0), 'Already initialized');
        jobContract = JobContract(_jobContract);
    }

    function setContract(uint256 _userId, string calldata _contractId) external override onlyJobContract {
        require(bytes(contractIds[_userId]).length == 0, 'Contract already set');
        contractIds[_userId] = _contractId;
    }
}

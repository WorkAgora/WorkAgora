// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './IReputable.sol';

contract Reputable is IReputable {
    mapping(uint256 => int256) public reputation;

    function updateReputation(uint256 _userId, int256 _amount) external override {
        reputation[_userId] += _amount;
    }

    function getReputation(uint256 _userId) external override view returns (int256) {
        return reputation[_userId];
    }
}

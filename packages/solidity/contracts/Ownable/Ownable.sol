//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './IOwnable.sol';

// Inherited contracts can be proxied
contract Ownable is IOwnable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }

    function setOwner(address _owner) external override {
        require(owner == address(0), 'Owner already set');
        owner = _owner;
    }
}

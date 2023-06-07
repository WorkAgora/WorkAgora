//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Inherited contracts can be proxied
contract Ownable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }

    function setOwner(address _owner) external {
        require(owner == address(0), 'Owner already set');
        owner = _owner;
    }
}

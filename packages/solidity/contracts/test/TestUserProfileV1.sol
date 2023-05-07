// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TestUserV1 {
    address public governance;
    mapping(address => bool) public registeredUsers;

    event UserRegistered(address indexed walletAddress);

    function setGovernance() public {
        require(governance == address(0), "Governance address can only be set once");
        governance = msg.sender;
    }

    function registerUser() public {
        require(!registeredUsers[msg.sender], "User already registered");

        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function isUserRegistered(address _walletAddress) public view returns (bool) {
        return registeredUsers[_walletAddress];
    }
}

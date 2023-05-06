// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TestUserV2 {
    address public governance;
    mapping(address => bool) public registeredUsers;
    mapping(address => bool) public verifiedUsers;

    event UserRegistered(address indexed walletAddress);
    event UserVerified(address indexed walletAddress);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Only governance can call this function");
        _;
    }

    function registerUser() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function isUserRegistered(address _walletAddress) public view returns (bool) {
        return registeredUsers[_walletAddress];
    }

    function verifyUser(address _walletAddress) public onlyGovernance {
        require(registeredUsers[_walletAddress], "User not registered");
        verifiedUsers[_walletAddress] = true;
        emit UserVerified(_walletAddress);
    }

    function isUserVerified(address _walletAddress) public view returns (bool) {
        require(registeredUsers[_walletAddress], "User not registered");
        return verifiedUsers[_walletAddress];
    }
}

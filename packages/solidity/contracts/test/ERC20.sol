// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedAvaxToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Wrapped Avalanche", "WAVAX") {
        _mint(msg.sender, initialSupply);
    }
}

contract LinkToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Chainlink", "LINK") {
        _mint(msg.sender, initialSupply);
    }
}

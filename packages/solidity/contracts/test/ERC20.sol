// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract LinkToken is ERC20 {
    constructor(uint256 initialSupply) ERC20('Chainlink', 'LINK') {
        _mint(msg.sender, initialSupply);
    }
}

contract WrappedBtcToken is ERC20 {
    constructor(uint256 initialSupply) ERC20('Wrapped Bitcoin', 'WBTC') {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}

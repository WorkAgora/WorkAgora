// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IReputationCard.sol";

interface IReputationCardHolder {
    function getReputationCard() external view returns (IReputationCard);
}

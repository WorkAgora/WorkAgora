// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ReputationCard.sol";
import "./IReputationCardHolder.sol";

contract ReputationCardHolder is IReputationCardHolder {
    IReputationCard private reputationCard;

    constructor() {
        reputationCard = new ReputationCard();
    }

    function getReputationCard() external view override returns (IReputationCard) {
        return reputationCard;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface private immutable _aggregator;

    constructor(AggregatorV3Interface feedAddress) {
        _aggregator = feedAddress;
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() external view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = _aggregator.latestRoundData();
        return price;
    }

    /**
     * Returns the price decimals
     */
    function decimals() external view returns (uint8) {
        return _aggregator.decimals();
    }
}

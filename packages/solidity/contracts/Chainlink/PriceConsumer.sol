// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface private immutable _aggregator;

    constructor(address feedAddress) {
        _aggregator = AggregatorV3Interface(feedAddress);
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

contract PriceConsumers {
    PriceConsumer public immutable _avaxUsdPriceConsumer;

    constructor(address _avaxUsdAggregator) {
        _avaxUsdPriceConsumer = new PriceConsumer(_avaxUsdAggregator);
    }
}

contract PriceConsumerAvaxUSD is PriceConsumer {

    /**
     * Network: Avax
     * Aggregator: MATIC/USD
     * Address (mainnet): 0x0A77230d17318075983913bC2145DB16C7366156
     * Address (testnet): 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
     * From: https://docs.chain.link/data-feeds/price-feeds/addresses?network=avalanche
     */
    constructor() PriceConsumer(0x5498BB86BC934c8D34FDA08E81D444153d0D06aD) { }
}

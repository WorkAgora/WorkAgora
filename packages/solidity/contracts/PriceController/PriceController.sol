//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './IPriceController.sol';
import '../Ownable/Ownable.sol';
import '../Chainlink/PriceConsumer.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * Network: Avax
 * From: https://docs.chain.link/data-feeds/price-feeds/addresses?network=avalanche
 *
 * Aggregator: AVAX/USD
 *      Address (mainnet): 0x0A77230d17318075983913bC2145DB16C7366156
 *      Address (testnet): 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
 * Aggregator: LINK/USD
 *      Address (mainnet): 0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a
 *      Address (testnet): 0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470
 * Aggregator: BTC/USD
 *      Address (mainnet): 0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743
 *      Address (testnet): 0x31CF013A08c6Ac228C94551d535d5BAfE19c602a
 *
 * Aggregator: USDT/USD
 *      Address (mainnet): 0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a
 *      Address (testnet): 0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad
 */

// Proxied
contract PriceController is IPriceController, Ownable {
    mapping(PaymentToken => TokenData) public tokens;

    function initialize(AggregatorV3Interface _avaxAggregator) external override {
        require(
            address(tokens[PaymentToken.Avax].priceConsumer) == address(0),
            'Already initialized'
        );
        tokens[PaymentToken.Avax] = TokenData(
            new PriceConsumer(_avaxAggregator),
            IERC20(address(0)) // Native asset, no token address
        );
    }

    function setToken(
        PaymentToken _token,
        AggregatorV3Interface _aggregator,
        IERC20 _tokenAddress
    ) external override onlyOwner {
        require(address(tokens[_token].priceConsumer) == address(0), 'Token data already set');

        tokens[_token] = TokenData(new PriceConsumer(_aggregator), _tokenAddress);
    }

    function isTokenSet(PaymentToken _token) external view override returns (bool) {
        return address(tokens[_token].priceConsumer) != address(0);
    }

    function getTokenData(PaymentToken _token) public view override returns (TokenData memory) {
        return tokens[_token];
    }

    function getTokenPriceFromUsd(
        PaymentToken _paymentToken,
        uint256 _amountUsd
    ) public view override returns (uint256, uint8) {
        TokenData memory data = getTokenData(_paymentToken);
        return (
            _amountUsd * uint256(data.priceConsumer.getLatestPrice()),
            data.priceConsumer.decimals()
        );
    }
}

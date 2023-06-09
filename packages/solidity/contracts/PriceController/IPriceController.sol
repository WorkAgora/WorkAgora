//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../Chainlink/PriceConsumer.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title IPriceController
 * @dev The IPriceController interface defines the functions for price controlling
 */
interface IPriceController {
    /**
     * @dev TokenData struct, storing the price consumer and token information.
     */
    struct TokenData {
        PriceConsumer priceConsumer;
        IERC20 token;
    }

    /**
     * @dev PaymentToken enum representing the supported tokens: Avax, Link, Wbtc, Usdt
     */
    enum PaymentToken {
        // Native
        Avax,
        // ERC20s
        Link,
        Wbtc,
        Usdt
        // Additional tokens can be supported in the future
    }

    /**
     * @dev Method for initializing the Price Controller with AVAX aggregator
     * @param _avaxAggregator The AggregatorV3Interface of the AVAX/USD price feed
     */
    function initialize(AggregatorV3Interface _avaxAggregator) external;

    /**
     * @dev Method for setting a new token with its respective aggregator and token address
     * @param _token The token to be set
     * @param _aggregator The AggregatorV3Interface of the token/USD price feed
     * @param _tokenAddress The IERC20 address of the token
     */
    function setToken(
        PaymentToken _token,
        AggregatorV3Interface _aggregator,
        IERC20 _tokenAddress
    ) external;

    /**
     * @dev Method for checking if a token is already set in the controller
     * @param _token The token to check
     * @return bool Returns true if the token is set, false otherwise
     */
    function isTokenSet(PaymentToken _token) external view returns (bool);

    /**
     * @dev Method for getting token data
     * @param _token The token to get data for
     * @return TokenData Returns the TokenData struct of the requested token
     */
    function getTokenData(PaymentToken _token) external view returns (TokenData memory);

    /**
     * @dev Method for getting the equivalent amount of a token for a specific USD amount
     * @param _paymentToken The token to get the equivalent amount for
     * @param _amountUsd The USD amount to get the equivalent token amount for
     * @return uint256 Returns the equivalent token amount
     * @return uint8 Returns the decimals of the price feed
     */
    function getTokenPriceFromUsd(
        PaymentToken _paymentToken,
        uint256 _amountUsd
    ) external view returns (uint256, uint8);
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../Chainlink/PriceConsumer.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

enum PaymentToken {
    // Native
    Avax,
    // ERC20s
    Link,
    Wbtc
    // Additional tokens can be supported in the future
}

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
 */
contract PriceController {
    struct TokenData {
        PriceConsumer priceConsumer;
        IERC20 token;
    }

    address public owner;
    mapping(PaymentToken => TokenData) public tokens;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }

    function initialize(AggregatorV3Interface _avaxAggregator) external {
        require(owner == address(0), 'Owner already set');
        owner = msg.sender;
        tokens[PaymentToken.Avax] = TokenData(
            new PriceConsumer(_avaxAggregator),
            IERC20(address(0)) // Native asset, no token address
        );
    }

    function setToken(
        PaymentToken _token,
        AggregatorV3Interface _aggregator,
        IERC20 _tokenAddress
    ) external onlyOwner {
        require(address(tokens[_token].priceConsumer) == address(0), 'Token data already set');

        tokens[_token] = TokenData(new PriceConsumer(_aggregator), _tokenAddress);
    }

    function isTokenSet(PaymentToken _token) external view returns (bool) {
        return address(tokens[_token].priceConsumer) != address(0);
    }

    function getTokenData(PaymentToken _token) public view returns (TokenData memory) {
        return tokens[_token];
    }

    function getTokenPriceFromUsd(
        PaymentToken _paymentToken,
        uint256 _amountUsd
    ) public view returns (uint256, uint8) {
        TokenData memory data = getTokenData(_paymentToken);
        return (
            _amountUsd * uint256(data.priceConsumer.getLatestPrice()),
            data.priceConsumer.decimals()
        );
    }
}

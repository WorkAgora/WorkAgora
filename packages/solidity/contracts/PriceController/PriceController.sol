//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '../Chainlink/PriceConsumer.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

enum PaymentToken {
    Avax,
    Link
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
contract PriceController is Ownable {
    struct TokenData {
        PriceConsumer priceConsumer;
        IERC20 tokenAddress;
    }

    mapping(PaymentToken => TokenData) public contracts;

    function setToken(
        PaymentToken _token,
        address _aggregator,
        address _tokenAddress
    ) external onlyOwner {
        require(address(contracts[_token].priceConsumer) == address(0), 'Token data already set');

        contracts[_token] = TokenData(new PriceConsumer(_aggregator), IERC20(_tokenAddress));
    }

    function isTokenSet(PaymentToken _token) external view returns (bool) {
        return address(contracts[_token].priceConsumer) != address(0);
    }

    function getTokenData(PaymentToken _token) public view returns (PriceConsumer, IERC20) {
        return (contracts[_token].priceConsumer, contracts[_token].tokenAddress);
    }

    function getTokenPriceFromUsd(
        PaymentToken _paymentToken,
        uint256 _amountUsd
    ) public view returns (uint256) {
        (PriceConsumer priceConsumer, ) = getTokenData(_paymentToken);
        return _amountUsd * uint256(priceConsumer.getLatestPrice());
    }
}

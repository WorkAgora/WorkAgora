# PriceController





Network: Avax From: https://docs.chain.link/data-feeds/price-feeds/addresses?network=avalanche Aggregator: AVAX/USD      Address (mainnet): 0x0A77230d17318075983913bC2145DB16C7366156      Address (testnet): 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD Aggregator: LINK/USD      Address (mainnet): 0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a      Address (testnet): 0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470



## Methods

### getTokenData

```solidity
function getTokenData(enum PaymentToken _token) external view returns (struct PriceController.TokenData)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum PaymentToken | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | PriceController.TokenData | undefined |

### getTokenPriceFromUsd

```solidity
function getTokenPriceFromUsd(enum PaymentToken _paymentToken, uint256 _amountUsd) external view returns (uint256, uint8)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _paymentToken | enum PaymentToken | undefined |
| _amountUsd | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |
| _1 | uint8 | undefined |

### initialize

```solidity
function initialize(contract AggregatorV3Interface _avaxAggregator) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _avaxAggregator | contract AggregatorV3Interface | undefined |

### isTokenSet

```solidity
function isTokenSet(enum PaymentToken _token) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum PaymentToken | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### setToken

```solidity
function setToken(enum PaymentToken _token, contract AggregatorV3Interface _aggregator, contract IERC20 _tokenAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum PaymentToken | undefined |
| _aggregator | contract AggregatorV3Interface | undefined |
| _tokenAddress | contract IERC20 | undefined |

### tokens

```solidity
function tokens(enum PaymentToken) external view returns (contract PriceConsumer priceConsumer, contract IERC20 token)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | enum PaymentToken | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| priceConsumer | contract PriceConsumer | undefined |
| token | contract IERC20 | undefined |





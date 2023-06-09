# IPriceController



> IPriceController



*The IPriceController interface defines the functions for price controlling*

## Methods

### getTokenData

```solidity
function getTokenData(enum IPriceController.PaymentToken _token) external view returns (struct IPriceController.TokenData)
```



*Method for getting token data*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum IPriceController.PaymentToken | The token to get data for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IPriceController.TokenData | TokenData Returns the TokenData struct of the requested token |

### getTokenPriceFromUsd

```solidity
function getTokenPriceFromUsd(enum IPriceController.PaymentToken _paymentToken, uint256 _amountUsd) external view returns (uint256, uint8)
```



*Method for getting the equivalent amount of a token for a specific USD amount*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _paymentToken | enum IPriceController.PaymentToken | The token to get the equivalent amount for |
| _amountUsd | uint256 | The USD amount to get the equivalent token amount for |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 Returns the equivalent token amount |
| _1 | uint8 | uint8 Returns the decimals of the price feed |

### initialize

```solidity
function initialize(contract AggregatorV3Interface _avaxAggregator) external nonpayable
```



*Method for initializing the Price Controller with AVAX aggregator*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _avaxAggregator | contract AggregatorV3Interface | The AggregatorV3Interface of the AVAX/USD price feed |

### isTokenSet

```solidity
function isTokenSet(enum IPriceController.PaymentToken _token) external view returns (bool)
```



*Method for checking if a token is already set in the controller*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum IPriceController.PaymentToken | The token to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool Returns true if the token is set, false otherwise |

### setToken

```solidity
function setToken(enum IPriceController.PaymentToken _token, contract AggregatorV3Interface _aggregator, contract IERC20 _tokenAddress) external nonpayable
```



*Method for setting a new token with its respective aggregator and token address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum IPriceController.PaymentToken | The token to be set |
| _aggregator | contract AggregatorV3Interface | The AggregatorV3Interface of the token/USD price feed |
| _tokenAddress | contract IERC20 | The IERC20 address of the token |





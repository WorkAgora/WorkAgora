# PriceController





Network: Avax From: https://docs.chain.link/data-feeds/price-feeds/addresses?network=avalanche Aggregator: AVAX/USD      Address (mainnet): 0x0A77230d17318075983913bC2145DB16C7366156      Address (testnet): 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD Aggregator: LINK/USD      Address (mainnet): 0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a      Address (testnet): 0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470



## Methods

### contracts

```solidity
function contracts(enum PaymentToken) external view returns (contract PriceConsumer priceConsumer, contract IERC20 tokenAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | enum PaymentToken | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| priceConsumer | contract PriceConsumer | undefined |
| tokenAddress | contract IERC20 | undefined |

### getTokenData

```solidity
function getTokenData(enum PaymentToken _token) external view returns (contract PriceConsumer, contract IERC20)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum PaymentToken | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract PriceConsumer | undefined |
| _1 | contract IERC20 | undefined |

### getTokenPriceFromUsd

```solidity
function getTokenPriceFromUsd(enum PaymentToken _paymentToken, uint256 _amountUsd) external view returns (uint256)
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



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setToken

```solidity
function setToken(enum PaymentToken _token, address _aggregator, address _tokenAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _token | enum PaymentToken | undefined |
| _aggregator | address | undefined |
| _tokenAddress | address | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |




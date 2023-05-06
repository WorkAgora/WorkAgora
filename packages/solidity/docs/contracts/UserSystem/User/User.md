# User









## Methods

### Contractors

```solidity
function Contractors(address) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### Employers

```solidity
function Employers(address) external view returns (address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### initialize

```solidity
function initialize(address _kycSystem) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _kycSystem | address | undefined |

### isUserVerified

```solidity
function isUserVerified(address _walletAddress) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _walletAddress | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### kycSystem

```solidity
function kycSystem() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### verifiedUsers

```solidity
function verifiedUsers(address) external view returns (string)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### verifyUser

```solidity
function verifyUser(address _address, string _kycId, bytes _signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _kycId | string | undefined |
| _signature | bytes | undefined |



## Events

### UserVerified

```solidity
event UserVerified(address indexed walletAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| walletAddress `indexed` | address | undefined |




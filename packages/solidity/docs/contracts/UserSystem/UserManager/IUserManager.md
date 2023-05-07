# IUserManager









## Methods

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
function isUserVerified(address _address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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
event UserVerified(address indexed _address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address `indexed` | address | undefined |




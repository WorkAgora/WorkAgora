# TestUserProfileV2









## Methods

### governance

```solidity
function governance() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### isUserRegistered

```solidity
function isUserRegistered(address _walletAddress) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _walletAddress | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

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

### registerUser

```solidity
function registerUser() external nonpayable
```






### registeredUsers

```solidity
function registeredUsers(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### verifiedUsers

```solidity
function verifiedUsers(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### verifyUser

```solidity
function verifyUser(address _walletAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _walletAddress | address | undefined |



## Events

### UserRegistered

```solidity
event UserRegistered(address indexed walletAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| walletAddress `indexed` | address | undefined |

### UserVerified

```solidity
event UserVerified(address indexed walletAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| walletAddress `indexed` | address | undefined |




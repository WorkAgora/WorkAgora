# Employer









## Methods

### contractIds

```solidity
function contractIds(uint256) external view returns (string)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### getReputation

```solidity
function getReputation(uint256 _userId) external view returns (int256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### initialize

```solidity
function initialize(contract JobContract _jobContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _jobContract | contract JobContract | undefined |

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### reputation

```solidity
function reputation(uint256) external view returns (int256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### setContract

```solidity
function setContract(uint256 _userId, string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | undefined |
| _contractId | string | undefined |

### setOwner

```solidity
function setOwner(address _owner) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | undefined |

### updateReputation

```solidity
function updateReputation(uint256 _userId, int256 _amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | undefined |
| _amount | int256 | undefined |





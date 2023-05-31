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

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateReputation

```solidity
function updateReputation(uint256 _userId, int256 _amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | undefined |
| _amount | int256 | undefined |



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




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



*Retrieves the reputation score of a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | The user ID |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | int256 The reputation score of the user |

### initialize

```solidity
function initialize(contract JobContract _jobContract) external nonpayable
```



*Initializes the contract with the job contract*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _jobContract | contract JobContract | The address of the job contract |

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



*Sets the contract ID for a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | The user ID |
| _contractId | string | The contract ID |

### setOwner

```solidity
function setOwner(address _owner) external nonpayable
```



*Method for setting the contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | The address of the new contract owner |

### updateReputation

```solidity
function updateReputation(uint256 _userId, int256 _amount) external nonpayable
```



*Updates the reputation score of a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | The user ID |
| _amount | int256 | The amount to add to the user&#39;s reputation score |





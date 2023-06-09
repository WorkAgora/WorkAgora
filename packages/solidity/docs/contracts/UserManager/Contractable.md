# Contractable









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





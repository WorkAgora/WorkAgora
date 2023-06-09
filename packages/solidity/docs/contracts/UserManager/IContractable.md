# IContractable



> IContractable



*The IContractable interface defines the functions for contract management*

## Methods

### initialize

```solidity
function initialize(contract JobContract _jobContract) external nonpayable
```



*Initializes the contract with the job contract*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _jobContract | contract JobContract | The address of the job contract |

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





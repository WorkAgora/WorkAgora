# IOwnable



> IOwnable



*Interface for an Ownable contract. This interface includes the method signatures required, and should be implemented by any contract which needs to manage contract ownership.*

## Methods

### owner

```solidity
function owner() external view returns (address)
```



*Method for retrieving the contract owner*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address Returns the address of the current contract owner |

### setOwner

```solidity
function setOwner(address _owner) external nonpayable
```



*Method for setting the contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | The address of the new contract owner |





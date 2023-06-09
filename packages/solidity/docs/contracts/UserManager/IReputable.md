# IReputable



> IReputable



*The IReputable interface defines the functions for reputation management*

## Methods

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





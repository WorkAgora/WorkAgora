# IReputationCard









## Methods

### addReview

```solidity
function addReview(uint8 _rating, string _message, contract JobContract _jobContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _rating | uint8 | undefined |
| _message | string | undefined |
| _jobContract | contract JobContract | undefined |

### getReputation

```solidity
function getReputation() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getReview

```solidity
function getReview(uint256 _index) external view returns (uint8 rating, bytes32 messageHash, contract JobContract jobContract)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| rating | uint8 | undefined |
| messageHash | bytes32 | undefined |
| jobContract | contract JobContract | undefined |

### getReviewsCount

```solidity
function getReviewsCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### updateReputation

```solidity
function updateReputation(int256 _amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | int256 | undefined |





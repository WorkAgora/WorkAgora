# IReputationCard









## Methods

### addReview

```solidity
function addReview(uint256 rating, string message, contract JobContract jobContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| rating | uint256 | undefined |
| message | string | undefined |
| jobContract | contract JobContract | undefined |

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
function getReview(uint256 index) external view returns (contract User reviewer, uint256 rating, bytes32 messageHash, contract JobContract jobContract)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| reviewer | contract User | undefined |
| rating | uint256 | undefined |
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





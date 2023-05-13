# ReputationCard









## Methods

### addReview

```solidity
function addReview(address _address, uint8 _rating, string _message, uint256 _jobContractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _rating | uint8 | undefined |
| _message | string | undefined |
| _jobContractId | uint256 | undefined |

### getReview

```solidity
function getReview(address _address, uint256 _index) external view returns (address reviewer, uint8 rating, bytes32 messageHash, uint256 jobContractId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _index | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| reviewer | address | undefined |
| rating | uint8 | undefined |
| messageHash | bytes32 | undefined |
| jobContractId | uint256 | undefined |

### getReviewsCount

```solidity
function getReviewsCount(address _address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### reputation

```solidity
function reputation(uint256) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### reviews

```solidity
function reviews(address, uint256) external view returns (address reviewer, uint8 rating, bytes32 messageHash, uint256 jobContractId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |
| _1 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| reviewer | address | undefined |
| rating | uint8 | undefined |
| messageHash | bytes32 | undefined |
| jobContractId | uint256 | undefined |

### updateReputation

```solidity
function updateReputation(uint256 _userId, int256 _amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _userId | uint256 | undefined |
| _amount | int256 | undefined |





# User









## Methods

### contractor

```solidity
function contractor() external view returns (contract Contractor)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Contractor | undefined |

### employer

```solidity
function employer() external view returns (contract Employer)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Employer | undefined |

### getReputation

```solidity
function getReputation(address _address, enum User.Role _role) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _role | enum User.Role | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### initialize

```solidity
function initialize(address _kycSystem, contract ReputationCard _reputationCard, contract Employer _employer, contract Contractor _contractor, contract JobContract _jobContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _kycSystem | address | undefined |
| _reputationCard | contract ReputationCard | undefined |
| _employer | contract Employer | undefined |
| _contractor | contract Contractor | undefined |
| _jobContract | contract JobContract | undefined |

### isUserVerified

```solidity
function isUserVerified(address _address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### jobContract

```solidity
function jobContract() external view returns (contract JobContract)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract JobContract | undefined |

### kycSystem

```solidity
function kycSystem() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### reputationCard

```solidity
function reputationCard() external view returns (contract ReputationCard)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ReputationCard | undefined |

### verifiedUsers

```solidity
function verifiedUsers(address) external view returns (string kycId, uint256 employerId, uint256 contractorId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| kycId | string | undefined |
| employerId | uint256 | undefined |
| contractorId | uint256 | undefined |

### verifyUser

```solidity
function verifyUser(address _address, string _kycId, bytes _signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _kycId | string | undefined |
| _signature | bytes | undefined |



## Events

### UserVerified

```solidity
event UserVerified(address indexed _address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address `indexed` | address | undefined |




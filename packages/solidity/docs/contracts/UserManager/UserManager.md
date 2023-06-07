# UserManager









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

### finalize

```solidity
function finalize(address _contractor, address _employer, uint128 reputation) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractor | address | undefined |
| _employer | address | undefined |
| reputation | uint128 | undefined |

### getContractorId

```solidity
function getContractorId(address _address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getEmployerId

```solidity
function getEmployerId(address _address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getReputation

```solidity
function getReputation(address _address, enum UserManager.Role _role) external view returns (int256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |
| _role | enum UserManager.Role | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### getTotalReputation

```solidity
function getTotalReputation(address _address) external view returns (int256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | undefined |

### hasNegativeReputation

```solidity
function hasNegativeReputation(address _address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### initialize

```solidity
function initialize(address _sigAuthority, contract Employer _employer, contract Contractor _contractor, contract JobContract _jobContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _sigAuthority | address | undefined |
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

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### setOwner

```solidity
function setOwner(address _owner) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | undefined |

### sigAuthority

```solidity
function sigAuthority() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

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




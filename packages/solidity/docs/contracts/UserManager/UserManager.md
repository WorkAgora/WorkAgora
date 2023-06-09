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



*Finalizes a job contract and updates reputations of contractor and employer*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractor | address | The address of the contractor |
| _employer | address | The address of the employer |
| reputation | uint128 | The reputation score to update |

### getContractorId

```solidity
function getContractorId(address _address) external view returns (uint256)
```



*Retrieves the contractor ID for a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 The contractor ID of the user |

### getEmployerId

```solidity
function getEmployerId(address _address) external view returns (uint256)
```



*Retrieves the employer ID for a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | uint256 The employer ID of the user |

### getReputation

```solidity
function getReputation(address _address, enum IUserManager.Role _role) external view returns (int256)
```



*Retrieves the reputation of a user based on their role*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user |
| _role | enum IUserManager.Role | The role of the user (employer/contractor) |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | int256 The reputation score of the user |

### getTotalReputation

```solidity
function getTotalReputation(address _address) external view returns (int256)
```



*Retrieves the total reputation of a user*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | int256 | int256 The total reputation score of the user |

### hasNegativeReputation

```solidity
function hasNegativeReputation(address _address) external view returns (bool)
```



*Checks if a user has a negative reputation*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool Whether the user has a negative reputation |

### initialize

```solidity
function initialize(address _sigAuthority, contract Employer _employer, contract Contractor _contractor, contract JobContract _jobContract) external nonpayable
```



*Initializes the user manager with necessary contracts and signature authority*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _sigAuthority | address | The address of the signature authority |
| _employer | contract Employer | The address of the employer contract |
| _contractor | contract Contractor | The address of the contractor contract |
| _jobContract | contract JobContract | The address of the job contract |

### isUserVerified

```solidity
function isUserVerified(address _address) external view returns (bool)
```



*Checks if a user is verified*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user to check |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool The verification status of the user |

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



*Method for setting the contract owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | The address of the new contract owner |

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



*Verifies a user by checking the provided signature*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _address | address | The address of the user to be verified |
| _kycId | string | The KYC id of the user |
| _signature | bytes | The signature provided by the user |





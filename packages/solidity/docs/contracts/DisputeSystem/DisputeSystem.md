# DisputeSystem









## Methods

### castVote

```solidity
function castVote(string _contractId, uint256 _contractorPct, uint256 _employerPct) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |
| _contractorPct | uint256 | undefined |
| _employerPct | uint256 | undefined |

### disputeExpiryTime

```solidity
function disputeExpiryTime() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### disputes

```solidity
function disputes(string) external view returns (bool ongoing, uint256 disputeExpiryTimestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| ongoing | bool | undefined |
| disputeExpiryTimestamp | uint256 | undefined |

### finalizeDispute

```solidity
function finalizeDispute(string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |

### initialize

```solidity
function initialize(contract JobContract _contract, contract UserManager _userManager, address[] _juryMembers, uint256 _minReputationToVote, uint256 _juryVotesCount, uint256 _userVotesCount, uint256 _disputeExpiryTime) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contract | contract JobContract | undefined |
| _userManager | contract UserManager | undefined |
| _juryMembers | address[] | undefined |
| _minReputationToVote | uint256 | undefined |
| _juryVotesCount | uint256 | undefined |
| _userVotesCount | uint256 | undefined |
| _disputeExpiryTime | uint256 | undefined |

### initiateDispute

```solidity
function initiateDispute(string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |

### jobContract

```solidity
function jobContract() external view returns (contract JobContract)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract JobContract | undefined |

### juryMembers

```solidity
function juryMembers(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### juryVotesCount

```solidity
function juryVotesCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### minReputationToVote

```solidity
function minReputationToVote() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### userManager

```solidity
function userManager() external view returns (contract UserManager)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract UserManager | undefined |

### userVotesCount

```solidity
function userVotesCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### DisputeCreated

```solidity
event DisputeCreated(string indexed contractId, uint256 disputeExpiryTimestamp)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| contractId `indexed` | string | undefined |
| disputeExpiryTimestamp  | uint256 | undefined |

### JuryMemberAdded

```solidity
event JuryMemberAdded(address indexed member)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| member `indexed` | address | undefined |

### Voted

```solidity
event Voted(address indexed voter, string indexed contractId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| voter `indexed` | address | undefined |
| contractId `indexed` | string | undefined |




# DisputeSystem









## Methods

### addJuryMember

```solidity
function addJuryMember(address member) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| member | address | undefined |

### contractInstance

```solidity
function contractInstance() external view returns (contract JobContract)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract JobContract | undefined |

### createDispute

```solidity
function createDispute(string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |

### disputes

```solidity
function disputes(string) external view returns (uint256 totalVotes, bool resolved)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| totalVotes | uint256 | undefined |
| resolved | bool | undefined |

### initialize

```solidity
function initialize(contract JobContract _contract, contract UserManager _userManager) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contract | contract JobContract | undefined |
| _userManager | contract UserManager | undefined |

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

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### userManager

```solidity
function userManager() external view returns (contract UserManager)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract UserManager | undefined |

### vote

```solidity
function vote(string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |



## Events

### DisputeCreated

```solidity
event DisputeCreated(string indexed contractId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| contractId `indexed` | string | undefined |

### JuryMemberAdded

```solidity
event JuryMemberAdded(address indexed member)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| member `indexed` | address | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Voted

```solidity
event Voted(address indexed voter, string indexed contractId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| voter `indexed` | address | undefined |
| contractId `indexed` | string | undefined |




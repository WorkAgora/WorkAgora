# JobContract









## Methods

### contracts

```solidity
function contracts(string) external view returns (string contractId, enum JobContract.State state, uint256 totalAmountUsd, enum PaymentToken paymentToken, uint256 durationDays, address contractorAddress, address employerAddress, string ipfsJmiHash)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| contractId | string | undefined |
| state | enum JobContract.State | undefined |
| totalAmountUsd | uint256 | undefined |
| paymentToken | enum PaymentToken | undefined |
| durationDays | uint256 | undefined |
| contractorAddress | address | undefined |
| employerAddress | address | undefined |
| ipfsJmiHash | string | undefined |

### create

```solidity
function create(JobContract.CreateParams _params, bytes _signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _params | JobContract.CreateParams | undefined |
| _signature | bytes | undefined |

### getContractPrice

```solidity
function getContractPrice(enum PaymentToken _paymentToken, uint256 _amountUsd) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _paymentToken | enum PaymentToken | undefined |
| _amountUsd | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### initialize

```solidity
function initialize(address _user, address _priceController) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | address | undefined |
| _priceController | address | undefined |

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



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |




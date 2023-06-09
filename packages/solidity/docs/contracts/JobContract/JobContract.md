# JobContract









## Methods

### contracts

```solidity
function contracts(string) external view returns (enum JobContract.State state, uint128 totalAmountUsd, uint256 totalAmountToken, uint8 lockedAmountPct, uint8 deferredAmountPct, enum PaymentToken paymentToken, uint256 endTimestamp, address contractorAddress, address employerAddress, string ipfsJmiHash, string ipfsJfiHash)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| state | enum JobContract.State | undefined |
| totalAmountUsd | uint128 | undefined |
| totalAmountToken | uint256 | undefined |
| lockedAmountPct | uint8 | undefined |
| deferredAmountPct | uint8 | undefined |
| paymentToken | enum PaymentToken | undefined |
| endTimestamp | uint256 | undefined |
| contractorAddress | address | undefined |
| employerAddress | address | undefined |
| ipfsJmiHash | string | undefined |
| ipfsJfiHash | string | undefined |

### create

```solidity
function create(JobContract.CreateParams _params, bytes _signature) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _params | JobContract.CreateParams | undefined |
| _signature | bytes | undefined |

### finalize

```solidity
function finalize(JobContract.FinalizationParams _params, bytes _signature) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _params | JobContract.FinalizationParams | undefined |
| _signature | bytes | undefined |

### finalizeDispute

```solidity
function finalizeDispute(string _contractId, uint256 contractorPct, uint256 employerPct) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |
| contractorPct | uint256 | undefined |
| employerPct | uint256 | undefined |

### getContract

```solidity
function getContract(string _contractId) external view returns (struct JobContract.Contract)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | JobContract.Contract | undefined |

### initialize

```solidity
function initialize(contract UserManager _user, contract PriceController _priceController, contract Employer _employer, contract Contractor _contractor, contract DisputeSystem _disputeSystem, uint8 _feePct) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | contract UserManager | undefined |
| _priceController | contract PriceController | undefined |
| _employer | contract Employer | undefined |
| _contractor | contract Contractor | undefined |
| _disputeSystem | contract DisputeSystem | undefined |
| _feePct | uint8 | undefined |

### initiateDispute

```solidity
function initiateDispute(string _contractId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | undefined |

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





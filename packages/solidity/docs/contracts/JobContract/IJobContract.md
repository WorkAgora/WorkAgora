# IJobContract



> IJobContract



*Interface for the JobContract contract. This interface includes the method signatures, and enums and structs required, and should be implemented by any contract which needs to manage jobs and related entities (like contracts, employers, contractors, etc.).*

## Methods

### create

```solidity
function create(IJobContract.CreateParams _params, bytes _signature) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _params | IJobContract.CreateParams | undefined |
| _signature | bytes | undefined |

### finalize

```solidity
function finalize(IJobContract.FinalizationParams _params, bytes _signature) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _params | IJobContract.FinalizationParams | undefined |
| _signature | bytes | undefined |

### finalizeDispute

```solidity
function finalizeDispute(string _contractId, uint256 contractorPct, uint256 employerPct) external nonpayable
```



*Finalize a dispute for a job contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | Contract ID to finalize the dispute for |
| contractorPct | uint256 | Percentage of the total contract amount to give to the contractor |
| employerPct | uint256 | Percentage of the total contract amount to give to the employer |

### getContract

```solidity
function getContract(string _contractId) external view returns (struct IJobContract.Contract)
```



*Get the details of a job contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | Contract ID to get the details of |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | IJobContract.Contract | Contract details |

### initialize

```solidity
function initialize(contract UserManager _user, contract PriceController _priceController, contract Employer _employer, contract Contractor _contractor, contract DisputeSystem _disputeSystem, uint8 _feePct) external nonpayable
```



*Initialize a job contract with various contracts and parameters.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | contract UserManager | Address of the UserManager contract |
| _priceController | contract PriceController | Address of the PriceController contract |
| _employer | contract Employer | Address of the Employer contract |
| _contractor | contract Contractor | Address of the Contractor contract |
| _disputeSystem | contract DisputeSystem | Address of the DisputeSystem contract |
| _feePct | uint8 | Fee percentage |

### initiateDispute

```solidity
function initiateDispute(string _contractId) external nonpayable
```



*Initiate a dispute for a job contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | string | Contract ID to initiate a dispute for |





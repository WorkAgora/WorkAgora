# JobContract









## Methods

### contracts

```solidity
function contracts(string) external view returns (string contractId, enum JobContract.State state, uint256 totalAmountUsd, uint256 durationDays, address contractorAddress, address employerAddress, string ipfsJmiHash)
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

### initialize

```solidity
function initialize(contract User _user) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | contract User | undefined |





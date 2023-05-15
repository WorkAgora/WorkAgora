# JobContract









## Methods

### contracts

```solidity
function contracts(uint256) external view returns (uint256 contractId, uint256 priceUsd, uint256 durationDays, uint256 creationExpiryTimestamp, address contractorAddress, address employerAddress, enum JobContract.State state, bytes ipfsJmiHash)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| contractId | uint256 | undefined |
| priceUsd | uint256 | undefined |
| durationDays | uint256 | undefined |
| creationExpiryTimestamp | uint256 | undefined |
| contractorAddress | address | undefined |
| employerAddress | address | undefined |
| state | enum JobContract.State | undefined |
| ipfsJmiHash | bytes | undefined |

### create

```solidity
function create(uint256 _contractId, uint256 _priceUsd, uint256 _durationDays, uint256 _creationExpiryTimestamp, address _contractorAddress, address _employerAddress, bytes _ipfsJmiHash, bytes _signature) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _contractId | uint256 | undefined |
| _priceUsd | uint256 | undefined |
| _durationDays | uint256 | undefined |
| _creationExpiryTimestamp | uint256 | undefined |
| _contractorAddress | address | undefined |
| _employerAddress | address | undefined |
| _ipfsJmiHash | bytes | undefined |
| _signature | bytes | undefined |

### initialize

```solidity
function initialize(contract User _user) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _user | contract User | undefined |





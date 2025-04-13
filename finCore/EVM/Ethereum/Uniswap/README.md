# erc-token

### Installation
```shell
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ curl -L https://foundry.paradigm.xyz | bash
```

### .env file creation
```shell
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/{infura_api_key}"
DEV_PRIV_KEY=0x337...
ETHERSCAN_API_KEY=etherscan_api_key
source .env
```

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Local Node

```shell
$ anvil
```

### Local Deploy

```shell
$ forge create ./src/Token.sol:Token --rpc-url http://localhost:8545 --private-key {key_from_anvil} --constructor-args 1000000000000000000000000 
```

### Sepolia Testnet Deploy

```shell
$ forge script script/Token.s.sol:TokenScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
```

# Blockchain listenner

## Requirements
- [Node 8+](https://nodejs.org/en/)
- [Yarn (optional)](https://yarnpkg.com/en/)

## Setup

```
git clone git@github.com:chris-tn/web3js-watcher.git
cd web3js-watcher
npm install
```

Fill .env from .env.example 

```
NODE_ENV=production

INFURA_URL=https://mainnet.infura.io/CUNjkZ8qg6WZHqeFNJyL
INFURA_WS_URL=wss://mainnet.infura.io/ws

ETH_BLOCK_TIME=30

TOKEN_CONTRACT_ADDRESS=0xb4e95c65c23cab8c4fcaf15e4936c392e6ab21bf

WALLET_FROM=
WALLET_TO=
AMOUNT=
FIREBASE_DB_URL=https://eth1-xxxx.firebaseio.com

BBO_ADDRESS=0x84f7c44b6fed1080f647e354d552595be2cc602f
FROM_BLOCK=6868100
```

## Running

Simply start the service.

```
npm start BBO Transfer
```

`BBO` is contract Name have config in ./abi/config
`Transfer` is event Name

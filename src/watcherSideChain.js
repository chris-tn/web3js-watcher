const Web3 = require('web3')
const contract_config = require('./config')

var actionSideChain = require('./sideChain/actionSideChain');

var db = {}

setDataBase = (dataBase) => {
  db = dataBase;
  actionSideChain.setDataBase(db);
}

writeEventListData = (col, datas) => {
  if(datas.length ==0)
    return
  for (var i = datas.length - 1; i >= 0; i--) {
    writeEventData(col, datas[i].txHash, datas[i]);
  }
}

writeEventData = (col, txHash, data) => {
  db.ref(col+ '/' + txHash).set(data);
}

updateMintTokenDone = (txHash)  => {
  console.log('update mintStage to 1');
  db.ref('BBWrap/DepositEther/' + txHash).update({
      mintStage : 2,
  });
}


getLatestBlock = (col, callback) => {
  return db.ref(col+ '/').orderByChild("blockNumber").limitToLast(1).once('value', function(snapshot){
      if(!snapshot.exists()){
        console.log('No data found! return default block number')
        return callback(process.env.FROM_BLOCK)
      }
      for(key in snapshot.val()){
        //console.log('LatestBlock of ' + col + ' is: '+ snapshot.val()[key].blockNumber)
        return callback(snapshot.val()[key].blockNumber)
      }
  })
}

watchEvent = (contractName, eventName, network) => {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NFURA_WS_URL_SIDECHAIN))
  if(!contract_config[network][contractName])
    return
  // Instantiate token contract object with JSON ABI and address

  const tokenContract = new web3.eth.Contract(
      contract_config.json[contractName].abi, contract_config[network][contractName].address,
    (error, result) => { if (error) console.log(error) }
  )
  let options = {
  }
  // Subscribe to Transfer events matching filter criteria
  tokenContract.events[eventName](options,function(error, event){ 
      if(error) {
        console.log('error', error);
      } else {
        //console.log(contractName + ' ' + eventName + ' at ' + new Date() + ' txHash -> line 61 ' + event.returnValues.txHash); 
      }
  })
  .on('data', function(event){
      
      console.log(contractName + ' ' + eventName + ' at ' + new Date() + ' ->  ' + event.transactionHash); 

      let data = event.returnValues;
      data.blockNumber = event.blockNumber;
      data.txHash = event.transactionHash;
      data.withdrawStage = 0;
      if(contractName == 'BBWrap' && eventName == 'DepositToken') {
            writeEventData(network + '/' + contractName + '/' + eventName, event.transactionHash, data);
            actionSideChain.mintToken('BBWrap/DepositToken');
      }
  })
  .on('changed', function(event){
      // remove event from local database
  })
  .on('error', console.error);
}


module.exports = {
  watchEvent,
  setDataBase,
}
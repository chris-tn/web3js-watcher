const Web3 = require('web3')
const contract_abi = require('./abi/config')

var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
var db = admin.database();

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

getLatestBlock = (col, callback) => {
  return db.ref(col+ '/').orderByChild("blockNumber").limitToLast(1).once('value', function(snapshot){
      if(!snapshot.exists()){
        console.log('No data found! return default block number')
        return callback(process.env.FROM_BLOCK)
      }
      for(key in snapshot.val()){
        console.log('LatestBlock of ' + col + ' is: '+ snapshot.val()[key].blockNumber)
        return callback(snapshot.val()[key].blockNumber)
      }
  })
}

watchEvent = (contractName, eventName) => {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))
  if(!contract_abi[contractName])
    return
  // Instantiate token contract object with JSON ABI and address

  const tokenContract = new web3.eth.Contract(
    contract_abi[contractName].abi,contract_abi[contractName].address,
    (error, result) => { if (error) console.log(error) }
  )
  let options = {
  }
  // Subscribe to Transfer events matching filter criteria
  tokenContract.events[eventName](options
    , function(error, event){ 
      console.log(event); 
  })
  .on('data', function(event){
      let data = event.returnValues
      data.blockNumber = event.blockNumber
      data.txHash = event.transactionHash
      writeEventData(contractName + '/' + eventName, event.transactionHash, data)
  })
  .on('changed', function(event){
      // remove event from local database
  })
  .on('error', console.error);
}
getPastEvents = (contractName, eventName) => {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))

  // Instantiate token contract object with JSON ABI and address

  if(!contract_abi[contractName])
    return
  //todo
  const tokenContract = new web3.eth.Contract(
    contract_abi[contractName].abi,contract_abi[contractName].address,
    (error, result) => { if (error) console.log(error) }
  )
  return getLatestBlock(contractName + '/' + eventName, function(blockNumber){
    if(!parseFloat(blockNumber)) return;
    // todo get latest block from firebase
    let options = {
      fromBlock: parseFloat(blockNumber)+1
    }
    return tokenContract.getPastEvents(eventName, options , function(error, events){ console.log(events); })
    .then(function(events){
        let datas = []
        for (var i = events.length - 1; i >= 0; i--) {
          let data = events[i].returnValues
         // console.log(data[0])
          data.blockNumber = events[i].blockNumber
          data.txHash = events[i].transactionHash
          datas.push(data)
        }
        return writeEventListData(contractName + '/' + eventName, datas);
    });
  })
  
}
module.exports = {
  watchEvent, 
  getPastEvents
}
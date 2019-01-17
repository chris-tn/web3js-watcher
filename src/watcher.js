const Web3 = require('web3')
const contract_abi = require('./abi/config')

var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
var db = admin.database();
var web3; 
var inter;
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

handleDisconnects = (e, contractName, eventName, network) => {
  console.log(" -- handleDisconnects -- ",);
  clearInterval(inter);
  initWeb3(contractName, eventName, network);
  //
  console.log('wait for connection connected')
  setTimeout(() => {
    getPastEvents(contractName, eventName, network)
    watchEvent(contractName, eventName, network)
  }, 5000);
}


initWeb3 =  (contractName, eventName, network) => {
  let eventProvider = new Web3.providers.WebsocketProvider(contract_abi['WS_URL'][network]);
  
  
  //listen for disconnects
  eventProvider.on('error', e => handleDisconnects('error',contractName, eventName, network));
  eventProvider.on('end', e => handleDisconnects(e,contractName, eventName, network))
  web3 = new Web3();
  web3.setProvider(eventProvider);

}
watchEvent = (contractName, eventName, network) => {
  if(!contract_abi[contractName])
    return
  if(!web3 || !web3.currentProvider){
    initWeb3(contractName, eventName, network);
  }
  inter = setInterval(()=> {
    
    console.log('ws connection state: ',web3.currentProvider.connection.readyState);
    if(web3.currentProvider.connection.readyState == 1){
      web3.eth.getBlockNumber().then(function(r){
        console.log('latestBlock: ',r);
      })
    }
    
  }, 1000);

 
  // Instantiate token contract object with JSON ABI and address

  const tokenContract = new web3.eth.Contract(
    contract_abi[contractName].abi,contract_abi[contractName][network],
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
      writeEventData(network+ '/'+contractName + '/' + eventName, event.transactionHash, data)
  })
  .on('changed', function(event){
      console.log('removed...')
      handleDisconnects(e,contractName, eventName, network)
  })
  .on('error', ()=>{
    handleDisconnects('error event',contractName, eventName, network)
  })

}
getPastEvents = (contractName, eventName, network) => {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.HttpProvider(contract_abi['HTTP_URL'][network]))

  // Instantiate token contract object with JSON ABI and address

  if(!contract_abi[contractName])
    return
  //todo
  const tokenContract = new web3.eth.Contract(
    contract_abi[contractName].abi,contract_abi[contractName][network],
    (error, result) => { if (error) console.log(error) }
  )
  return getLatestBlock(network+ '/'+ contractName + '/' + eventName, function(blockNumber){
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
        return writeEventListData(network+ '/'+ contractName + '/' + eventName, datas);
    });
  })
  
}
module.exports = {
  watchEvent, 
  getPastEvents
}
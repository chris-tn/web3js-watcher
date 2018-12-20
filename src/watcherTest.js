const Web3 = require('web3')
const contract_abi = require('./config')

const watcher = require('./watcher')



watchEvent = (contractName, eventName, address) => {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8545'))
  if(!contract_abi.json[contractName])
    return
  // Instantiate token contract object with JSON ABI and address

  const tokenContract = new web3.eth.Contract(
    contract_abi.json[contractName].abi, address,
    (error, result) => { if (error) console.log('oh',error) }
  )
  let options = {
  }
  // Subscribe to Transfer events matching filter criteria
  tokenContract.events[eventName](options
    , function(error, event){ 
      if(error) {
        console.log('error', error);
      } else {
        console.log(contractName + ' ' + eventName + ' at ' + new Date() + ' txHash -> ' + event.transactionHash); 
      }
  })
  .on('data', function(event){
      let data = event.returnValues
      data.blockNumber = event.blockNumber
      data.txHash = event.transactionHash
      watcher.writeEventData(contractName + '/' + eventName, event.transactionHash, data)
  })
  .on('changed', function(event){
      // remove event from local database
  })
  .on('error', console.error);
}


deployContract = async (abi, bytecode) => {
    const web3 =  new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    var accounts = await web3.eth.personal.getAccounts();
   
    const tokenContract = await new web3.eth.Contract(abi, {
        from : accounts[0]
    });

    return new Promise((resolve, reject) => {
      tokenContract.deploy({
        data : bytecode
        }).send({
            from: accounts[0],
        }).then(function(newContractInstance){
            resolve(newContractInstance.options);
        });
    })
}

getLatestBlockNumber = async (contractName , eventName) => {
  let col = contractName + '/' + eventName;
  return new Promise((resolve, reject) => {
    watcher.db.ref(col+ '/').orderByChild("blockNumber").limitToLast(1).once('value', function(snapshot){
      if(!snapshot.exists()){
        console.log('No data found! return default block number')
        reject('error');
      }
      let data;
      for(key in snapshot.val()){
         data = snapshot.val()[key]
      }
      resolve(data);
    })
  })
    
}

getDataOnNetWork = async (contractName, eventName, address ,blockNumber) => {
  return new Promise(  (resolve, reject) => {
    try {
      const web3 =  new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
      //todo
      const tokenContract = new web3.eth.Contract(
        contract_abi.json[contractName].abi,
        address
      );
  
      tokenContract.getPastEvents(eventName, 
        {fromBlock: blockNumber}, 
        function(error, events){
          if(error) {
            reject(reject);
          } else {
            resolve(events);
          } 
        })

    } catch(e) {
      console.log('error...',e);
      reject(e);
    }
   
  })
}


module.exports = {
  getLatestBlockNumber,
  getDataOnNetWork,
  deployContract,
  watchEvent
}
const Web3 = require('web3')
const contract_abi = require('../src/abi/config')

var admin = require("firebase-admin");
var serviceAccount = require("../src/keys/serviceAccountKey.json");

const FIREBASE_DB_URL = 'https://mrtoken-619a5.firebaseio.com'
const INFURA_URL = 'https://ropsten.infura.io/CUNjkZ8qg6WZHqeFNJyL'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DB_URL
});
var db = admin.database();


getLatestBlockNumber = async (contractName , eventName) => {
  let col = contractName + '/' + eventName;
  return new Promise((resolve, reject) => {
    db.ref(col+ '/').orderByChild("blockNumber").limitToLast(1).once('value', function(snapshot){
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

getDataOnNetWork = async (contractName, eventName, network, blockNumber) => {
  return new Promise(  (resolve, reject) => {
    try {
      const web3 =  new Web3(new Web3.providers.HttpProvider(INFURA_URL))
      //todo
      const tokenContract = new web3.eth.Contract(
        contract_abi[network][contractName].abi,
        contract_abi[network][contractName].address
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
  getDataOnNetWork
}
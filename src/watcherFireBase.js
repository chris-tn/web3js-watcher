const Web3 = require('web3')
const contract_abi = require('./abi/config')
require('./env');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");

var handleTx = require('./fireBaseWatcher/handleTx');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
var db = admin.database();
var web3;

var listData = [];
var isEmpty = false;
var isFirst = true;

handleMintToken = async (data, contractName, eventName, network, network2) => {

  let eventProvider = new Web3.providers.HttpProvider(contract_abi['HTTP_URL'][network2]);
  web3 = new Web3();
  web3.setProvider(eventProvider);

  let receiverAddress = data.sender;
  let value = data.value;
  let txHash = data.txHash;
  let abi = contract_abi[contractName].abi;
  let address = contract_abi[contractName][network2];
  if(data.mintStage && data.mintStage > 0) {
    return;
  }
  let col = network + '/' + contractName + '/' + eventName + '/';
  await handleTx.updateStatus(db, col, txHash, 1);
  let contractInstance = new web3.eth.Contract(abi, address,
    (error, result) => {
      if (error) console.log(error)
    })

  let query = contractInstance.methods.mintToken(receiverAddress, value, web3.utils.toHex('BBC'), txHash);
  let encodedABI = query.encodeABI();

  let privateKey = process.env.PRIVATEKEY_ADMIN_SIDECHAIN;
  let res =  await handleTx.signAndSendTx(web3, privateKey, address, encodedABI, 2000000, '10');
  if(res.code == 1) {
     await handleTx.updateStatus(db, col, txHash, 2);
  }
  
}



watchEvent = (contractName, eventName, network, network2) => {
  // handleTx.listenFirebaseDB(db, contractName, eventName, network, async function (data) {
  //   // if (data) {
      
  //   //   if(contractName == 'BBWrap' && (eventName == 'DepositEther' || eventName == 'MintToken'))  {
  //   //      handleMintTokenToSideChain(data, contractName, eventName, network, network2);
  //   //   }

  //   // } else {
  //   //   console.log('error listenFirebaseDB');
  //   // }
   

  // });

  let _data = {sender: '0x059b4ec27Eed17e314942F72aFf1d03CfBD4fba3', value: '1287750704458810000', txHash : '0x08edf45bcbf34f41f9c0a427c4f70596fa111091b4ec237f54e68d5548ad'};
  let tokenAddress = '0x00eEeEEEeEEeEEEeEeeeEeEEeeEeeeeEEEeEEbb0';
  console.log('doWithdrawal');
  doWithdrawal(_data,'BBWrap',tokenAddress, 'ropsten');
}

handleMintTokenToSideChain = async (data, contractName, eventName, network, network2) => {
    listData.push(data);
    if (isFirst) {
      isFirst = false;
      handeldSendTraction(contractName, eventName,network, network2);
    } else if (isEmpty) {
      isEmpty = false;
      handeldSendTraction(contractName, eventName,network, network2);
    }
}

handeldSendTraction = async (contractName, eventName,network, network2) => {
  while (!isEmpty) {

    if (listData.length > 0) {
      await handleMintToken(listData[0], contractName, eventName,network, network2);
      listData.shift();
    } else {
      console.log('Array empty I am waiting for you ');
      isEmpty = true;
    }
  }

}

doWithdrawal = async (data, contractName, tokenAddress, network) => {
    let eventProvider = new Web3.providers.HttpProvider(contract_abi['HTTP_URL'][network]);
    web3 = new Web3();
    web3.setProvider(eventProvider);

    let receiverAddress = data.sender;
    let value = data.value;
    let txHash = data.txHash;
    let abi = contract_abi[contractName].abi;
    let address = contract_abi[contractName][network];
    
    let contractInstance = new web3.eth.Contract(abi, address,
      (error, result) => {
        if (error) console.log(error)
      })

    let query = contractInstance.methods.doWithdrawal(receiverAddress, tokenAddress , value, txHash);
    let encodedABI = query.encodeABI();

    let privateKey = process.env.PRIVATEKEY_ADMIN_MAIN;
    let res =  await handleTx.signAndSendTx(web3, privateKey, address, encodedABI, 2000000, '10');
}

module.exports = {
  watchEvent
}
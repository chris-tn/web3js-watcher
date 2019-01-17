require('./env')
const contract_config = require('./config')
var handleTx = require('./handleTx');
var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_HTTP_URL_SIDECHAIN))


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DB_URL
  });
  
var db = admin.database();

let col = 'ropsten/BBWrap/DepositEther/';
let txID = '0xcad8ef8226d4bdb977ce5ad33d159c98c978f60e51e27a197a366699b3592440';
let status = 0;

handleTx.updateStatus(db, col, txID, status);

let contractName = 'BBWrap';
let eventName = 'DepositEther';
let network = 'ropsten';

handleTx.listenFirebaseDB(db, contractName, eventName, network, function(data) {
    console.log('New Data ', data);
});



let receiverAddress = '0x75A426f8136891afe4244347CE6931f5826E5Cc7';
let txHash = '0xcad8ef8226d4bdb977ce5ad33d159c98c978f60e50e27a197a366699b3592940';
let tokenKey = 'BBC';
let value = web3.utils.toWei('9','ether');
let privateKey = process.env.PRIVATEKEY_ADMIN_SIDECHAIN;

let wrapContractSideChain = new web3.eth.Contract(
    contract_config.json['BBWrap'].abi, process.env.CONTRACT_ADDRESS_SIDECHAIN,
    (error, result) => { if (error) console.log(error) })

let query =  wrapContractSideChain.methods.mintToken(receiverAddress, value, web3.utils.toHex(tokenKey), txHash);
let encodedABI = query.encodeABI();

handleTx.signAndSendTx(web3, privateKey, process.env.CONTRACT_ADDRESS_SIDECHAIN, encodedABI,2000000, '10');





const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("../src/keys/serviceAccountKey.json");

admin.initializeApp({
	 credential: admin.credential.cert(serviceAccount),
	 databaseURL:'https://mrtoken-619a5.firebaseio.com'
});

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(functions.config().bbwrap.rpcMain))

const contract_abi = 
[    {
      "constant": false,
      "inputs": [
        {
          "name": "receiverAddress",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "key",
          "type": "bytes"
        },
        {
          "name": "txHash",
          "type": "bytes"
        }
      ],
      "name": "mintToken",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
		}, 
		{
      "constant": false,
      "inputs": [
        {
          "name": "receiverAddress",
          "type": "address"
        },
        {
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "txHash",
          "type": "bytes"
        }
      ],
      "name": "doWithdrawal",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }]



		exports.doWithdrawal = functions.database.instance(functions.config().bbwrap.dbinstance).ref('/'+functions.config().bbwrap.dbnetwork+'/BBWrap/DepositEther/{tx}')
		.onCreate(async function(snapshot, prevChildKey){
				const data = snapshot.val();
				let contractInstance = new web3.eth.Contract(contract_abi, functions.config().bbwrap.addressMain, (error, result) => {if (error) console.log(error)});
			 let query = contractInstance.methods.doWithdrawal(data.sender,functions.config().bbwrap.etherAddress ,data.value, data.txHash).encodeABI();
 
				const senderAddress = functions.config().bbwrap.sender;
				const gas = functions.config().bbwrap.gas;
				const gasPrice = functions.config().bbwrap.gasprice;
				// get current nonce from db
				let nonce = await admin.database().ref('/'+functions.config().bbwrap.network+ '/nonce/'+ senderAddress ).once("value")
			 nonce = nonce.val()
			 if (!nonce){
				 // if doesnt exist nonce get latest from blockchain
				 nonce = await web3.eth.getTransactionCount(senderAddress);
			 }
			 nonce = parseInt(nonce)
			 await admin.database().ref('/'+functions.config().bbwrap.network+ '/nonce/'+ senderAddress ).transaction(function (current_value) {
						return (current_value || nonce) + 1;
				 });
			 
			 const privateKey = functions.config().bbwrap.pkey;
				let tx = {
					from: senderAddress,
					to: functions.config().bbwrap.addressMain,
					data: query,
					gas: gas,
					gasPrice : web3.utils.toWei(gasPrice,'gwei'),
					nonce: web3.utils.toHex(nonce)
				}
				let signed = await web3.eth.accounts.signTransaction(tx, privateKey);
				return web3.eth.sendSignedTransaction(signed.rawTransaction);
		})
    


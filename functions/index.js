const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(functions.config().bbwrap.rpc))
const contract_abi = [{
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
    }]


// privateKey functions.config().someservice.key
//functions.config().bbwrap.dbnetwork  -- network name to query from db ropsten
//functions.config().bbwrap.network  -- network name to call rinkeby
//functions.config().bbwrap.rpc  -- network rpc https://rinkeby.infura.io/....
//functions.config().bbwrap.address  -- contract address 0x0
//functions.config().bbwrap.pkey -- private key 0x0
//functions.config().bbwrap.sender -- sender address 0x0
//functions.config().bbwrap.gas -- 
//functions.config().bbwrap.gasprice
//functions.config().bbwrap.tokenname -- ETH
//functions.config().bbwrap.dbinstance -- 
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.mintTokenJob = functions.database.instance(functions.config().bbwrap.dbinstance).ref('/'+functions.config().bbwrap.dbnetwork+'/BBWrap/DepositEther/{tx}')
 	.onCreate(async function(snapshot, prevChildKey){
	 		const data = snapshot.val();
	 		let contractInstance = new web3.eth.Contract(contract_abi, functions.config().bbwrap.address, (error, result) => {if (error) console.log(error)});
			let query = contractInstance.methods.mintToken(data.sender, data.value, web3.utils.toHex(functions.config().bbwrap.tokenname), data.txHash).encodeABI();

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
	 			to: functions.config().bbwrap.address,
	 			data: query,
	 			gas: gas,
	 			gasPrice : web3.utils.toWei(gasPrice,'gwei'),
	 			nonce: web3.utils.toHex(nonce)
	 		}
	 		let signed = await web3.eth.accounts.signTransaction(tx, privateKey);
	 		return web3.eth.sendSignedTransaction(signed.rawTransaction);
 	})
    


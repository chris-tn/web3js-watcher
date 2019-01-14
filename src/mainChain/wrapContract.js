const Web3 = require('web3')
const contract_config = require('./config')


const INFURA_HTTP_URL = 'https://ropsten.infura.io/'

const privatekey = '0xe192c3eb953d2167e1ac6b61989cc03492e8f6d416c236efe1d3f571e58e453c';

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HTTP_URL))

const CONTRACT_ADDRESS = '0x989b371d7a936ed32bf2d92e6f5131171f8dbd0a';
const adminAdress = '0xAB8C9E08ec13B7c91210A68b08AFD382da99eaC1';


adminSetToken =  async  (tokenAddress, tokenKey) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi,contract_config['ropsten']['BBWrap'].address,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.setToken(tokenAddress,web3.utils.toHex(tokenKey));
    var encodedABI = query.encodeABI();
      
    var nonce = '0';
    web3.eth.getTransactionCount(adminAdress).then(_nonce => {
        nonce = _nonce.toString(16);
        console.log('nonce '+ nonce);
     
        var tx = {
            from: adminAdress,
            to: CONTRACT_ADDRESS,
            data: encodedABI,
            gas: 2000000,
            gasPrice : web3.utils.toWei('10','gwei'),
            nonce: '0x' + nonce,
        };
        web3.eth.accounts.signTransaction(tx, privatekey).then(signed => {
    
            web3.eth.sendSignedTransaction(signed.rawTransaction)
                  .on('confirmation', (confirmationNumber, receipt) => {
                        console.log('=> confirmation: : ' + confirmationNumber);
                  })
                  .on('transactionHash', hash => {
                        console.log('=> hash : ' + hash);
                  })
                  .on('receipt', receipt => {
                    console.log('=> reciept :');
                    console.log(receipt);
                    
                  })
                  .on('error oh: ', console.error);
              });
        });
        
}

addAdmin =  async  (privatekey, ownerAddress ,adminAddress) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi,contract_config['ropsten']['BBWrap'].address,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.addAdmin(adminAddress, true);
    var encodedABI = query.encodeABI();
      
    var nonce = '0';
    web3.eth.getTransactionCount(ownerAddress).then(_nonce => {
        nonce = _nonce.toString(16);
        console.log('nonce '+ nonce);
     
        var tx = {
            from: ownerAddress,
            to: CONTRACT_ADDRESS,
            data: encodedABI,
            gas: 2000000,
            gasPrice : web3.utils.toWei('10','gwei'),
            nonce: '0x' + nonce,
        };
        web3.eth.accounts.signTransaction(tx, privatekey).then(signed => {
    
            web3.eth.sendSignedTransaction(signed.rawTransaction)
                  .on('confirmation', (confirmationNumber, receipt) => {
                        console.log('=> confirmation: : ' + confirmationNumber);
                  })
                  .on('transactionHash', hash => {
                        console.log('=> hash : ' + hash);
                  })
                  .on('receipt', receipt => {
                    console.log('=> reciept :');
                    console.log(receipt);
                    
                  })
                  .on('error oh: ', console.error);
              });
            
        
        });
        
}


mintToken = async  (receiverAddress, tokenKey, value, txHash) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi,contract_config['ropsten']['BBWrap'].address,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.mintToken(receiverAddress, value, web3.utils.toHex(tokenKey), txHash);
    var encodedABI = query.encodeABI();
      
    var nonce = '0';

     return new Promise( function (resolve, reject) {

        web3.eth.getTransactionCount(adminAdress).then(_nonce => {
            nonce = _nonce.toString(16);
            console.log('nonce '+ nonce);
         
            var tx = {
                from: adminAdress,
                to: CONTRACT_ADDRESS,
                data: encodedABI,
                gas: 2000000,
                gasPrice : web3.utils.toWei('1','gwei'),
                nonce: '0x' + nonce,
            };
            web3.eth.accounts.signTransaction(tx, privatekey).then(signed => {
        
                web3.eth.sendSignedTransaction(signed.rawTransaction).then((receipt) =>{
                    resolve({code : 1, data : receipt ,msg : 'success'});
                 }, (error) =>{
                    resolve({code : -1, data : error ,msg : 'error'});
                  });
                      
                  });
                
            
            });
     });   

  
        
}

module.exports = {
    adminSetToken,
    addAdmin,
    mintToken
}
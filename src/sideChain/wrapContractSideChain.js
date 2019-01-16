const Web3 = require('web3')
const contract_config = require('../config')

require('../env');

 

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_HTTP_URL_SIDECHAIN))


adminSetToken =  async  (tokenAddress, tokenKey, gas, gasPrice) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi, process.env.CONTRACT_ADDRESS_SIDECHAIN,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.setToken(tokenAddress, web3.utils.toHex(tokenKey));
    var encodedABI = query.encodeABI();
      
    var nonce = '0';
    web3.eth.getTransactionCount(process.env.ADMIN_SIDECHAIN_ADDRRESS).then(_nonce => {
        nonce = _nonce.toString(16);
        console.log('nonce '+ nonce);
     
        var tx = {
            from: process.env.ADMIN_SIDECHAIN_ADDRRESS,
            to: process.env.CONTRACT_ADDRESS_SIDECHAIN,
            data: encodedABI,
            gas: gas,
            gasPrice : web3.utils.toWei(gasPrice,'gwei'),
            nonce: '0x' + nonce,
        };
        web3.eth.accounts.signTransaction(tx, process.env.PRIVATEKEY_ADMIN_SIDECHAIN).then(signed => {
    
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

addAdmin =  async  (privatekey, ownerAddress ,adminAddress, gas, gasPrice) => {
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
            to: process.env.CONTRACT_ADDRESS_SIDECHAIN,
            data: encodedABI,
            gas: gas,
            gasPrice : web3.utils.toWei(gasPrice,'gwei'),
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


mintToken = async  (receiverAddress, tokenKey, value, txHash, gas, gasPrice) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi, process.env.CONTRACT_ADDRESS_SIDECHAIN,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.mintToken(receiverAddress, value, web3.utils.toHex(tokenKey), txHash);
    var encodedABI = query.encodeABI();
      
    var nonce = '0';

     return new Promise( function (resolve, reject) {

        web3.eth.getTransactionCount(process.env.ADMIN_SIDECHAIN_ADDRRESS).then(_nonce => {
            nonce = _nonce.toString(16);
            console.log('nonce '+ nonce);
         
            var tx = {
                from: process.env.ADMIN_SIDECHAIN_ADDRRESS,
                to: process.env.CONTRACT_ADDRESS_SIDECHAIN,
                data: encodedABI,
                gas: gas,
                gasPrice : web3.utils.toWei(gasPrice,'gwei'),
                nonce: '0x' + nonce,
            };
            web3.eth.accounts.signTransaction(tx, process.env.PRIVATEKEY_ADMIN_SIDECHAIN).then(signed => {
        
                web3.eth.sendSignedTransaction(signed.rawTransaction).then((receipt) =>{
                    resolve({code : 1, data : receipt ,msg : 'success'});
                 }, (error) =>{
                    resolve({code : -1, data : error ,msg : 'error'});
                  });
                      
                  });
                
            
            });
     });   

  
        
}


approveToken = async  (privatekey, ownerAddress ,tokenAddress, contractAddress, gas, gasPrice, approveValue) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBOTest'].abi, tokenAddress,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.approve(contractAddress, approveValue);
    var encodedABI = query.encodeABI();
      
    var nonce = '0';

     return new Promise( function (resolve, reject) {

        web3.eth.getTransactionCount(ownerAddress).then(_nonce => {
            nonce = _nonce.toString(16);
            console.log('nonce '+ nonce);
         
            var tx = {
                from: ownerAddress,
                to: tokenAddress,
                data: encodedABI,
                gas: gas,
                gasPrice : web3.utils.toWei(gasPrice,'gwei'),
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


tokenTransferOwnership = async  (privatekey, ownerAddress ,tokenAddress, contractAddress, gas, gasPrice) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['TokenSideChain'].abi, tokenAddress,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.transferOwnership(contractAddress);
    var encodedABI = query.encodeABI();
      
    var nonce = '0';

     return new Promise( function (resolve, reject) {

        web3.eth.getTransactionCount(ownerAddress).then(_nonce => {
            nonce = _nonce.toString(16);
            console.log('nonce '+ nonce);
         
            var tx = {
                from: ownerAddress,
                to: tokenAddress,
                data: encodedABI,
                gas: gas,
                gasPrice : web3.utils.toWei(gasPrice,'gwei'),
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


depositToken = async  (privatekey, ownerAddress ,tokenAddress, amount , gas, gasPrice) => {
    let wrapContract = new web3.eth.Contract(
        contract_config.json['BBWrap'].abi, process.env.CONTRACT_ADDRESS_SIDECHAIN,
        (error, result) => { if (error) console.log(error) })
    
    var query = await wrapContract.methods.depositToken(tokenAddress, web3.utils.toWei(amount,'ether'));
    var encodedABI = query.encodeABI();
      
    var nonce = '0';

     return new Promise( function (resolve, reject) {

        web3.eth.getTransactionCount(ownerAddress).then(_nonce => {
            nonce = _nonce.toString(16);
            console.log('nonce '+ nonce);
         
            var tx = {
                from: ownerAddress,
                to: process.env.CONTRACT_ADDRESS_SIDECHAIN,
                data: encodedABI,
                gas: gas,
                gasPrice : web3.utils.toWei(gasPrice,'gwei'),
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
    mintToken,
    approveToken,
    tokenTransferOwnership
}
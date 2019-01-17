
require('./env');


listenFirebaseDB = (db, contractName, eventName, network, callback) => {
    let col = network + '/' + contractName + '/' + eventName + '/' ;
    console.log('listenFirebaseDB at : ',col);
    let ref = db.ref(col);
    ref.on("child_changed", function(snapshot) {
        callback (snapshot.val());
    });

}

updateStatus = (db ,col ,txID, status) => {
    db.ref(col + '/' + txID).update({
        status : status,
    });
}

signAndSendTx = (web3, privateKey, contractAddress, data, gas, gasPrice) => {

    let result  = web3.eth.accounts.privateKeyToAccount(privateKey);
    let senderAddress = result.address;
    
    let nonce = '0';
    web3.eth.getTransactionCount(senderAddress).then(_nonce => {
        nonce = _nonce.toString(16);
        console.log('nonce '+ nonce);
     
        let tx = {
            from: senderAddress,
            to: contractAddress,
            data: data,
            gas: gas,
            gasPrice : web3.utils.toWei(gasPrice,'gwei'),
            nonce: '0x' + nonce,
        };
        web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    
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

module.exports = {
    signAndSendTx,
    updateStatus,
    listenFirebaseDB
}

var first = true;

listenFirebaseDB =  (db, contractName, eventName, network, callback) => {
    let col = network + '/' + contractName + '/' + eventName + '/' ;
    console.log('listenFirebaseDB at : ',col);
    let ref = db.ref(col);
    ref.on("child_added", function(snapshot, prevChildKey) {
        callback (snapshot.val());
    });

}

updateStatus = async (db ,col ,txID, status) => {
    db.ref(col + '/' + txID).update({
        mintStage : status,
    });
}

signAndSendTx = async (web3, privateKey, contractAddress, data, gas, gasPrice) => {

    let result  = web3.eth.accounts.privateKeyToAccount(privateKey);
    let senderAddress = result.address;

    const nonce = ( await web3.eth.getTransactionCount(senderAddress)).toString(16);
    
       let tx = {
           from: senderAddress,
           to: contractAddress,
           data: data,
           gas: gas,
           gasPrice : web3.utils.toWei(gasPrice,'gwei'),
           nonce: '0x' + nonce,
       };
     let signed = await  web3.eth.accounts.signTransaction(tx, privateKey);

     return await new Promise((resolve, reject)=> {
            web3.eth.sendSignedTransaction(signed.rawTransaction)
            .on('confirmation',  (confirmationNumber, receipt) => {
                //console.log('=> confirmation: : ' + confirmationNumber);
            })
            .on('transactionHash',  hash => {
                console.log('=> hash : ' + hash);
            })
            .on('receipt',  receipt => {
            //console.log('=> reciept :');
            console.log('status: ', web3.utils.hexToNumberString(receipt.status));
            resolve({code : web3.utils.hexToNumberString(receipt.status)});
            })
            .on('error',  error => {
                console.log('error');
            });
     });

     
    
       
}

module.exports = {
    signAndSendTx,
    updateStatus,
    listenFirebaseDB
}
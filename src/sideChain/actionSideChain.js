

var wrapSideChain = require('./wrapContractSideChain');


var db = {};


getLatestBlockFireBase = (col, callback) => {
    return db.ref(col+ '/').orderByChild("blockNumber").limitToLast(1).once('value', function(snapshot){
        if(!snapshot.exists()){
          console.log('No data found! return default block number')
          return callback(process.env.FROM_BLOCK)
        }
        for(key in snapshot.val()){
            return callback(snapshot.val()[key])
        }    
    })
}

setDataBase = (database) => {
    db = database;
} 

updateMintTokenStatge = (col, txHash ,value)  => {
    console.log('update mintStage to ',value);
    db.ref(col + '/' + txHash).update({
        mintStage : value,
    });
}

setMintTokenHash = (col, txHash ,value)  => {
    db.ref(col + '/' + txHash).update({
        mintTokenHash : value,
    });
}

mintToken = (col, tokenKey) => {
    console.log('get Latest Block From ' + col);
    getLatestBlockFireBase(col, function(data) {
        console.log(data);
        if(data.mintStage == 0) {
            updateMintTokenStatge(col, data.txHash, 1);
            
            wrapSideChain.mintToken(data.sender, tokenKey, data.value, data.txHash, 2000000, '10').then(function(rs) {
                if(rs.code == 1) {
                    updateMintTokenStatge(col, data.txHash, 2);
                    setMintTokenHash(col, data.txHash, rs.data.transactionHash);
                    console.log('Mint token  ' + rs.msg + ' at txHash => ' + rs.data.transactionHash);
                } else {
                    console.log('Mint token error');
                }
            });
        } else {
            console.log('mintStage should be =  0');
        }
    });
}


module.exports = {
    mintToken,
    setDataBase
}
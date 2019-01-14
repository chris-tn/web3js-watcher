

var wrapSideChain = require('./wrapContractSideChain');

const CONTRACT_ADDRESS = '0xfe01e2c1ee0014c36a87d08f5951c8ea1a8e4b92';
const adminAdress = '0xAB8C9E08ec13B7c91210A68b08AFD382da99eaC1';


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

updateMintTokenStatge = (txHash, value)  => {
    console.log('update mintStage to 1');
    db.ref('BBWrap/DepositEther/' + txHash).update({
        mintStage : value,
    });
}

mintToken = (col) => {
    console.log('get Latest Block From ' + col);
    getLatestBlockFireBase(col, function(data) {
        console.log(data);
        updateMintTokenStatge(data.txHash, 1);
        wrapSideChain.mintToken(CONTRACT_ADDRESS, data.sender, 'BETH','9000000000000000000', data.txHash).then(function(rs) {
            if(rs.code == 1) {
                updateMintTokenStatge(data.txHash, 2);
                console.log('Mint token ' + rs.msg + ' at txHash => ' + rs.data.transactionHash);
            } else {
                console.log('Mint token error');
            }
        });
    });
}


module.exports = {
    mintToken,
    setDataBase
}
const Web3 = require('web3')
const contract_abi = require('./config')
const watcherTest = require('./watcherTest')
var fs = require('fs');


    start =  async () => {

    const web3 = await  new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    
    let BBOTest = contract_abi.json.BBOTest;
   
    let bbo = await watcherTest.deployContract(BBOTest.abi, BBOTest.bytecode);
    console.log('BBO address',bbo.address);


    var json = JSON.stringify({BBOTest : {address : bbo.address, events : ['Transfer']}});
    fs.writeFile('./test/contractAddress.json', json, 'utf8', function(err) {
        if(err) {
            console.log('err',err);
        } else {
            console.log('complete');
            process.exit(0);
        }
    });
    
}

start();


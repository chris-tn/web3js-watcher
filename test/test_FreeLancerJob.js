const assert = require('assert');
const Web3 = require('web3')
const contract_abi = require('../src/abi/config')
const watcherTest = require('./watcherTest')
const configContract = require('../src/abi/config')

contract('Unit Test', async function (accounts) {
    this.timeout(0);
    var network = 'ropsten';
    it('BBO Transfer', async () => {

        let result = await watcherTest.getLatestBlockNumber('BBO','Transfer');
        console.log(result._value);
        let data = await watcherTest.getDataOnNetWork('BBO','Transfer',network, result.blockNumber);

        for(let i = 0; i < data.length; i++) {
            console.log(data[i].blockNumber);
        }
        console.log(data[data.length - 1].returnValues._value);
        assert(data.length > 0);
    }); 

});
const assert = require('assert');
const Web3 = require('web3')
const contract_abi = require('../src/abi/config')
const watcher = require('../src/watcher')

describe('Unit Test', async function () {
    this.timeout(0);
    var network = 'ropsten';
    it('BBO Transfer', async () => {

        let blockNumber = await watcher.getLatestBlockNumber('BBO','Transfer');
        let data = await watcher.getDataOnNetWork('BBO','Transfer',network, blockNumber);
        
        assert(data.length > 0);
    }); 

});
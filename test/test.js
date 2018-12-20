const assert = require('assert');
const Web3 = require('web3')
const contract_abi = require('../src/config')
var fs = require('fs');
const watcherTest = require('../src/watcherTest')

var web3 = null;
var dataJson = null;
var accounts = [];


describe('Unit Test', async function () {
    this.timeout(0);
    it('Read File Json', async function() {
        web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        accounts = await web3.eth.personal.getAccounts();
    
        let content = await fs.readFileSync('./test/contractAddress.json');
        dataJson = JSON.parse(content);
        
        assert(dataJson != null);
    });

    it('BBOTest Transfer', async function () {

        const bboContract = await new web3.eth.Contract(contract_abi.json.BBOTest.abi, dataJson.BBOTest.address, {
            from: accounts[0],
            gasPrice: web3.utils.toWei('10', 'gwei'),
        });

        let bboBalance = await bboContract.methods.balanceOf(accounts[0]).call({
            from: accounts[0]
        });
        let number = Math.floor((Math.random() * 10) + 1);
        await bboContract.methods.transfer(accounts[1], web3.utils.toWei(number.toString(), 'ether')).send({
            from: accounts[0]
        });
        let bboBalance1 = await bboContract.methods.balanceOf(accounts[0]).call({
            from: accounts[0]
        });
        assert(bboBalance > bboBalance1);

        let data = await watcherTest.getLatestBlockNumber('BBOTest','Transfer');

        let result = await watcherTest.getDataOnNetWork('BBOTest','Transfer',dataJson.BBOTest.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.value, lastBlock.returnValues.value);
    });

    var jobHash = '';

    it('Job create', async function() {
        const jobContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerJob.abi, dataJson.JOB.address, {
            from: accounts[0]
        });
        jobHash = web3.utils.toHex('jobHash1');
        var expiredTime = parseInt(Date.now() / 1000) + 7 * 24 * 3600; // expired after 7 days
        var timeBid = 3 * 24 * 3600;
        await jobContract.methods.createJob(jobHash, expiredTime, timeBid, web3.utils.toWei('100', 'ether'), web3.utils.toHex('top')).send({from : accounts[0]});

        let data = await watcherTest.getLatestBlockNumber('BBFreelancerJob','JobCreated');

        let result = await watcherTest.getDataOnNetWork('BBFreelancerJob','JobCreated',dataJson.JOB.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

   

});
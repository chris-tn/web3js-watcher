const assert = require('assert');
const Web3 = require('web3')
const contract_abi = require('../src/config')
var fs = require('fs');
const watcherTest = require('../testHelper/watcherTest')

var web3 = null;
var dataJson = null;
var accounts = [];
var bboAddress = ''

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

    var jobHash1 = '';
    var jobHash2 = '';
    var jobHash3 = '';
    var jobID_0;
    var jobID_1;
    var jobID_2;

    it('Job create', async function() {
        const jobContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerJob.abi, dataJson.JOB.address, {
            from: accounts[0]
        });
        jobHash1 = web3.utils.toHex('jobHash1');
        jobHash2 = web3.utils.toHex('jobHash2');
        jobHash3 = web3.utils.toHex('jobHash3');

        var expiredTime = parseInt(Date.now() / 1000) + 7 * 24 * 3600; // expired after 7 days
        var timeBid = 3 * 24 * 3600;
        let l = await jobContract.methods.createJob(jobHash1, expiredTime, timeBid, web3.utils.toWei('100', 'ether'), web3.utils.toHex('top')).send({from : accounts[0]});
        jobID_0 =  l.events.JobCreated.returnValues.jobID;
        l = await jobContract.methods.createJob(jobHash2, expiredTime, timeBid, web3.utils.toWei('11', 'ether'), web3.utils.toHex('top')).send({from : accounts[0]});
        jobID_1 =  l.events.JobCreated.returnValues.jobID;

        l = await jobContract.methods.createJob(jobHash3, expiredTime, timeBid, web3.utils.toWei('11', 'ether'), web3.utils.toHex('top')).send({from : accounts[0]});
        jobID_2 =  l.events.JobCreated.returnValues.jobID;


        let data = await watcherTest.getLatestBlockNumber('BBFreelancerJob','JobCreated');

        let result = await watcherTest.getDataOnNetWork('BBFreelancerJob','JobCreated',dataJson.JOB.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Bid Create', async function() {
       
        const bidContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerBid.abi, dataJson.BID.address, {
            from: accounts[0]
        });
        let timeDone = 3 * 24 * 3600;
        let userID = 1777;
        await bidContract.methods.createBid(userID, jobID_0,  '999', timeDone).send({from : accounts[1]});
        await bidContract.methods.createBid(userID, jobID_1,  '888', timeDone).send({from : accounts[1]});
        await bidContract.methods.createBid(userID, jobID_2,  '888', timeDone).send({from : accounts[1]});

        let data = await watcherTest.getLatestBlockNumber('BBFreelancerBid','BidCreated');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerBid','BidCreated',dataJson.BID.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Bid acceptBid', async function() {
       
        const bidContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerBid.abi, dataJson.BID.address, {
            from: accounts[0]
        });
        
        await bidContract.methods.acceptBid(1777,jobID_0, accounts[1]).send({from : accounts[0]});
        await bidContract.methods.acceptBid(1777,jobID_1, accounts[1]).send({from : accounts[0]});
        await bidContract.methods.acceptBid(1777,jobID_2, accounts[1]).send({from : accounts[0]});
        let data = await watcherTest.getLatestBlockNumber('BBFreelancerBid','BidAccepted');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerBid','BidAccepted',dataJson.BID.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Bid cancelBid', async function() {
       
        const bidContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerBid.abi, dataJson.BID.address, {
            from: accounts[0]
        });
        
        await bidContract.methods.cancelBid(jobID_1).send({from : accounts[0]});
        await bidContract.methods.acceptBid(1777,jobID_0, accounts[1]).send({from : accounts[0]});
        
        let data = await watcherTest.getLatestBlockNumber('BBFreelancerBid','BidCanceled');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerBid','BidCanceled',dataJson.BID.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Job Cancel', async function() {
        const jobContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerJob.abi, dataJson.JOB.address, {
            from: accounts[0]
        });
        var expiredTime = parseInt(Date.now() / 1000) + 7 * 24 * 3600; // expired after 7 days
        var timeBid = 3 * 24 * 3600;
        let l = await jobContract.methods.createJob(jobHash3, expiredTime, timeBid, web3.utils.toWei('100', 'ether'), web3.utils.toHex('top')).send({from : accounts[0]});
        let jobID = l.events.JobCreated.returnValues.jobID;
        await jobContract.methods.cancelJob(jobID).send({from : accounts[0]});

        let data = await watcherTest.getLatestBlockNumber('BBFreelancerJob','JobCanceled');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerJob','JobCanceled',dataJson.JOB.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Job Start', async function() {
        const jobContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerJob.abi, dataJson.JOB.address, {
            from: accounts[0]
        });
       
        await jobContract.methods.startJob(jobID_0).send({from : accounts[1]});
        await jobContract.methods.startJob(jobID_2).send({from : accounts[1]});
        let data = await watcherTest.getLatestBlockNumber('BBFreelancerJob','JobStarted');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerJob','JobStarted',dataJson.JOB.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('Job Finish', async function() {
        const jobContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerJob.abi, dataJson.JOB.address, {
            from: accounts[0]
        });
       
        await jobContract.methods.finishJob(jobID_0).send({from : accounts[1]});
        await jobContract.methods.finishJob(jobID_2).send({from : accounts[1]});
        let data = await watcherTest.getLatestBlockNumber('BBFreelancerJob','JobFinished');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerJob','JobFinished',dataJson.JOB.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('acceptPayment', async function() {
        const paymentContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerPayment.abi, dataJson.PAYMENT.address, {
            from: accounts[0]
        });
        await paymentContract.methods.acceptPayment(jobID_0).send({from : accounts[0]});

        let data = await watcherTest.getLatestBlockNumber('BBFreelancerPayment','PaymentAccepted');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerPayment','PaymentAccepted',dataJson.PAYMENT.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('rejectPayment', async function() {
        const paymentContract = await new web3.eth.Contract(contract_abi.json.BBFreelancerPayment.abi, dataJson.PAYMENT.address, {
            from: accounts[0]
        });
        await paymentContract.methods.rejectPayment(jobID_2, 1).send({from : accounts[0]});

        let data = await watcherTest.getLatestBlockNumber('BBFreelancerPayment','PaymentRejected');
        let result = await watcherTest.getDataOnNetWork('BBFreelancerPayment','PaymentRejected',dataJson.PAYMENT.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);

    });

    it('rating', async function() { 
        const ratingContract = await new web3.eth.Contract(contract_abi.json.BBRating.abi, dataJson.RATING.address, {
            from: accounts[0]
        });
        
        await ratingContract.methods.rate(accounts[0], jobID_0 , 3 , web3.utils.toHex('ok')).send({from :accounts[1]});
        let data = await watcherTest.getLatestBlockNumber('BBRating','Rating');
        let result = await watcherTest.getDataOnNetWork('BBRating','Rating',dataJson.RATING.address, data.blockNumber);

        let lastBlock = result[result.length - 1];
        
        assert(data.jobID, lastBlock.returnValues.jobID);
    });

});
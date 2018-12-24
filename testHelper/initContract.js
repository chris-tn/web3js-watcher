const Web3 = require('web3')
const contract_abi = require('../src/config')
const watcherTest = require('./watcherTest')
var fs = require('fs');


    start =  async () => {

    const web3 = await  new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    var accounts = await web3.eth.personal.getAccounts();
    let BBOTest = contract_abi.json.BBOTest;
    let Storage = contract_abi.json.BBStorage;
    let Job = contract_abi.json.BBFreelancerJob;
    let Bid = contract_abi.json.BBFreelancerBid;
    let Rating = contract_abi.json.BBRating;
    let ProxyFactory = contract_abi.json.ProxyFactory;
    let Payment = contract_abi.json.BBFreelancerPayment;
    let Params = contract_abi.json.BBParams;    
    let Dispute = contract_abi.json.BBDispute;    
    let Voting = contract_abi.json.BBVoting;    
    let VotingHelper = contract_abi.json.BBVotingHelper;    

    
    let bbo = await watcherTest.deployContract(BBOTest.abi, BBOTest.bytecode);
    console.log('BBO address',bbo.address);
    
    let storage = await watcherTest.deployContract(Storage.abi, Storage.bytecode);
    console.log('Storege address', storage.address);

    let jobInstance = await watcherTest.deployContract(Job.abi, Job.bytecode);
    console.log('jobInstance address', jobInstance.address);
    
    let bidInstance = await watcherTest.deployContract(Bid.abi, Bid.bytecode);
    console.log('bidInstance address', bidInstance.address);

    let ratingInstance = await watcherTest.deployContract(Rating.abi, Rating.bytecode);
    console.log('ratingInstance address', ratingInstance.address);

    let paymentInstance = await watcherTest.deployContract(Payment.abi, Payment.bytecode);
    console.log('ratingInstance address', ratingInstance.address);

    let paramsInstance = await watcherTest.deployContract(Params.abi, Params.bytecode);
    console.log('paramsInstance address', paramsInstance.address);

    let disputeInstance = await watcherTest.deployContract(Dispute.abi, Dispute.bytecode);
    console.log('disputeInstance address', disputeInstance.address);

    let votingHelperInstance = await watcherTest.deployContract(VotingHelper.abi, VotingHelper.bytecode);
    console.log('votingHelperInstance address', votingHelperInstance.address);

    let votingInstance = await watcherTest.deployContract(Voting.abi, Voting.bytecode);
    console.log('votingInstance address', votingInstance.address);

    
    let proxyFact = await watcherTest.deployContract(ProxyFactory.abi, ProxyFactory.bytecode);
    console.log('proxyFact address', proxyFact.address);

    const proxyFactContract = await new web3.eth.Contract(ProxyFactory.abi, proxyFact.address, {from: accounts[0]});

    let l =  await proxyFactContract.methods.createProxy(accounts[8], jobInstance.address).send({from: accounts[0]});
    let  proxyAddressJob =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressJob', proxyAddressJob);

    l =  await proxyFactContract.methods.createProxy(accounts[8], bidInstance.address).send({from: accounts[0]});
    let  proxyAddressBid =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressBid', proxyAddressBid);

    l =  await proxyFactContract.methods.createProxy(accounts[8], ratingInstance.address).send({from: accounts[0]});
    let  proxyAddressRating=  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressRating', proxyAddressRating);

    l =  await proxyFactContract.methods.createProxy(accounts[8], paymentInstance.address).send({from: accounts[0]});
    let  proxyAddressPayment=  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressPayment', proxyAddressPayment);

    l =  await proxyFactContract.methods.createProxy(accounts[8], paramsInstance.address).send({from: accounts[0]});
    let  proxyAddressParams =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressParams', proxyAddressParams);

    l =  await proxyFactContract.methods.createProxy(accounts[8], disputeInstance.address).send({from: accounts[0]});
    let  proxyAddressDispute =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressDispute', proxyAddressDispute);

    l =  await proxyFactContract.methods.createProxy(accounts[8], votingHelperInstance.address).send({from: accounts[0]});
    let  proxyAddressVotingHepler =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressVotingHepler', proxyAddressVotingHepler);

    l =  await proxyFactContract.methods.createProxy(accounts[8], votingInstance.address).send({from: accounts[0]});
    let  proxyAddressVoting =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressVoting', proxyAddressVoting);

    const storageContract = await new web3.eth.Contract(Storage.abi, storage.address, {
        from: accounts[0]
    });

    await storageContract.methods.addAdmin(proxyAddressJob, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressBid, true).send({from: accounts[0]});    
    await storageContract.methods.addAdmin(proxyAddressRating, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressPayment, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressParams, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressDispute, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressVotingHepler, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressVoting, true).send({from: accounts[0]});


    const paymentContract = await new web3.eth.Contract(Payment.abi, proxyAddressPayment, {
        from: accounts[0]
    });
    await paymentContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await paymentContract.methods.setStorage(storage.address).send({from: accounts[0]});
    
    const jobContract = await new web3.eth.Contract(Job.abi, proxyAddressJob, {
        from: accounts[0]
    });
    await jobContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await jobContract.methods.setStorage(storage.address).send({from: accounts[0]});

    const bidContract = await new web3.eth.Contract(Bid.abi, proxyAddressBid, {
        from: accounts[0]
    });
    await bidContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await bidContract.methods.setStorage(storage.address).send({from: accounts[0]});

    const ratingContract = await new web3.eth.Contract(Rating.abi, proxyAddressRating, {
        from: accounts[0]
    });
    await ratingContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await ratingContract.methods.setStorage(storage.address).send({from: accounts[0]});

    const votingHelperContract = await new web3.eth.Contract(VotingHelper.abi, proxyAddressVotingHepler, {
        from: accounts[0]
    });
    await votingHelperContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await votingHelperContract.methods.setStorage(storage.address).send({from: accounts[0]});

    const votingContract = await new web3.eth.Contract(Voting.abi, proxyAddressVoting, {
        from: accounts[0]
    });
    await votingContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await votingContract.methods.setStorage(storage.address).send({from: accounts[0]});
    await votingContract.methods.setHelper(proxyAddressVotingHepler).send({from: accounts[0]});

    const disputeContract = await new web3.eth.Contract(Dispute.abi, proxyAddressDispute, {
        from: accounts[0]
    });
    await disputeContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await disputeContract.methods.setStorage(storage.address).send({from: accounts[0]});
    await disputeContract.methods.setVoting(proxyAddressVoting).send({from: accounts[0]});
    await disputeContract.methods.setVotingHelper(proxyAddressVotingHepler).send({from: accounts[0]});


    const paramsContract = await new web3.eth.Contract(Params.abi, proxyAddressParams, {
        from: accounts[0]
    });
    await paramsContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await paramsContract.methods.setStorage(storage.address).send({from: accounts[0]});
    await paramsContract.methods.addAdmin(accounts[0], true).send({from: accounts[0]});
    await paramsContract.methods.setVotingParams(100, 1000, 3000, 24 * 60 * 60, 24 * 60 * 60,
        24 * 60 * 60, 100).send({from: accounts[0]});
   
    

    let obj = new Object();
    obj.BBOTest = {address : bbo.address, events : ['Transfer']};
    obj.JOB = {address : proxyAddressJob, events : ['JobCreated','JobCanceled','JobStarted','JobFinished']};
    obj.BID = {address : proxyAddressBid, events : ['BidCreated','BidCanceled','BidAccepted']};
    obj.RATING = {address : proxyAddressRating, events : ['Rating']};
    obj.PAYMENT = {address : proxyAddressPayment, events : ['PaymentClaimed','PaymentAccepted','PaymentRejected','DisputeFinalized','DepositMoney']};
    obj.DISPUTE = {address : proxyAddressDispute, events : ['DisputeFinalized','DisputeStarted','DisputeAgainsted','DisputeUpdated']};
    obj.VOTING = {address : proxyAddressVoting, events : ['PollStarted','PollUpdated','PollOptionAdded','VotingRightsGranted','VotingRightsWithdrawn','VoteCommitted','VoteRevealed']};
    


    var json = JSON.stringify(obj);
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


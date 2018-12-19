const Web3 = require('web3')
const contract_abi = require('./config')
const watcherTest = require('./watcherTest')
var fs = require('fs');


    start =  async () => {

    const web3 = await  new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    var accounts = await web3.eth.personal.getAccounts();
    let BBOTest = contract_abi.json.BBOTest;
    let Storage = contract_abi.json.BBStorage;
    let Job = contract_abi.json.BBFreelancerJob;
    let Bid = contract_abi.json.BBFreelancerBid;
    let ProxyFactory = contract_abi.json.ProxyFactory;    
    
    let bbo = await watcherTest.deployContract(BBOTest.abi, BBOTest.bytecode);
    console.log('BBO address',bbo.address);
    
    let storage = await watcherTest.deployContract(Storage.abi, Storage.bytecode);
    console.log('Storege address', storage.address);

    let jobInstance = await watcherTest.deployContract(Job.abi, Job.bytecode);
    console.log('jobInstance address', jobInstance.address);
    
    let bidInstance = await watcherTest.deployContract(Bid.abi, Bid.bytecode);
    console.log('bidInstance address', bidInstance.address);
    
    let proxyFact = await watcherTest.deployContract(ProxyFactory.abi, ProxyFactory.bytecode);
    console.log('proxyFact address', proxyFact.address);

    const proxyFactContract = await new web3.eth.Contract(ProxyFactory.abi, proxyFact.address, {
        from: accounts[0]
        });

    let l =  await proxyFactContract.methods.createProxy(accounts[8], jobInstance.address).send({from: accounts[0]});
    let  proxyAddressJob =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressJob', proxyAddressJob);

    l =  await proxyFactContract.methods.createProxy(accounts[8], bidInstance.address).send({from: accounts[0]});
    let  proxyAddressBid =  l.events.ProxyCreated.returnValues.proxy
    console.log('proxyAddressBid', proxyAddressBid);

    const storageContract = await new web3.eth.Contract(Storage.abi, storage.address, {
        from: accounts[0]
        });

    await storageContract.methods.addAdmin(proxyAddressJob, true).send({from: accounts[0]});
    await storageContract.methods.addAdmin(proxyAddressBid, true).send({from: accounts[0]});    
    
    
    const jobContract = await new web3.eth.Contract(Job.abi, proxyAddressJob, {
        from: accounts[0]
    });
    await jobContract.methods.transferOwnership(accounts[0]).send({from: accounts[0]});
    await jobContract.methods.setStorage(storage.address).send({from: accounts[0]});

    let obj = new Object();
    obj.BBOTest = {address : bbo.address, events : ['Transfer']};
    obj.JOB = {address : proxyAddressJob, events : ['JobCreated','JobCanceled','JobStarted','JobFinished']};
    obj.BID = {address : proxyAddressBid, events : ['BidCreated','BidCanceled','BidAccepted']};

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


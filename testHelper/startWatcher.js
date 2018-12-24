
var fs = require('fs');

const watcherTest = require('./watcherTest')



start = async () => {

    fs.readFile('./test/contractAddress.json',function(err,content){
        if(err) throw err;
        let result = JSON.parse(content);
        //Watch BBOTest
        if(result.BBOTest) {
            let obj = result.BBOTest;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBOTest')
                watcherTest.watchEvent('BBOTest', obj.events[i], obj.address);

            }
        } 
        if(result.JOB) {
            let obj = result.JOB;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBFreelancerJob')
                watcherTest.watchEvent('BBFreelancerJob', obj.events[i], obj.address);

            }
        }

        if(result.BID) {
            let obj = result.BID;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBFreelancerBid')
                watcherTest.watchEvent('BBFreelancerBid', obj.events[i], obj.address);

            }
        }

        if(result.RATING) {
            let obj = result.RATING;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBRating')
                watcherTest.watchEvent('BBRating', obj.events[i], obj.address);

            }
        }

        if(result.PAYMENT) {
            let obj = result.PAYMENT;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBFreelancerPayment')
                watcherTest.watchEvent('BBFreelancerPayment', obj.events[i], obj.address);

            }
        }

        if(result.DISPUTE) {
            let obj = result.DISPUTE;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBDispute')
                watcherTest.watchEvent('BBDispute', obj.events[i], obj.address);

            }
        }

        if(result.VOTING) {
            let obj = result.VOTING;
            for(let i = 0; i < obj.events.length; i++) {
                console.log('Starting watching eventName ' + obj.events[i] + ' from BBVoting')
                watcherTest.watchEvent('BBVoting', obj.events[i], obj.address);

            }
        }

        

    });
}

start();


    


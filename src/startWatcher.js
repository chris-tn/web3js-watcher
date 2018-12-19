
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

    });
}

start();


    


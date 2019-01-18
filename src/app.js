require('./env')

const watcherFireBase = require('./watcherFireBase');

console.log(process.argv)
var contractName, eventName;

if(process.argv[2]){
	contractName = process.argv[2]
}
if(process.argv[3]){
	eventName = process.argv[3]
}
if(process.argv[4]){
	network = process.argv[4]
}

if(process.argv[5]){
	network2 = process.argv[5]
}

console.log('Watching from FireBase...');

watcherFireBase.watchEvent(contractName, eventName, network, network2);
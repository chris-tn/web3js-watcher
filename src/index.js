require('./env')

const watcher = require('./watcher')



var contractName, eventName, network;

if(process.argv[2]){
	contractName = process.argv[2]
} else {
	console.log('not enough parameter');
	process.exit(1);
}
if(process.argv[3]){
	eventName = process.argv[3]
} else {
	console.log('not enough parameter');
	process.exit(1);
}

if(process.argv[4]){
	network = process.argv[4]
} else {
	console.log('not enough parameter');
	process.exit(1);
}

console.log('Starting watching eventName ' + eventName + ' from '+ contractName + ' at network '  + network)
watcher.watchEvent(contractName, eventName, network)
//watcher.getPastEvents(contractName, eventName, network)
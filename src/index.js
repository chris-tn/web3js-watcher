require('./env')

const watcher = require('./watcher')

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
console.log('Starting watching eventName ' + eventName + ' from '+ contractName + ' on network '+ network)
watcher.watchEvent(contractName, eventName, network)
watcher.getPastEvents(contractName, eventName, network)
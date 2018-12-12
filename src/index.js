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
console.log('Starting watching eventName ' + eventName + ' from '+ contractName)
watcher.watchEvent(contractName, eventName)
watcher.getPastEvents(contractName, eventName)
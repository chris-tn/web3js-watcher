require('./env')

var admin = require("firebase-admin");
var serviceAccount = require("./keys/serviceAccountKey.json");

const FIREBASE_DB_URL = 'https://mrtoken-619a5.firebaseio.com'

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: FIREBASE_DB_URL
  });
  
var db = admin.database();

const watcher = require('./watcher')

const watcherSideChain = require('./watcherSideChain') 

watcher.setDataBase(db);
watcherSideChain.setDataBase(db);


var contractName, eventName, network;

if(process.argv[2]){
	contractName = process.argv[2]
} else {
	console.log('not enough parameter');
	process.exit(0);
}
if(process.argv[3]){
	eventName = process.argv[3]
} else {
	console.log('not enough parameter');
	process.exit(0);
}

if(process.argv[4]){
	network = process.argv[4]
} else {
	console.log('not enough parameter');
	process.exit(0);
}

console.log('Starting watching eventName ' + eventName + ' from '+ contractName + ' at network '  + network)
if(network == 'rinkeby') {
	console.log(' watchEvent in side-chain');
	watcherSideChain.watchEvent(contractName, eventName, network)

} else {
	watcher.watchEvent(contractName, eventName, network)
}
//watcher.getPastEvents(contractName, eventName, network)
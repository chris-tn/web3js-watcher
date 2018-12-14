require('./env')

const watcher = require('./watcher')
const config = require('./abi/config.js')



//Watch Job
let job = config.BBFreelancerJob;
for(let i = 0; i < job.events.length; i++) {
	console.log('Begin watch event : ' + job.events[i] + ' from ' + job.name );
	watcher.watchEvent(job.name, job.events[i])
}

//Watch Bid
let bid = config.BBFreelancerBid;
for(let i = 0; i < bid.events.length; i++) {
	console.log('Begin watch event : ' + bid.events[i] + ' from ' + bid.name );
	watcher.watchEvent(bid.name, bid.events[i])
}


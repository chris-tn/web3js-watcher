const bbo_abi = require('./bbo')
const BBFreelancerJob_abi = require('./BBFreelancerJob')
const BBFreelancerBid_abi = require('./BBFreelancerBid')

module.exports =  {
	
	BBFreelancerJob : {
		name : 'BBFreelancerJob',
		abi : BBFreelancerJob_abi,
		address : '0xb1e878028d0e3e47c803cbb9d1684d9d3d72a1b1',
		events: ['JobCreated','JobCanceled','JobStarted']
	},
	BBFreelancerBid : {
		name : 'BBFreelancerBid',
		abi : BBFreelancerBid_abi,
		address : '0x7b388ecfec2f5f706aa34b540a39e8c434cfc8b4',
		events :['BidCreated','BidCanceled','BidAccepted']
	}
}
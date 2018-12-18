const BBO_abi = require('./bbo')
const BBFreelancerJob_abi = require('./BBFreelancerJob')
const BBFreelancerBid_abi = require('./BBFreelancerBid')
const BBFreelancerPayment_abi = require('./BBFreelancerPayment')
const BBRating_abi = require('./BBRating')
const BBVotingHelper_abi = require('./BBVotingHelper')
const BBVoting_abi = require('./BBVoting')
const BBDispute_abi = require('./BBDispute')
const BBParams_abi = require('./BBParams')



module.exports =  {
	ropsten :  {
		BBO : {
			abi : BBO_abi,
			address : '0x1d893910d30edc1281d97aecfe10aefeabe0c41b'
		},
		BBFreelancerJob : {
			abi : BBFreelancerJob_abi,
			address : '0xb1e878028d0e3e47c803cbb9d1684d9d3d72a1b1'
		},
		BBFreelancerBid : {
			abi : BBFreelancerBid_abi,
			address : '0x7b388ecfec2f5f706aa34b540a39e8c434cfc8b4'
		},
		BBFreelancerPayment : {
			abi : BBFreelancerPayment_abi,
			address : '0x253f112b946a72a008343d5bccd14e04288ca45c'
		},
		BBRating: {
            address: '0xb7786dd5e27926c9753e00dc582d1e707b147ceb',
            abi: BBRating_abi,
        },
        BBVotingHelper: {
            address: '0x771911025b4eafb6395042b7dca728b275e5d8c0',
            abi: BBVotingHelper_abi,
        },
        BBDispute: {
            address: '0x2b44a5589e8b3cd106a7542d4af9c5eb0016ef6e',
            abi: BBDispute_abi,
        },
        BBVoting: {
            address: '0xc7252214d78b15f37b94ae73027419a9f275c36f',
            abi: BBVoting_abi,
        },
        BBParams: {
            address: '0xc0647055b50dce8751908bfbd7f1d219ed592d6f',
            abi: BBParams_abi,
        },
	},
	tomo : {

	},
	main : {

	}
}
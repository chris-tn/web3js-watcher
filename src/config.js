const BBFreelancerJob_json = require('./json/BBFreelancerJob')
const BBFreelancerBid_json = require('./json/BBFreelancerBid')
const BBFreelancerPayment_json = require('./json/BBFreelancerPayment')
const BBRating_json = require('./json/BBRating')
const BBVotingHelper_json = require('./json/BBVotingHelper')
const BBVoting_json = require('./json/BBVoting')
const BBDispute_json = require('./json/BBDispute')
const BBParams_json = require('./json/BBParams')
const BBOTest_json = require('./json/BBOTest');



module.exports =  {
	json : {
		BBOTest : BBOTest_json,
		BBFreelancerJob : BBFreelancerJob_json,
		BBFreelancerBid : BBFreelancerBid_json,
		BBFreelancerPayment : BBFreelancerPayment_json,
		BBRating : BBRating_json,
		BBVotingHelper : BBVotingHelper_json,
	},
	ropsten :  {
		BBO : {
			address : '0x1d893910d30edc1281d97aecfe10aefeabe0c41b'
		},
		BBFreelancerJob : {
			address : '0xb1e878028d0e3e47c803cbb9d1684d9d3d72a1b1'
		},
		BBFreelancerBid : {
			address : '0x7b388ecfec2f5f706aa34b540a39e8c434cfc8b4'
		},
		BBFreelancerPayment : {
			address : '0x253f112b946a72a008343d5bccd14e04288ca45c'
		},
		BBRating: {
            address: '0xb7786dd5e27926c9753e00dc582d1e707b147ceb',
        },
        BBVotingHelper: {
            address: '0x771911025b4eafb6395042b7dca728b275e5d8c0',
        },
        BBDispute: {
            address: '0x2b44a5589e8b3cd106a7542d4af9c5eb0016ef6e',
        },
        BBVoting: {
            address: '0xc7252214d78b15f37b94ae73027419a9f275c36f',
        },
        BBParams: {
            address: '0xc0647055b50dce8751908bfbd7f1d219ed592d6f',
        },
	},
	tomo : {

	},
	main : {

	}
}
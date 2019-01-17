const BBDispute = require('./BBDispute.json');
const BBFreelancerBid = require('./BBFreelancerBid.json');
const BBFreelancerJob = require('./BBFreelancerJob.json');
const BBFreelancerPayment = require('./BBFreelancerPayment.json');
const BBRating = require('./BBRating.json');
const BBToken = require('./BBToken.json');
const BBVoting = require('./BBVoting.json');
const BBVotingHelper = require('./BBVotingHelper.json');
const BBWrap = require('./BBWrap.json');

module.exports =  {
	'HTTP_URL':{
		'mainnet': 'https://mainnet.infura.io/CUNjkZ8qg6WZHqeFNJyL',
		'ropsten': 'https://ropsten.infura.io/CUNjkZ8qg6WZHqeFNJyL',
		'rinkeby': 'https://rinkeby.infura.io/CUNjkZ8qg6WZHqeFNJyL',
	},
	'WS_URL':{
		'mainnet': 'wss://mainnet.infura.io/ws',
		'ropsten': 'wss://ropsten.infura.io/ws',
		'rinkeby': 'wss://rinkeby.infura.io/ws',
	},
	'BBO': {
		'abi': BBToken,
		'mainnet': process.env.BBO_ADDRESS,
		'ropsten': '0x1d893910d30edc1281d97aecfe10aefeabe0c41b',
		'rinkeby': process.env.BBO_ADDRESS,
	},
	'BBFreelancerJob': {
		'abi': BBFreelancerJob,
		'mainnet': process.env.BBO_ADDRESS,
		'ropsten': process.env.BBO_ADDRESS,
		'rinkeby': '0x7e568533c8d7aeb8e0e3dc4f985ebe7383335e9a',
	},
	'BBFreelancerBid': {
		'abi': BBFreelancerBid,
		'mainnet': process.env.BBO_ADDRESS,
		'ropsten': process.env.BBO_ADDRESS,
		'rinkeby': '0x45f770502cdba34c88e629828623d7a791c88d69',
	},
	'BBFreelancerPayment': {
		'abi': BBFreelancerPayment,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': process.env.DEFAULT_ADDRESS,
		'rinkeby': '0xbe1e81348fbfcca03118ab146cfaae2f8564a1b4',
	},
	'BBRating': {
		'abi': BBRating,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': process.env.DEFAULT_ADDRESS,
		'rinkeby': '0xdd7d43a4802e968fd23275f0996dff09e1e706a7',
	},
	'BBVoting': {
		'abi': BBVoting,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': process.env.DEFAULT_ADDRESS,
		'rinkeby': '0x0ffb85883482c42a45a7cf21a22b0d30d9b7341d',
	},
	'BBVotingHelper': {
		'abi': BBVotingHelper,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': process.env.DEFAULT_ADDRESS,
		'rinkeby': '0x07405fce52ac55bfedafa7855a77a0d049b0c33d',
	},
	'BBWrap': {
		'abi': BBWrap,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': '0x989b371d7a936ed32bf2d92e6f5131171f8dbd0a',
		'rinkeby': '0xfe01e2c1ee0014c36a87d08f5951c8ea1a8e4b92',
	},
	'BBDispute': {
		'abi': BBDispute,
		'mainnet': process.env.DEFAULT_ADDRESS,
		'ropsten': process.env.DEFAULT_ADDRESS,
		'rinkeby': '0x2fc06d443387a17597d3f20dcba2f520f6640d3f',
	}
}
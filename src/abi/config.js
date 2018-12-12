const bbo_abi = require('./bbo')

module.exports =  {
	'BBO': {
		'abi': bbo_abi,
		'address': process.env.BBO_ADDRESS
	}
}
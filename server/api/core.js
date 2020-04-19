'use strict';

const ethers = require('ethers');
const https  = require('https');

exports.submit = (query, formater, config) => (req, res) => {
	const chain   = config.chains[req.params.chainid];
	const tokenid = ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(req.params.tokenid), 20));

	new Promise(async (resolve, reject) => {
		let chunks = [];
		let request = https.request({
			path: chain.subgraph,
			...config.request
		}, res => {
			res.on('data', (chunk) => {
				chunks.push(chunk);
			});
			res.on('end', () => {
				if (chunks.length)
				{
					resolve(JSON.parse(chunks.join('')));
				}
				else
				{
					reject(`[HTTP ERROR]\nstatusCode: ${res.statusCode}`);
				}
			});
		});
		request.on('error', reject);
		request.write(JSON.stringify({ query, variables: { tokenid } }));
		request.end();
	})
	.then(response => {
		res.json(formater(response, chain, tokenid));
	})
	.catch(error => {
		res.json(error);
	})
};

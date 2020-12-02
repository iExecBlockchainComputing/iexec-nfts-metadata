'use strict';

const ethers = require('ethers');
const https  = require('https');
const url    = require('url');

exports.submit = (query, formater, config) => (req, res) => {
	const chain   = config.chains[req.params.chainid];
	const tokenid = ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(req.params.tokenid), 20));
	new Promise(async (resolve, reject) => {
		if (chain)
		{
			let chunks = [];
			let { protocol, host, path, port } = url.parse(chain.subgraph);
			port |= protocol == 'https:' ? 443 : 80;


			let request = https.request({ method: "POST", host, path, port }, res => {
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
						reject({ error: `[HTTP ERROR]\nstatusCode: ${res.statusCode}` });
					}
				});
			});
			request.on('error', reject);
			request.write(JSON.stringify({ query, variables: { tokenid } }));
			request.end();
		}
		else
		{
			reject({ error: `unsupported chainid ${req.params.chainid}` });
		}
	})
	.then(response => {
		res.json(formater(response, chain, tokenid));
	})
	.catch(error => {
		res.json(error);
	})
};

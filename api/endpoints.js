'use strict';

const ethers = require('ethers');
const https  = require('https');
const config = require('../config.json');

function submit(path, query, variables = {})
{
	return new Promise(async (resolve, reject) => {
		let chunks = [];
		let request = https.request({ path, ...config.request }, res => {
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
		request.write(JSON.stringify({ query, variables }));
		request.end();
	});
}

exports.app = (req, res) => {
	const chain   = config.chains[req.params.chainid];
	const tokenid = ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(req.params.tokenid), 20));

	submit(
		chain.subgraph,
		config.ressources.app.query,
		{ tokenid },
	)
	.then(({ data }) => {
		res.json({
			name:          data.app.name,
			image:         config.ressources.app.image,
			description:   'An iExec v5 application',
			external_link: `https://explorer.iex.ec/${chain.name}/app/${tokenid}`,
			attributes:
			[
				{ trait_type: 'type',      value: data.app.type      },
				{ trait_type: 'multiaddr', value: data.app.multiaddr },
				{ trait_type: 'checksum',  value: data.app.checksum  },
				{ trait_type: 'mrenclave', value: data.app.mrenclave },
			],
		});
	})
	.catch(error => {
		res.json(error);
	});
}

exports.dataset = (req, res) => {
	const chain   = config.chains[req.params.chainid];
	const tokenid = ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(req.params.tokenid), 20));

	submit(
		chain.subgraph,
		config.ressources.dataset.query,
		{ tokenid },
	)
	.then(({ data }) => {
		res.json({
			name:          data.dataset.name,
			image:         config.ressources.dataset.image,
			description:   'An iExec v5 dataset',
			external_link: `https://explorer.iex.ec/${chain.name}/dataset/${tokenid}`,
			attributes:
			[
				{ trait_type: 'multiaddr', value: data.dataset.multiaddr },
				{ trait_type: 'checksum',  value: data.dataset.checksum  },
			],
		});
	})
	.catch(error => {
		res.json(error);
	});
}

exports.workerpool = (req, res) => {
	const chain   = config.chains[req.params.chainid];
	const tokenid = ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(req.params.tokenid), 20));

	submit(
		chain.subgraph,
		config.ressources.workerpool.query,
		{ tokenid },
	)
	.then(({ data }) => {
		res.json({
			name:          data.workerpool.description,
			image:         config.ressources.workerpool.image,
			description:   'An iExec v5 workerpool',
			external_link: `https://explorer.iex.ec/${chain.name}/workerpool/${tokenid}`,
			attributes:
			[
				{ trait_type: 'worker stake',     value: parseInt(data.workerpool.workerStakeRatio),     display_type: 'percentage' },
				{ trait_type: 'scheduler stake',  value: parseInt(data.workerpool.schedulerRewardRatio), display_type: 'percentage' },
			],
		});
	})
	.catch(error => {
		res.json(error);
	});
}

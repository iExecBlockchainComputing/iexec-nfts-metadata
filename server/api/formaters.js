'use strict';

const { ethers } = require('ethers');
const addressify = (id) => ethers.utils.hexlify(ethers.utils.padZeros(ethers.utils.bigNumberify(id), 20));


exports.app = (params) => ({ data }, chain, tokenid) => ({
	name:          data.app.name,
	image:         params.image,
	description:   'An iExec v5 application',
	external_link: `https://explorer.iex.ec/${chain.name}/app/${tokenid}`,
	attributes:
	[
		{ trait_type: 'address',   value: addressify(data.app.id) },
		{ trait_type: 'type',      value: data.app.type           },
		{ trait_type: 'multiaddr', value: data.app.multiaddr      },
		{ trait_type: 'checksum',  value: data.app.checksum       },
		{ trait_type: 'mrenclave', value: data.app.mrenclave      },
	],
});

exports.dataset = (params) => ({ data }, chain, tokenid) => ({
	name:          data.dataset.name,
	image:         params.image,
	description:   'An iExec v5 dataset',
	external_link: `https://explorer.iex.ec/${chain.name}/dataset/${tokenid}`,
	attributes:
	[
		{ trait_type: 'address',   value: addressify(data.dataset.id) },
		{ trait_type: 'multiaddr', value: data.dataset.multiaddr      },
		{ trait_type: 'checksum',  value: data.dataset.checksum       },
	],
});

exports.workerpool = (params) => ({ data }, chain, tokenid) => ({
	name:          data.workerpool.description,
	image:         params.image,
	description:   'An iExec v5 workerpool',
	external_link: `https://explorer.iex.ec/${chain.name}/workerpool/${tokenid}`,
	attributes:
	[
		{ trait_type: 'address',          value: addressify(data.workerpool.id)                                             },
		{ trait_type: 'worker stake',     value: parseInt(data.workerpool.workerStakeRatio),     display_type: 'percentage' },
		{ trait_type: 'scheduler stake',  value: parseInt(data.workerpool.schedulerRewardRatio), display_type: 'percentage' },
	],
});

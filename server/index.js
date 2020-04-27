'use strict';

const express   = require('express');
const config    = require(process.env.CONFIG || './config.json');
const core      = require('./api/core');
const formaters = require('./api/formaters');

const app  = express();
const port = process.env.PORT || 3000;

for (const [id, params] of Object.entries(config.endpoints))
{
	app
		.route(params.route)
		.get(
			core.submit(
				params.query,
				formaters[id](params),
				config,
			)
		)
}

app.listen(port);

console.log(`RESTful API server started on: ${port}`);

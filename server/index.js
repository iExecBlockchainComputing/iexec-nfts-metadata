const express   = require('express');
const endpoints = require('./api/endpoints');

const app  = express();
const port = process.env.PORT || 3000;

app
	.route('/app/:chainid/:tokenid')
	.get(endpoints.app);

app
	.route('/dataset/:chainid/:tokenid')
	.get(endpoints.dataset);

app
	.route('/workerpool/:chainid/:tokenid')
	.get(endpoints.workerpool);

app
	.listen(port);

console.log(`RESTful API server started on: ${port}`);

const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

function NWD(a, b) {
    return b ? NWD(b, a % b) : a
}

client.set('counter', 0)

app.get('/', (req, res) => {
  client.get('counter', (err, counter_value) => {
    res.send(`Counter ${counter_value}`);
    client.set('counter', parseInt(counter_value) + 1);
  })
});

app.get('/nwd/:l1/:l2', (req, res) => {
	const l1 = req.params.l1;
	const l2 = req.params.l2;
	const key = `${l1}:${l2}`;

	client.get(key, (err, value) => {
		if (!value) {
			value = NWD(l1, l2);
		}
		res.send(`NWD z ${l1} and ${l2} to ${value}`);
		client.set(key, parseInt(value));
	});
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
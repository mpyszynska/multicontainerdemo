const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

// Postgres Client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})

pgClient.on('error', () => console.log('Cannot connect to PG'))

pgClient.query('CREATE TABLE IF NOT EXISTS values (a INT, b INT, c INT, delta INT)').catch(err => console.log(err));

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

app.get('/delta', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = req.query.c;
  
  const key = `${a}_${b}_${c}`;
  
	client.exists(key, (err, exists) => {
		if (exists === 1) {
			client.get(key, (err, result) => {
				res.send(`${result} (cached)`);
				return;
			});
		} else {
			const result = b * b - 4 * a *c;
			client.set(key, result);
			pgClient.query(`INSERT INTO values (a, b, c, delta) VALUES (${a}, ${b}, ${c}, ${result})`, (err) => {console.log(err)});
			res.send(`${result}`);
		}
	});
});

app.get("/values", (req, res) => {
	pgClient.query("SELECT * FROM values;")
		.then(result => res.send(result.rows))
		.catch(err => console.log(err));
});

app.listen(5000, err => {
  console.log('Backend listening');
})
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

pgClient.on('error', () => console.log('Lost connection to PG'))

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch(err => console.log(err));

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

app.get('/nwd', (req, res) => {
  const key = `GCD(${req.query.l1},${req.query.l2})`;
  client.get(key, async (err, value) => {
    if (!value) {
      console.log('GCD not found in cache');
      const gcd = gcd_rec(parseInt(req.query.l1), parseInt(req.query.l2));
      client.set(key, parseInt(gcd));
      const query = `INSERT INTO values(number) VALUES (${gcd})`;
      console.log(query)
      pgClient.query(query)
      res.send({gcd});
    }
    else {
      console.log('Sending GCD from cache');
      res.send({gcd: value});
    }
  })
});

app.get('/results', async (req, res) => {
  const result = await pgClient.query('SELECT * FROM values');
  res.send({gcd: result.rows})
});

function gcd_rec(a, b) {
    if (b) {
        return gcd_rec(b, a % b);
    } else {
        return Math.abs(a);
    }
}

app.listen(5000, err => {
  console.log('Backend listening');
})
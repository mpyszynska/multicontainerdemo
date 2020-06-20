// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const keys = require('./keys');
const app = express();
app.use(cors());
app.use(bodyParser.json());
console.log(keys);

const port = 5000;

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})


pgClient
  .on('error', () => console.log('Cannot connect to PG database.'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS delty (delta BIGINT);')
  .catch(err => console.log(err));


app.get('/delta/:a/:b/:c', (request, response) => {
  let a = parseInt(request.params.a);
  let b = parseInt(request.params.b);
  let c = parseInt(request.params.c);
  const key = `${a}-${b}-${c}`;

  redisClient.get(key, (err, del) => {
    let result = {};
    if (!del) {
      let wyliczonaDelta;
            wyliczonaDelta = b * b - 4 * a *c;

      redisClient.set(key, wyliczonaDelta);
      pgClient
        .query('INSERT INTO delty (delta) VALUES ($1);', [wyliczonaDelta])
        .catch(error => console.log(`${error}`));
      result.wyliczonaDelta = wyliczonaDelta;
    }
    else {
      result.wyliczonaDelta = del;
    }
    response.send(result);
  });
});


app.get('/results', (request, response) => {
  pgClient.query('SELECT * FROM delty;', (error, result) => {
    if (!result.rows || !result) {
      response.json([]);
    } else {
      response.json(result.rows);
    }
  });
});

app.listen(port, err => {
  console.log(`Backend app listening on ${port}`);
})
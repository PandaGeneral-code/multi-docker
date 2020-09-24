const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const redis = require("redis");

const keys = require("./keys");

const app = express();
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query(`SELECT * FROM values`);
  res.status(200).json({ data: values.rows });
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query(`INSERT INTO values (number) VALUES ($1)`, [index]);

  res.send({ working: true });
});

pgClient.on("error", () => console.log("Lost PG connection"));

setTimeout(() => {
  pgClient.connect((err, client) => {
    if (err) {
      return console.log("Could not connect");
    }
    client
      .query(`CREATE TABLE IF NOT EXISTS values (number INT)`)
      .catch((err) => console.log(err));
    app.listen(keys.port, () => console.log(`Listening on ${keys.port}...`));
  });
}, 1000);

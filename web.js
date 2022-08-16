const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const calculate = require('./calculate');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
  console.log(req.body);
  const result = calculate(req.body);
  console.log('result', result);
  res.send(result);
});

app.listen(process.env.PORT || 8080);

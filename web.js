const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const calculate = require('./calculate');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.locals.stuckStats = {
  stuckCount: 0,
  prevX: 0,
  prevY: 0,
  prevScore: 0
};
app.post('/', function (req, res) {
  const result = calculate(req.body, app.locals.stuckStats);
  console.log('result', result);
  res.send(result);
});

app.listen(process.env.PORT || 8080);

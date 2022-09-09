const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
  console.log(req.body);
  const moves = ['F', 'T', 'L', 'R'];
  
  // TODO add your implementation here to replace the random response
  
  // res.send(moves[Math.floor(Math.random() * moves.length)]);

  res.send('F');

});

app.listen(process.env.PORT || 8080);

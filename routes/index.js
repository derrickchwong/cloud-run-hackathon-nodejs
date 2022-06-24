import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

router.post('/', function (req, res) {
  console.log(req.body);
  const moves = ['F', 'T', 'L', 'R'];
  res.send(moves[Math.floor(Math.random() * moves.length)]);
});

export default router;

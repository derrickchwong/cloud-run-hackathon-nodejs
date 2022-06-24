function get(req, res) {
  return res.send('Let the battle begin!');
}

function action(req, res) {
  const { _links, arena } = req.body;
  console.log({ _links, arena });
  const moves = ['F', 'T', 'L', 'R'];
  res.send(moves[Math.floor(Math.random() * moves.length)]);
}

export default { get, action };

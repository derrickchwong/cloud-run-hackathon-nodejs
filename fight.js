const example = {
  "_links": {
    "self": {
      "href": "https://foo.com"
    }
  },
  "arena": {
    "dims": [4, 3],
    "state": {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      }
    }
  }
}

const DIRECTIONS = {
  North: "N",
  West: "W",
  South: "S",
  East: "E"
}

const MOVES = {
  Forward: "F",
  Throw: "T",
  TurnLeft: "L",
  TurnRight: "R"
}
module.exports = function fight({ _links, arena }) {
  const myUrl = _links.self.href
  console.log("🚀 ~ file: fight.js ~ line 37 ~ fight ~ myUrl", myUrl)
  const myState = arena.state[myUrl]
  console.log("🚀 ~ file: fight.js ~ line 39 ~ fight ~ myState", myState)
  const [arenaXLength, arenaYLength] = arena.dims
  console.log("🚀 ~ file: fight.js ~ line 41 ~ fight ~ arena", arena.dims)
  const arenaX = arenaXLength - 1
  const arenaY = arenaYLength - 1
  console.log("🚀 ~ file: fight.js ~ line 42 ~ fight ~ arenaX", arenaX, arenaY)

  const othersState = Object.entries(arena.state).filter(([key]) => key !== myUrl).map(([key, val]) => {
    return { ...val, player: key }
  })
  const { x, y, direction, wasHit, score } = myState
  // 1. Face to the right direction (Do not stuck)
  // 2. Attack if there is someone in my direction
  // 3. If no one close, move
  // faceToCorrectDirection()
  //function faceToCorrectDirection() {
  if (y === 0 && direction === DIRECTIONS.North) {
    if (x === 0) {
      return MOVES.TurnRight
    }

    return MOVES.TurnLeft
  }

  if (y === arenaY && direction === DIRECTIONS.South) {
    if (x === 0) {
      return MOVES.TurnLeft
    }

    return MOVES.TurnRight
  }

  if (x === 0 && direction === DIRECTIONS.West) {
    return MOVES.TurnLeft
  }

  if (x === arenaX && direction === DIRECTIONS.East) {
    return MOVES.TurnLeft
  }
  // faceToCorrectDirection}

  // Target the player, 
  const THROW_DISTANCE = 3
  const nearPlayers = othersState.filter((other) => {
    return (Math.abs(other.x - x) <= THROW_DISTANCE && other.y === y) || (Math.abs(other.y - y) <= THROW_DISTANCE && other.x === x)
  })
  console.log("Nearplayers count ~ ", nearPlayers.length)
  const canThrow = nearPlayers.some(other => {
    if (direction === DIRECTIONS.East) {
      return other.y === y && other.x > x
    }
    if (direction === DIRECTIONS.West) {
      return other.y === y && x > other.x
    }
    if (direction === DIRECTIONS.North) {
      return other.x === x && y > other.y
    }
    if (direction === DIRECTIONS.South) {
      return other.x === x && y < other.y
    }
  })

  const moveConflict = () => {
    let newx = x
    let newy = y
    if (direction === DIRECTIONS.North) {
      newy = y - 1
    }
    if (direction === DIRECTIONS.South) {
      newy = y + 1
    }
    if (direction === DIRECTIONS.East) {
      newx = x + 1
    }
    if (direction === DIRECTIONS.West) {
      newx = x - 1
    }

    const conflict = nearPlayers.some((other) => {
      return other.x === newx && other.y === newy
    })
    console.log("moveConflict ~ direction", direction)
    console.log('moveConflict nex position', newx, newy);
    console.log("moveConflict ~ conflict", conflict)
    return conflict
  }


  if (canThrow) {
    if (wasHit) {
      //where is that player?
      if (moveConflict()) {
        return MOVES.TurnLeft
      }
      return MOVES.Forward
    }
    return MOVES.Throw;
  } else {
    if (nearPlayers.length > 0 && !wasHit) {
      return MOVES.TurnLeft
    }
    if (moveConflict()) {
      return MOVES.TurnLeft
    }
    return MOVES.Forward
  }
}


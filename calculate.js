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
};

const DIRECTIONS = {
  North: "N",
  West: "W",
  South: "S",
  East: "E"
};

const MOVES = {
  Forward: "F",
  Throw: "T",
  TurnLeft: "L",
  TurnRight: "R"
};

module.exports = function calculate({ _links, arena }, stuckStats) {
  const myUrl = _links.self.href;
  const myState = arena.state[myUrl];
  console.log("🚀 ~ myState", myState);
  const [arenaXLength, arenaYLength] = arena.dims;
  console.log("🚀 ~ arena", arena.dims);
  const arenaX = arenaXLength - 1;
  const arenaY = arenaYLength - 1;
  console.log("🚀 ~ arenaX, arenaY", arenaX, arenaY);

  const othersState = Object.entries(arena.state).filter(([key]) => key !== myUrl).map(([key, val]) => {
    return { ...val, player: key };
  });
  const { x, y, direction, wasHit, score } = myState;
  
  // Check "Stuck"-ness
  if (x === stuckStats.prevX && y === stuckStats.prevY && score <= stuckStats.prevScore) {
    stuckStats.stuckCount++;
  } else {
    stuckStats.stuckCount = 0;
  }
  stuckStats.prevX = x;
  stuckStats.prevY = y;
  stuckStats.prevScore = score;

  // 1. Face to the right direction (Do not stuck)
  // 2. Attack if there is someone in my direction
  // 3. If no one close, move

  // Face to the right direction
  if (y === 0 && direction === DIRECTIONS.North) {
    if (x === 0) {
      return MOVES.TurnRight;
    }

    return MOVES.TurnLeft;
  }

  if (y === arenaY && direction === DIRECTIONS.South) {
    if (x === 0) {
      return MOVES.TurnLeft;
    }

    return MOVES.TurnRight;
  }

  if (x === 0 && direction === DIRECTIONS.West) {
    return MOVES.TurnLeft;
  }

  if (x === arenaX && direction === DIRECTIONS.East) {
    return MOVES.TurnLeft;
  }

  // Target the player
  const THROW_DISTANCE = 3;
  const nearPlayers = othersState.filter((other) => {
    return (Math.abs(other.x - x) <= THROW_DISTANCE && other.y === y) || (Math.abs(other.y - y) <= THROW_DISTANCE && other.x === x);
  });
  console.log("Nearplayers count ~ ", nearPlayers.length);
  const canThrow = nearPlayers.some(other => {
    if (direction === DIRECTIONS.East) {
      return other.y === y && other.x > x;
    }
    if (direction === DIRECTIONS.West) {
      return other.y === y && x > other.x;
    }
    if (direction === DIRECTIONS.North) {
      return other.x === x && y > other.y;
    }
    if (direction === DIRECTIONS.South) {
      return other.x === x && y < other.y;
    }
  });

  const moveConflict = () => {
    let newX = x;
    let newY = y;
    if (direction === DIRECTIONS.North) {
      newY = y - 1;
    }
    if (direction === DIRECTIONS.South) {
      newY = y + 1;
    }
    if (direction === DIRECTIONS.East) {
      newX = x + 1;
    }
    if (direction === DIRECTIONS.West) {
      newX = x - 1;
    }

    const conflict = nearPlayers.some((other) => {
      return other.x === newX && other.y === newY;
    });
    console.log("moveConflict ~ direction", direction);
    console.log('moveConflict next position', newX, newY);
    console.log("moveConflict ~ conflict", conflict);
    return conflict;
  };

  const cornered = () => {
    let enemyDirectionTowardsMe;
    if (direction === DIRECTIONS.North) {
      enemyDirectionTowardsMe = DIRECTIONS.South;
    }
    if (direction === DIRECTIONS.South) {
      enemyDirectionTowardsMe = DIRECTIONS.North;
    }
    if (direction === DIRECTIONS.East) {
      enemyDirectionTowardsMe = DIRECTIONS.West;
    }
    if (direction === DIRECTIONS.West) {
      enemyDirectionTowardsMe = DIRECTIONS.East;
    }

    if (nearPlayers.length >= 4) {
      return nearPlayers.some((other) => {
        return other.direction == enemyDirectionTowardsMe;
      });
    }
    
    const inEdgeNotCornerX = x > 0 && x < arenaX;
    const inEdgeNotCornerY = y > 0 && y < arenaY;
    if (nearPlayers.length === 3 && (inEdgeNotCornerX || inEdgeNotCornerY)) {
      return nearPlayers.some((other) => {
        return other.direction == enemyDirectionTowardsMe;
      });
    }

    const inCornerX = x === arenaX || x === 0;
    const inCornerY = y === arenaY || y === 0;
    if (nearPlayers.length === 2 && (inCornerX && inCornerY)) {
      return nearPlayers.some((other) => {
        return other.direction == enemyDirectionTowardsMe;
      });
    }

    return false;
  };

  if (canThrow) {
    if (wasHit) {
      //where is that player?
      if (moveConflict()) {
        if (stuckStats.stuckCount > 2 && cornered()) {
          return MOVES.Throw;
        }

        if (y === arenaY) {
          //add additional check because of a bug:
          //stuck between turn left and turn right
          //conflicting with check in line 59
          //if (y === arenaY && direction === DIRECTIONS.South)
          return MOVES.TurnRight;
        }
        return MOVES.TurnLeft;
      }
      return MOVES.Forward;
    }
    return MOVES.Throw;
  } else {
    if (nearPlayers.length > 0 && !wasHit) {
      if (y === arenaY) {
        //add additional check because of a bug:
        //stuck between turn left and turn right
        //conflicting with check in line 59
        //if (y === arenaY && direction === DIRECTIONS.South)
        return MOVES.TurnRight;
      }
      return MOVES.TurnLeft;
    }
    if (moveConflict()) {
      return MOVES.TurnLeft;
    }
    return MOVES.Forward;
  }
}
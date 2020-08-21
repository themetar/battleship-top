import ShipFactory from "./ship";

function between(n, a, b) {
  return a <= n && n <= b;
}

function hitTest(one, two) {
  return  (between(one.x, two.x, two.x + two.width - 1) || between(two.x, one.x, one.x + one.width -1)) &&
          (between(one.y, two.y, two.y + two.height - 1) || between(two.y, one.y, one.y + one.height -1));
}

function GameboardFactory(shipsDescription = [], size = 10) {
  const shipsData = shipsDescription.map(d => ({
      ship: ShipFactory(d.width > 1 ? d.width : d.height),
      position: {
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
      },
    }));
  
  const chart = [...Array(size).keys()].map(i => new Array(size).fill(""));
  
  /* methods */

  const receiveAttack = function(x, y) {
    let hitVessel = shipsData.find(({position}) => hitTest({x, y, width: 1, height: 1}, position));
    if (hitVessel) {
      const {ship, position} = hitVessel;
      const section = Math.abs(position.width === 1 ?
                               y - position.y : x - position.x);
      ship.hit(section);
    }
    chart[x][y] = hitVessel ? "hit" : "miss";
  };

  const allShipsSunk = function() {
    return shipsData.every(data => data.ship.isSunk());
  };

  /* create object */
  
  return {
    receiveAttack,
    allShipsSunk,
    get attackChart() { return chart; },
    get shipsLocations() { return shipsData.map(({position}) => position); },
    get sunkShipsLocations() { return shipsData.filter(({ship}) => ship.isSunk()).map(({position}) => position); }
  };
}

/* Utility function: Random ship placement */

function randomFleetPlacement(boardSize, lengths) {
  const stack = [];
  const positions = [];
  let i = 0;
  while (true) {
    if (i == lengths.length) break;

    const shipLength = lengths[i];

    let options;

    if (stack[i]) {
      options = stack.pop();
    } else {
      options = [];
      
      // horizontal ship
      for (let x = 0; x <= boardSize - shipLength; x++) {
        for (let y = 0; y < boardSize; y++) {
          const ship = {x, y, width: shipLength, height: 1};
          if (!positions.some(pos => hitTest(pos, ship))) {
            options.push(ship);
          }
        }
      }

      // vertical
      for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y <= boardSize - shipLength; y++) {
          const ship = {x, y, width: 1, height: shipLength};
          if (!positions.some(pos => hitTest(pos, ship))) {
            options.push(ship);
          }
        }
      }
    }

    // choose
    if (options.length > 0) {
      const r = Math.floor(Math.random() * options.length);
      const choice = options.splice(r, 1)[0];
      positions.push(choice);
      i++;
      stack.push(options);
    } else {
      positions.pop();
      i--;
    }
  }

  return positions;
}

export default GameboardFactory;
export {randomFleetPlacement};

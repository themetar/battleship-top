import {hitTest} from "./gameboard";

function AIPlayerFactory(enemyBoard) {
  let moveHandler;

  const takeTurn = () => {
    const available = enemyBoard.attackChart.reduce((acc, col, x) => acc.concat(col.reduce((acc, val, y) => val == "" ? acc.concat({x, y}) : acc, [])), []);
    const withRating = available.map(attack => {
      const boardSize = enemyBoard.attackChart.length;
      const offsets = [[0, 1], [0, -1], [-1, 0], [1, 0]];
      const neighbors = offsets.map(o => ({x: attack.x + o[0], y: attack.y + o[1]}))
                                .filter(n => -1 < n.x && n.x < boardSize && -1 < n.y && n.y < boardSize);
      let rating = 0;
      const hitsNeighbors = neighbors.filter(n => enemyBoard.attackChart[n.x][n.y] == "hit" && !enemyBoard.sunkShipsLocations.some(s => hitTest(s, n))).length;
      rating += hitsNeighbors * 100;

      const missNeighbors = neighbors.filter(n => enemyBoard.attackChart[n.x][n.y] == "miss").length;
      rating += 40 - missNeighbors * 10;

      return {...attack, rating};
    });

    withRating.sort((a, b) => b.rating - a.rating);
    const top = withRating.filter(a => a.rating == withRating[0].rating);
    const choice = top[Math.floor(Math.random() * top.length)];
    
    if (moveHandler && typeof moveHandler == "function")
      moveHandler(choice);
  }

  return {
    takeTurn,
    set onMove(handler) {
      moveHandler = handler;
    }
  };
}

function HumanPlayerFactory() {
  let moveHandler;

  let hasTurn = false;

  const takeTurn = () => {
    hasTurn = true;
  };

  const makeMove = attack => {
    if (hasTurn) {
      hasTurn = false;
      
      if (moveHandler && typeof moveHandler == "function")
        moveHandler(attack);
    }
  };

  return {
    takeTurn,
    makeMove,
    set onMove(handler) {
      moveHandler = handler;
    }
  };
}

export {AIPlayerFactory, HumanPlayerFactory};

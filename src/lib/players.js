function AIPlayerFactory(enemyBoard) {
  let moveHandler;

  const takeTurn = () => {
    const available = enemyBoard.attackChart.reduce((acc, col, x) => acc.concat(col.reduce((acc, val, y) => val == "" ? acc.concat({x, y}) : acc, [])), []);
    const choice = available[Math.floor(Math.random() * available.length)];
    
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

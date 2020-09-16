import React, {useState} from "react";
import Chart from "./Chart";

import {HumanPlayerFactory, AIPlayerFactory} from "../lib/players";
import GameboardFactory, {randomFleetPlacement, hitTest} from "../lib/gameboard";

const BOARD_SIZE = 9;

let gameboards;
let players;
let currentPlayer = 0;

function initGameObjects() {
  const playerOneShips = randomFleetPlacement(BOARD_SIZE, [5,4,3,3,2]);

  const playerTwoShips = randomFleetPlacement(BOARD_SIZE, [5,4,3,3,2]);

  gameboards = [
    GameboardFactory(playerOneShips, BOARD_SIZE),
    GameboardFactory(playerTwoShips, BOARD_SIZE),
  ];

  players = [
    HumanPlayerFactory(),             // comment out either Human or AI, to set as first player 
    // AIPlayerFactory(gameboards[1]), // and uncomment the other
    AIPlayerFactory(gameboards[0]),
  ];

  currentPlayer = 0;
}

initGameObjects();

function copy(chart) {
  return chart.map(a => a.slice());
}

export default function Game() {

  const [gamePhase, setGamePhase] = useState("pre");
  const charts = gameboards.map(gb => {
    const [value, setFn] = useState(gb.attackChart);
    
    return {chart: value, setChart: setFn};
  });
  const [player, setPlayer] = useState(currentPlayer);

  const [firstPlayerShips, setFirstPlayerShips] = useState(gameboards[0].shipsLocations);

  function gameStep(attack) {
    const nextPlayer = (currentPlayer + 1) % 2;

    gameboards[nextPlayer].receiveAttack(attack.x, attack.y);

    charts[nextPlayer].setChart(copy(gameboards[nextPlayer].attackChart));

    if (gameboards.findIndex(board => board.allShipsSunk()) != -1) {
      setGamePhase("over");
    } else {
      currentPlayer = nextPlayer;
      setPlayer(currentPlayer);

      players[nextPlayer].takeTurn();
    }

  }

  players[0].onMove = gameStep;
  players[1].onMove = (attack) => setTimeout(() => gameStep(attack), 500);

  const onPlay = () => {
    setGamePhase("playing");
    setPlayer(currentPlayer);
    players[currentPlayer].takeTurn();
  };

  const onRestart = () => {
    setGamePhase("pre");
    initGameObjects();  // reset
    charts.forEach((ch, i) => ch.setChart(gameboards[i].attackChart));
    setFirstPlayerShips(gameboards[0].shipsLocations);
  };

  const editShipsCallback = (editType, shipIndex, position) => {
    const ship = gameboards[0].shipsLocations[shipIndex];
    const otherShips = gameboards[0].shipsLocations.filter((_, index) => index != shipIndex);
    
    if (editType == "move") {
      if (position.col < 0 || position.row < 0 || position.col + ship.width > BOARD_SIZE || position.row + ship.height > BOARD_SIZE)
        return; // out of bounding box

      if (!otherShips.some(other => hitTest(other, {x: position.col, y: position.row, width: ship.width, height: ship.height}))){
        // valid placement
        ship.x = position.col;
        ship.y = position.row;
        setFirstPlayerShips(gameboards[0].shipsLocations);
      }
    } else {
      // editType == "rotate"
      const after = {...ship, width: ship.height, height: ship.width};
      const area = {left: ship.x, right: ship.x + ship.width, top: ship.y, bottom: ship.y + ship.height};
      if (ship.height == 1) {
        area.top -= ship.width - 1;
      } else {
        area.left -= ship.height - 1;
      }
      // constrain to board
      area.left = area.left < 0 ? 0 : area.left;
      area.top  = area.top  < 0 ? 0 : area.top;
      area.right  = area.right + after.width   > BOARD_SIZE  ? BOARD_SIZE - after.width  +1  : area.right;
      area.bottom = area.bottom + after.height > BOARD_SIZE  ? BOARD_SIZE - after.height +1 : area.bottom;
      // try placements
      for(after.x = area.left; after.x < area.right; after.x++) {
        for (after.y = area.top; after.y < area.bottom; after.y++) {
          if (!otherShips.some(other => hitTest(other, after))){
            // valid placement
            ship.x      = after.x;
            ship.y      = after.y;
            ship.width  = after.width;
            ship.height = after.height
            setFirstPlayerShips(gameboards[0].shipsLocations);
            return;
          }
        }
      }
    }
  };

  return (
    <div>
      <header>
        <h1>Battleship</h1>
      </header>
      <div className="container">
        <div className="prompt">
          { gamePhase == "over" && (
            player == 0 && <div className="outcome">Victory!</div> ||
            player == 1 && <div className="outcome">Defeat.</div>
          ) }
          { gamePhase == "pre" && (
            <div>
              <p><span>Shall we engage in combat, sir?</span></p>
              <button onClick={ onPlay }>To battle stations!</button>
            </div>
          ) }
          { gamePhase == "over" && (
            <div>
              <p><span>Play again?</span></p>
              <button onClick={ onRestart }>Restart</button>
            </div>
          ) }
        </div>
        <div id="charts">
          <p style={ {visibility: gamePhase == "playing" && player == 1 ? "visible" : "hidden"} }>Incoming</p>
          <p style={ {visibility: gamePhase == "playing" && player == 0 ? "visible" : "hidden"} }>Attack</p>
          <Chart attacks={charts[0].chart} ships={ firstPlayerShips } editMode={ gamePhase == "pre" }
                  onEditShips={ editShipsCallback } />
          <Chart attacks={charts[1].chart} ships={ gameboards[1].sunkShipsLocations } commandCallback={ attack => players[0].makeMove(attack) } active={ gamePhase == "playing" && player == 0 } />
        </div>
      </div>
      <div className="overlay"></div>
    </div>
  );
}

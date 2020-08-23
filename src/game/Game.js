import React, {useState} from "react";
import Chart from "./Chart";

import {HumanPlayerFactory, AIPlayerFactory} from "../lib/players";
import GameboardFactory, {randomFleetPlacement} from "../lib/gameboard";

const BOARD_SIZE = 10;

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
    players[currentPlayer].takeTurn();
  };

  const onRestart = () => {
    setGamePhase("pre");
    initGameObjects();  // reset
    charts.forEach((ch, i) => ch.setChart(gameboards[i].attackChart));
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
              <p>Shall we engage in combat, sir?</p>
              <button onClick={ onPlay }>To battle stations!</button>
            </div>
          ) }
          { gamePhase == "over" && (
            <div>
              <p>Play again?</p>
              <button onClick={ onRestart }>Restart</button>
            </div>
          ) }
        </div>
        <div id="charts">
          <p style={ {visibility: gamePhase == "playing" && player == 1 ? "visible" : "hidden"} }>Incoming</p>
          <p style={ {visibility: gamePhase == "playing" && player == 0 ? "visible" : "hidden"} }>Attack</p>
          <Chart attacks={charts[0].chart} ships={ gameboards[0].shipsLocations } />
          <Chart attacks={charts[1].chart} ships={ gameboards[1].sunkShipsLocations } commandCallback={ attack => players[0].makeMove(attack) } active={ gamePhase == "playing" && player == 0 } />
        </div>
      </div>
      <div className="overlay"></div>
    </div>
  );
}

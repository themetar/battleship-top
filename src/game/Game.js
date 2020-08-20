import React, {useState} from "react";
import Chart from "./Chart";

import {HumanPlayerFactory, AIPlayerFactory} from "../lib/players";
import GameboardFactory from "../lib/gameboard";


let gameboards;
let players;
let currentPlayer = 0;

function initGameObjects() {
  gameboards = [
    GameboardFactory([{x: 0, y: 0, width: 5, height: 1}], 10),
    GameboardFactory([{x: 5, y: 1, width: 1, height: 5}], 10),
  ];

  players = [
    // HumanPlayerFactory(),             // comment out either Human or AI, to set as first player 
    AIPlayerFactory(gameboards[1]), // and uncomment the other
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
  const [humanChart, setHumanChart] = useState(gameboards[0].attackChart);
  const [aiChart, setAIChart] = useState(gameboards[1].attackChart);
  const [player, setPlayer] = useState(currentPlayer);

  function gameStep(attack) {
    const nextPlayer = (currentPlayer + 1) % 2;

    gameboards[nextPlayer].receiveAttack(attack.x, attack.y);

    const updateFn = nextPlayer == 1 ? setAIChart : setHumanChart;

    updateFn(copy(gameboards[nextPlayer].attackChart));

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
    setAIChart(gameboards[1].attackChart);
    setHumanChart(gameboards[0].attackChart);
  };

  return (
    <div>
      <header>
        <h1>Battleship</h1>
      </header>
      <div id="charts">
        <p>{gamePhase == "playing" && player == 1 && "Incoming"}</p>
        <p>{gamePhase == "playing" && player == 0 && "Attack"}</p>
        <Chart attacks={humanChart} />
        <Chart attacks={aiChart} commandCallback={ attack => players[0].makeMove(attack) } active={ gamePhase == "playing" } />
      </div>
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
  );
}

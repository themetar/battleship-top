import React, {useState} from "react";
import Chart from "./Chart";

import {HumanPlayerFactory, AIPlayerFactory} from "../lib/players";
import GameboardFactory from "../lib/gameboard";

let gamePhase = "pre";
let commandCallbacks = [];
let onPlay = null;
let onRestart = null;

let gameboards = [
  GameboardFactory([{x: 0, y: 0, width: 5, height: 1}], 10),
  GameboardFactory([{x: 5, y: 1, width: 1, height: 5}], 10),
];


let players = [
  HumanPlayerFactory(),
  AIPlayerFactory(gameboards[0]),
];

let currentPlayer = 0;
players[currentPlayer].takeTurn();

function copy(chart) {
  return chart.map(a => a.slice());
}

export default function Game() {

  const [humanChart, setHumanChart] = useState(gameboards[0].attackChart);
  const [aiChart, setAIChart] = useState(gameboards[1].attackChart);

  function gameStep(attack) {
    const nextPlayer = (currentPlayer + 1) % 2;

    gameboards[nextPlayer].receiveAttack(attack.x, attack.y);

    const updateFn = nextPlayer == 1 ? setAIChart : setHumanChart;

    updateFn(copy(gameboards[nextPlayer].attackChart));

    currentPlayer = nextPlayer;


    players[nextPlayer].takeTurn();

  }

  players[0].onMove = players[1].onMove = gameStep;

  return (
    <div>
      <header>
        <h1>Battleship</h1>
      </header>
      <div id="charts">
        <Chart attacks={humanChart} />
        <Chart attacks={aiChart} commandCallback={ attack => players[0].makeMove(attack) } active />
      </div>
      { gamePhase == "pre" && (
        <div>
          <p>Shall we engage in combat, sir?</p>
          <button onClick={() => onPlay()}>To battle stations!</button>
        </div>
      ) }
      { gamePhase == "over" && (
        <div>
          <p>Play again?</p>
          <button onClick={() => onRestart()}>Restart</button>
        </div>
      ) }
    </div>
  );
}

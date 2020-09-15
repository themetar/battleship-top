import React, { useRef, useState } from "react";

export default function Chart(props) {
  const attacks = props.attacks || [];

  const cells = attacks.reduce(
    (acc, col, x) => acc.concat(col.map(
      (mark, y) => (
        <span key={x * attacks.length + y}
              data-x={x}
              data-y={y}
              className={`cell ${mark}`}>
        </span>
      )
    ))
  , []);

  const clickHandler = event => {
    if (!props.active) return;
    
    const cell = event.target;

    const x = parseInt(cell.getAttribute("data-x"));
    const y = parseInt(cell.getAttribute("data-y"));

    if (props.commandCallback && !(isNaN(x) || isNaN(y))) {
      if (attacks[x][y] == "")
        props.commandCallback({x, y});
    }
  };

  const mouseOffset = {};
  let gridRect;
  let shipIndex;

  const dragStartHandler = event => {
    gridRect = {
      left: event.target.style.gridColumnStart,
      top: event.target.style.gridRowStart,
      width: event.target.style.gridColumnEnd - event.target.style.gridColumnStart,
      height: event.target.style.gridRowEnd - event.target.style.gridRowStart,
    };

    shipIndex = props.ships.findIndex(s => s.x == gridRect.left - 1 && s.y == gridRect.top - 1 && s.width == gridRect.width && s.height == gridRect.height);

    const shipRect = event.target.getBoundingClientRect();
    mouseOffset.x = event.clientX - shipRect.left;
    mouseOffset.y = event.clientY - shipRect.top;
  };

  const dragOverHandler = event => {
    const chartRect = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - chartRect.left - mouseOffset.x;
    let y = event.clientY - chartRect.top - mouseOffset.y;

    const gridSize = attacks.length;
    const roughCellSize = chartRect.width / gridSize;

    const col = Math.round(x / roughCellSize);
    const row = Math.round(y / roughCellSize);

    event.preventDefault();
  };

  const dropHandler = event => {
    const chartRect = event.currentTarget.getBoundingClientRect();

    let x = event.clientX - chartRect.left - mouseOffset.x;
    let y = event.clientY - chartRect.top - mouseOffset.y;

    const gridSize = attacks.length;
    const roughCellSize = chartRect.width / gridSize;


    const col = Math.round(x / roughCellSize);
    const row = Math.round(y / roughCellSize);

    props.onEditShips && props.onEditShips("move", shipIndex, {col, row});
  };

  return (
    <div className="chart-container"  style={{"--grid-size": attacks.length}}>
      <div className="ships" style={props.editMode ? {zIndex:  2} : {}}
            onDragOver={dragOverHandler} onDrop={dropHandler} >
        {
          props.ships.map(ship => {
            const style = {
              gridColumn: `${ship.x + 1} / ${ship.x + 1 + ship.width}`,
              gridRow: `${ship.y + 1} / ${ship.y + 1 + ship.height}`,
            };

            return <div key={`${ship.x}${ship.y}`}
                  className="ship"
                  style={ style }
                  draggable={props.editMode}
                  onDragStart={dragStartHandler} ></div>
          })
        }
      </div>
      <div className={`chart${props.active ? " active" : ""}`} onClick={ props.active ? clickHandler : undefined }>
        {cells}
      </div>
    </div>
  );
}

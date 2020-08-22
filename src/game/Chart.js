import React from "react";

export default function Chart(props) {
  const attacks = props.attacks && props.attacks || [];

  const cells = attacks.reduce(
    (acc, col, x) => acc.concat(col.map(
      (mark, y) => (
        <span key={x * attacks.length + y}
              data-x={x}
              data-y={y}
              className={`cell ${mark}`}>
          {mark}
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

  return (
    <div className="chart-container">
      <div className="ships">
        {
          props.ships.map(ship => {
            const style = {
              gridColumn: `${ship.x + 1} / ${ship.x + 1 + ship.width}`,
              gridRow: `${ship.y + 1} / ${ship.y + 1 + ship.height}`,
            };

            return <div key={`${ship.x}${ship.y}`}
                  className="ship"
                  style={ style }></div>
          })
        }
      </div>
      <div className="chart" style={{"--grid-size": attacks.length}} onClick={ props.active ? clickHandler : undefined }>
        {cells}
      </div>
    </div>
  );
}

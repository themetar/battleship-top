import GameboardFactory from "../lib/gameboard";

test("GameboardFactory created a gameboard", () => {
  const gameboard = GameboardFactory();
  expect(gameboard).toBeDefined();
});

test("Gameboard has methods", () => {
  const gameboard = GameboardFactory();
  expect(gameboard.receiveAttack).toBeInstanceOf(Function);
  expect(gameboard.attackChart).toBeDefined();
  expect(gameboard.allShipsSunk).toBeInstanceOf(Function);
});

test("Gameboard registers attacks, with no ships", () => {
  const gameboard = GameboardFactory([], 3);
  expect(gameboard.attackChart).toStrictEqual([ ["","",""],
                                                ["","",""],
                                                ["","",""]]);
  
  gameboard.receiveAttack(0, 0);
  expect(gameboard.attackChart).toStrictEqual([ ["miss","",""],
                                                ["","",""],
                                                ["","",""]]);

  gameboard.receiveAttack(1, 2);
  expect(gameboard.attackChart).toStrictEqual([ ["miss","",""],
                                                ["","","miss"],
                                                ["","",""]]);
});

test("Gameboard registers attacks, with ships", () => {
  const ships = [
    {
      x: 0,
      y: 0,
      width: 2,
      height: 1,
    },
    {
      x: 1,
      y: 1,
      width: 1,
      height: 2,
    },
  ];

  const gameboard = GameboardFactory(ships, 3);
  expect(gameboard.attackChart).toStrictEqual([ ["","",""],
                                                ["","",""],
                                                ["","",""]]);

  gameboard.receiveAttack(1, 0);

  expect(gameboard.attackChart).toStrictEqual([ ["","",""],
                                                ["hit","",""],
                                                ["","",""]]);

  gameboard.receiveAttack(1, 2);

  expect(gameboard.attackChart).toStrictEqual([ ["","",""],
                                                ["hit","","hit"],
                                                ["","",""]]);

  gameboard.receiveAttack(2, 1);

  expect(gameboard.attackChart).toStrictEqual([ ["","",""],
                                                ["hit","","hit"],
                                                ["","miss",""]]);
});

test("Gameboard reporst all ships sunk (or not)", () => {
  const ships = [
    {
      x: 1,
      y: 0,
      width: 3,
      height: 1,
    },
    {
      x: 2,
      y: 2,
      width: 1,
      height: 1,
    },
  ];

  const gameboard = GameboardFactory(ships, 4);
  expect(gameboard.attackChart).toStrictEqual([ ["","","",""],
                                                ["","","",""],
                                                ["","","",""],
                                                ["","","",""]]);

  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  gameboard.receiveAttack(2, 0);
  gameboard.receiveAttack(3, 0);
  expect(gameboard.attackChart).toStrictEqual([ ["miss","","",""],
                                                ["hit","","",""],
                                                ["hit","","",""],
                                                ["hit","","",""]]);
  expect(gameboard.allShipsSunk()).toBe(false);

  gameboard.receiveAttack(2, 2);
  expect(gameboard.attackChart).toStrictEqual([ ["miss","","",""],
                                                ["hit","","",""],
                                                ["hit","","hit",""],
                                                ["hit","","",""]]);
  expect(gameboard.allShipsSunk()).toBe(true);
});

test("Gameboard exposes ships' positions", () => {
  const ships = [
    {
      x: 1,
      y: 0,
      width: 3,
      height: 1,
    },
    {
      x: 2,
      y: 2,
      width: 1,
      height: 1,
    },
  ];

  const gameboard = GameboardFactory(ships, 4);

  expect(gameboard.shipsLocations).toStrictEqual(ships);
});

test("Gameboard exposes sunken ships' positions", () => {
  const ships = [
    {
      x: 1,
      y: 0,
      width: 3,
      height: 1,
    },
    {
      x: 2,
      y: 2,
      width: 1,
      height: 1,
    },
  ];

  const gameboard = GameboardFactory(ships, 4);

  gameboard.receiveAttack(1, 0);
  gameboard.receiveAttack(2, 0);
  gameboard.receiveAttack(3, 0);

  expect(gameboard.sunkShipsLocations).toStrictEqual([
    {
      x: 1,
      y: 0,
      width: 3,
      height: 1,
    }
  ]);
});

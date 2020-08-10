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

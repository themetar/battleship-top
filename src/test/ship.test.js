import ShipFactory from "../lib/ship";

test("Ship factory creates a ship object", () => {
  const shipLength = 4;
  const ship = ShipFactory(shipLength);

  expect(ship).toBeDefined();
  expect(ship.length).toBe(shipLength);
  expect(ship.hit).toBeInstanceOf(Function);
  expect(ship.isSunk).toBeInstanceOf(Function);
});

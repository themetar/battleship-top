import ShipFactory from "../lib/ship";

test("Ship factory creates a ship object", () => {
  const shipLength = 4;
  const ship = ShipFactory(shipLength);

  expect(ship).toBeDefined();
  expect(ship.length).toBe(shipLength);
  expect(ship.hit).toBeInstanceOf(Function);
  expect(ship.isSunk).toBeInstanceOf(Function);
});

describe("Ships get hit and can sink", () => {
  let ship, shipLength = 4;

  beforeEach(() => ship = ShipFactory(shipLength));

  test("Ship gets hit", () => {
    expect(() => {
      ship.hit(0);
      ship.hit(2);
    }).not.toThrow();
    
    expect(() => {
      ship.hit(-3);
    }).toThrow();

    expect(() => {
      ship.hit(10);
    }).toThrow();
  });

  test("Ship sinks", () => {
    for(let h = 0; h < shipLength; h++) {
      ship.hit(h);
    }
    expect(ship.isSunk()).toBe(true);
  });
});

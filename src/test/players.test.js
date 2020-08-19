import {AIPlayerFactory} from "../lib/players";
import GameboardFactory from "../lib/gameboard";

describe("AI player", () => {
  let gameboard;
  let player;

  beforeEach(() => {
    gameboard = GameboardFactory([], 4);
    player = AIPlayerFactory(gameboard);
  });
  
  test("AI Player selects a move", done => {
    player.onMove = attack => {
      expect(attack).toHaveProperty("x");
      expect(attack).toHaveProperty("y");

      done();
    };

    player.takeTurn();
  }); 

  test("AI player makes only valid moves", done => {
    const taken = [];
    let i = 0;

    const callback = attack => {
      expect(taken.find(a => a.x == attack.x && a.y == attack.y)).toBeUndefined(); // i.e to not be found
      taken.push(attack);
      i++;
      if (i < 16) {
        gameboard.receiveAttack(attack.x, attack.y);
        
        player.takeTurn();
      } else {
        done();
      }
    };

    player.onMove = callback;
    
    player.takeTurn();
  });
});

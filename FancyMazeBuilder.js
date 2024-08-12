import MazeBuilder from "/MazeBuilder.js"
import PowerUp from "./PowerUp.js";
import Monster from "./Monster.js";

export default class FancyMazeBuilder extends MazeBuilder {

    // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
    // Please acknowledge use of this code by including this header.
  
    constructor(width, height) {
  
      super(width, height);

      //This will store the sum of all monster levels
      this.cumulativeMonsterLevels = 0;
  
      this.placeMonsters();
      this.placePowerUps(50); //change this number to alter amount of PowerUps placed in maze?
      this.calculateKeyLocationAndPlaceKey();
      this.placeBoss(this.cumulativeMonsterLevels);
      this.surroundKeyWithWalls();
  
    }
  
    isA(value, ...cells) {
      return cells.every((array) => {
        let row, col;
        [row, col] = array;
        if((this.maze[row][col].length == 0) || !this.maze[row][col].includes(value)) {
          return false;
        }
        return true;
      });
    }
  
    placeMonsters() {
  
      this.maze.slice(2, -2).forEach((row, idx) => {
  
        let r = idx + 2;
  
        row.slice(2, -2).forEach((cell, idx) => {
  
          let c = idx + 2;
  
          if(!this.isA("wall", [r, c])) {
            return;
          }
  
          if(this.isA("wall", [r-1, c-1], [r-1, c], [r-1, c+1], [r+1, c]) && this.isGap([r+1, c-1], [r+1, c+1], [r+2, c])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r+1][c] = ["monster", monster];
          }
  
          if(this.isA("wall", [r-1, c+1], [r, c-1], [r, c+1], [r+1, c+1]) && this.isGap([r-1, c-1], [r, c-2], [r+1, c-1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r][c-1] = ["monster", monster];
          }
  
          if(this.isA("wall", [r-1, c-1], [r, c-1], [r+1, c-1], [r, c+1]) && this.isGap([r-1, c+1], [r, c+2], [r+1, c+1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r][c+1] = ["monster", monster];
          }
  
          if(this.isA("wall", [r-1, c], [r+1, c-1], [r+1, c], [r+1, c+1]) && this.isGap([r-1, c-1], [r-2, c], [r-1, c+1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r-1][c] = ["monster", monster];
          }
  
        });
  
      });

    }
  
    placePowerUps(percent = 100) {
  
      percent = parseInt(percent, 10);
  
      if((percent < 1) || (percent > 100)) {
        percent = 100;
      }
  
      this.maze.slice(1, -1).forEach((row, idx) => {
  
        let r = idx + 1;
  
        row.slice(1, -1).forEach((cell, idx) => {
  
          let c = idx + 1;
  
          if(!this.isA("wall", [r,c])) {
            return;
          }
  
          if(this.rand(1, 100) > percent) {
            return;
          }
  
          if(this.isA("wall", [r-1,c-1],[r-1,c],[r-1,c+1],[r+1,c-1],[r+1,c],[r+1,c+1]) ||
         this.isA("wall", [r-1,c-1],[r,c-1],[r+1,c-1],[r-1,c+1],[r,c+1],[r+1,c+1])) {
        // Create a new PowerUp object with a random factor value
        let randomPowerUpFactor = Math.floor(Math.random() * 2) + 2;
        const powerUp = new PowerUp(randomPowerUpFactor);
        this.maze[r][c].push(powerUp);
        }

        });

      });
    }
  
    

    /* this will place the Boss Monster right in front the key */
    //ISSUE!!! Boss is currently being placed ON THE KEY
    placeBoss(bossLevel) {

      let fr, fc;
      [fr, fc] = this.getKeyLocation();
      //console.log("key location in placeBoss():", [fr, fc])
      
      let boss = new Monster(bossLevel); //edit this to be based on ALL monster levels

      //Checks to make sure there's an empty spot next to the key to place the boss
      //TODO: Add extra checks to make sure key is "trapped" in a corner and you must get through the boss to get it
      if (this.maze[fr+1][fc].length === 0) {
        this.maze[fr+1][fc] = ["boss", boss];
      } else if (this.maze[fr-1][fc].length === 0) {
        this.maze[fr-1][fc] = ["boss", boss];
      } else if (this.maze[fr][fc+1].length === 0)  {
        this.maze[fr][fc+1] = ["boss", boss];
      } else if (this.maze[fr][fc-1].length === 0) {
        this.maze[fr][fc-1] = ["boss", boss];
      }

    }

}
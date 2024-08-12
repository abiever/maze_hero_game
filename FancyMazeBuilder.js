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
      this.placePowerUps(100);
      this.placeKey();
      this.placeBoss(this.cumulativeMonsterLevels);
  
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
        let randomPowerUpFactor = Math.floor(Math.random() * 4) + 2;
        const powerUp = new PowerUp(randomPowerUpFactor);
        this.maze[r][c].push(powerUp);
        }

        });

      });
    }
  
    // placeKey() {
  
    //   let fr, fc;
    //   [fr, fc] = this.getKeyLocation();
  
    //   if(this.isA("nubbin", [fr-1,fc-1]) && !this.isA("wall", [fr-1,fc-1])) {
    //     this.maze[fr-1][fc-1] = ["key"];
    //   } else if(this.isA("nubbin", [fr-1,fc+1]) && !this.isA("wall", [fr-1,fc+1])) {
    //     this.maze[fr-1][fc+1] = ["key"];
    //   } else if(this.isA("nubbin", [fr+1,fc-1]) && !this.isA("wall", [fr+1,fc-1])) {
    //     this.maze[fr+1][fc-1] = ["key"];
    //   } else if(this.isA("nubbin", [fr+1,fc+1]) && !this.isA("wall", [fr+1,fc+1])) {
    //     this.maze[fr+1][fc+1] = ["key"];
    //   } else {
    //     this.maze[fr][fc] = ["key"];
    //   }
  
    // }

    /* this will place the Boss Monster right in front the key */
    placeBoss(bossLevel) {

      let fr, fc;
      [fr, fc] = this.getKeyLocation();
      
      let boss = new Monster(bossLevel); //edit this to be based on ALL monster levels

      if(this.isA("nubbin", [fr-1,fc-1]) && !this.isA("wall", [fr-1,fc-1])) {
        this.maze[fr-2][fc-1] = ["boss", boss];
      } else if(this.isA("nubbin", [fr-1,fc+1]) && !this.isA("wall", [fr-1,fc+1])) {
        this.maze[fr-2][fc+1] = ["boss", boss];
      } else if(this.isA("nubbin", [fr+1,fc-1]) && !this.isA("wall", [fr+1,fc-1])) {
        this.maze[fr+2][fc-1] = ["boss", boss];
      } else if(this.isA("nubbin", [fr+1,fc+1]) && !this.isA("wall", [fr+1,fc+1])) {
        this.maze[fr+2][fc+1] = ["boss", boss];
      } else {
        this.maze[fr][fc] = ["boss", boss];

    }

  }
}
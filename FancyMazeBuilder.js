import MazeBuilder from "/MazeBuilder.js"
import PowerUp from "./PowerUp.js";
import Debuff from "./Debuff.js";
import Monster from "./Monster.js";

export default class FancyMazeBuilder extends MazeBuilder {

    // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
    // Please acknowledge use of this code by including this header.
  
    constructor(width, height) {
  
      super(width, height);

      //This will store the sum of all monster levels
      this.cumulativeMonsterLevels = 0;
      this.upperWarpSpot = null;
      this.lowerWarpSpot = null;
  
      this.placeMonsters();
      this.placePowerUps(50); //change this number to alter amount of PowerUps placed in maze?
      this.placeDebuffs(50);
      this.calculateKeyLocationAndPlaceKey();
      this.placeBoss(this.cumulativeMonsterLevels);
      this.surroundKeyWithWalls();
      this.placeWarpSpots(this.maze);
  
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
        // let randomPowerUpFactor = Math.floor(Math.random() * 2) + 2;
        // const powerUp = new PowerUp(randomPowerUpFactor);

        //Changed powerUp to just "2" to see how that affects balance
        const powerUp = new PowerUp(2);
        this.maze[r][c] = ["powerUp", powerUp];
        }

        });

      });
    }

    placeDebuffs(percent = 100) {
  
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

        //Use the Debuff object if you want more Debuff functionality options
        //const debuff = new Debuff(1/2);
        this.maze[r][c] = ["debuff"]
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

    placeWarpSpots(maze) {
      //Use this method to check for 2 empty squares that are completely surrounded by wall except for one side and contain nothing else and put a trap door there
      //This door will "warp" the hero from that spot to the other without costing a step 
      //trap door generation should be random, but generally on opposite ends of the maze and SHOULD NOT generate in front of a door or a corner 

      const directions = [
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 }   // right
      ];

      let validPositions = [];

      // Loop through the maze array
      for (let y = 0; y < maze.length; y++) {
          for (let x = 0; x < maze[y].length; x++) {
              // Check if the current cell is empty
              if (maze[y][x].length === 0) {
                  let wallCount = 0;

                  // Check all four directions
                  for (let direction of directions) {
                      const newX = x + direction.x;
                      //console.log("newX:", newX);
                      const newY = y + direction.y;
                      //console.log("newY:", newY);

                      // Ensure the new position is within the maze bounds
                      if (
                          newX >= 0 && newX < maze[y].length &&
                          newY >= 0 && newY < maze.length
                      ) {
                          // Check if the neighboring cell is a wall
                          if (maze[newY][newX].includes("wall")) {
                              wallCount++;
                          }
                      } else {
                          // If out of bounds, treat it as a wall (e.g., edges of the maze)
                          wallCount++;
                      }
                  }

                  // If the empty cell is surrounded by exactly 3 walls, it's a valid position
                  if (wallCount === 3) {
                      validPositions.push({ x, y });
                  }
              }
          }
      }

      //console.log("validPositions:", validPositions);
      //return validPositions;

      const mazeHeight = maze.length;
      const midPoint = Math.floor(mazeHeight / 2);

      // Separate validPositions into upper and lower half
      const upperHalf = validPositions.filter(position => position.y < midPoint);
      const lowerHalf = validPositions.filter(position => position.y >= midPoint);

      // Randomly select one position from each half
      const randomUpper = upperHalf[Math.floor(Math.random() * upperHalf.length)];
      const randomLower = lowerHalf[Math.floor(Math.random() * lowerHalf.length)];

      // Set the selected positions to "warp_spot"
      if (randomUpper) {
        maze[randomUpper.y][randomUpper.x] = ["warp_spot"];
        this.upperWarpSpot = [randomUpper.y, randomUpper.x];
        //console.log("upperWarpSpot:", this.upperWarpSpot);
      }
      if (randomLower) {
        maze[randomLower.y][randomLower.x] = ["warp_spot"];
        this.lowerWarpSpot = [randomLower.y, randomLower.x];
        //console.log("lowerWarpSpot:", this.lowerWarpSpot);
      }

    }

    getLowerWarpSpot() {
      return this.lowerWarpSpot;
    }

    getUpperWarpSpot() {
      return this.upperWarpSpot;
    }

}
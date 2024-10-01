import MazeBuilder from "/MazeBuilder.js"
import PowerUp from "./PowerUp.js";
import Position from "./Position.js";
import Monster from "./Monster.js";
import Boss from "./Boss.js";

export default class FancyMazeBuilder extends MazeBuilder {

    // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
    // Please acknowledge use of this code by including this header.
  
    constructor(width, height) {
  
      super(width, height);

      //This will store the sum of all monster levels
      this.cumulativeMonsterLevels = 0;
      this.upperWarpSpotA = null;
      this.lowerWarpSpotA = null;
      this.upperWarpSpotB = null;
      this.lowerWarpSpotB = null;

      this.monsters = [];
  
      this.placeMonsters();
      this.placePowerUps(50); //change this number to alter amount of PowerUps placed in maze?
      this.placeDebuffs(50);
      this.placeBoss(this.cumulativeMonsterLevels);
      this.placeWarpSpotsA(this.maze);
      this.placeWarpSpotsB(this.maze);
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
            //this shit is spaghetti AF; refactor??
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r+1][c] = ["monster", monster];
            let monsterPosition = new Position(r+1, c);
            monster.setMonsterPosition(monsterPosition);
            this.monsters.push(monster);
          }
  
          if(this.isA("wall", [r-1, c+1], [r, c-1], [r, c+1], [r+1, c+1]) && this.isGap([r-1, c-1], [r, c-2], [r+1, c-1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r][c-1] = ["monster", monster];
            let monsterPosition = new Position(r, c-1);
            monster.setMonsterPosition(monsterPosition);
            this.monsters.push(monster);
          }
  
          if(this.isA("wall", [r-1, c-1], [r, c-1], [r+1, c-1], [r, c+1]) && this.isGap([r-1, c+1], [r, c+2], [r+1, c+1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r][c+1] = ["monster", monster];
            let monsterPosition = new Position(r, c+1);
            monster.setMonsterPosition(monsterPosition);
            this.monsters.push(monster);
          }
  
          if(this.isA("wall", [r-1, c], [r+1, c-1], [r+1, c], [r+1, c+1]) && this.isGap([r-1, c-1], [r-2, c], [r-1, c+1])) {
            let randomMonsterLevel = Math.floor(Math.random() * 20) + 2;
            let monster = new Monster(randomMonsterLevel);
            this.cumulativeMonsterLevels += randomMonsterLevel;
            this.maze[r][c] = [];
            this.maze[r-1][c] = ["monster", monster];
            let monsterPosition = new Position(r-1, c);
            monster.setMonsterPosition(monsterPosition);
            this.monsters.push(monster);
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
  
    placeBoss(bossLevel) {
      
      let boss = new Boss(bossLevel);

      let fromEntrance = this.initArray();
      let fromExit = this.initArray();
  
      this.totalSteps = -1;
  
      for(let j = 1; j < this.cols-1; j++) {
        if(this.maze[this.rows-1][j].includes("entrance")) {
          this.countSteps(fromEntrance, this.rows-1, j, 0, "exit");
        }
        if(this.maze[0][j].includes("exit")) {
          this.countSteps(fromExit, 0, j, 0, "entrance");
        }
      }
  
      let fc = -1, fr = -1;
  
      this.maze.forEach((row, r) => {
        row.forEach((cell, c) => {
          if(typeof fromEntrance[r][c] == "undefined") {
            return;
          }
          let stepCount = fromEntrance[r][c] + fromExit[r][c];
          if(stepCount > this.totalSteps) {
            fr = r;
            fc = c;
            this.totalSteps = stepCount;
          }
        });
      });

      //set the maze's key location member
      this.keyLocation = [fr, fc];

      this.maze[fr][fc] = ["boss", boss];

      // Add the boss to the monsters array
      this.monsters.push(boss);
    }

    placeWarpSpotsA(maze) {
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
      const randomUpperA = upperHalf[Math.floor(Math.random() * upperHalf.length)];
      const randomLowerA = lowerHalf[Math.floor(Math.random() * lowerHalf.length)];

      // Set the selected positions to "warp_spot"
      if (randomUpperA) {
        maze[randomUpperA.y][randomUpperA.x] = ["warp_spot_a"];
        this.upperWarpSpotA = [randomUpperA.y, randomUpperA.x];
        //console.log("upperWarpSpot:", this.upperWarpSpot);
      }
      if (randomLowerA) {
        maze[randomLowerA.y][randomLowerA.x] = ["warp_spot_a"];
        this.lowerWarpSpotA = [randomLowerA.y, randomLowerA.x];
        //console.log("lowerWarpSpot:", this.lowerWarpSpot);
      }

    }

    placeWarpSpotsB(maze) {
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
      const randomUpperB = upperHalf[Math.floor(Math.random() * upperHalf.length)];
      const randomLowerB = lowerHalf[Math.floor(Math.random() * lowerHalf.length)];

      // Set the selected positions to "warp_spot_b"
      if (randomUpperB) {
        maze[randomUpperB.y][randomUpperB.x] = ["warp_spot_b"];
        this.upperWarpSpotB = [randomUpperB.y, randomUpperB.x];
        //console.log("upperWarpSpot:", this.upperWarpSpot);
      }
      if (randomLowerB) {
        maze[randomLowerB.y][randomLowerB.x] = ["warp_spot_b"];
        this.lowerWarpSpotB = [randomLowerB.y, randomLowerB.x];
        //console.log("lowerWarpSpot:", this.lowerWarpSpot);
      }

    }

    getLowerWarpSpotA() {
      return this.lowerWarpSpotA;
    }

    getUpperWarpSpotA() {
      return this.upperWarpSpotA;
    }

    getLowerWarpSpotB() {
      return this.lowerWarpSpotB;
    }

    getUpperWarpSpotB() {
      return this.upperWarpSpotB;
    }

    getMonsters() {
      return this.monsters;
    }
}
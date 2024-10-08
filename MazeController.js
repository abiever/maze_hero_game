import Hero from "./Hero.js";
import FancyMazeBuilder from "./FancyMazeBuilder.js";
import Position from "./Position.js";
import Timer from "./Timer.js";

export default class MazeController {
    constructor(
        id, 
        heroLevel, 
        stepsTaken, 
        gameLevel, 
        timer,
        objectsInMazeArray, 
        monstersArray, 
        warpPositionA1, 
        warpPositionA2,
        warpPositionB1,
        warpPositionB2
    ) {
        // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
        // Please acknowledge use of this code by including this header.

        this.mazeHero = new Hero(heroLevel);
        this.mazeHero.setHeroStepCount(stepsTaken);

        this.warpPositionA1 = warpPositionA1;
        this.warpPositionA2 = warpPositionA2;
        this.warpPositionB1 = warpPositionB1;
        this.warpPositionB2 = warpPositionB2;

        //The array passed from FancyMazeBuilder that contains all Monsters and their positions
        this.monstersArray = monstersArray;

        /* create timer */
        this.timer = timer;
        
        /* bind to HTML element */
        this.mazeContainer = document.getElementById(id);

        this.heroStepCounter = document.createElement("div");
        this.heroStepCounter.id = "step_counter";

        this.mazeMessage = document.createElement("div");
        this.mazeMessage.id = "maze_message";

        this.intervalTime = 1000;
        this.monstersInterval = 0

        //this.mazeHero.setHeroScore(this.mazeContainer.getAttribute("data-steps")); // removed "- 2" from here a few commits ago; doesn't seem necessary any more??

        this.maze = []; //This array contains the HTML elements composing the maze itself?
        this.objectsInMazeArray = objectsInMazeArray; //This array will contain the positions of where objects like PowerUps & Monsters are 

        this.beatLevel = false;
        this.gameLevel = gameLevel;

        this.ghostHeroHTML =  
        `<span class="ghost">
            <span class="heroValue">
                <span>${this.mazeHero.getHeroValue()}</span>
            </span>
            <span class="pulse">
                <span style="--i:0;"></span>
                <span style="--i:1;"></span>
                <span style="--i:2;"></span>
                <span style="--i:3;"></span>
            </span>
            <span class="ghost__eyes"></span>
            <span class="ghost__dimples"></span> 
        </span>`;
        
        var mazePosition;
        for (let i = 0; i < this.mazeContainer.children.length; i++) {
            for (let j = 0; j < this.mazeContainer.children[i].children.length; j++) {
                var el = this.mazeContainer.children[i].children[j];
                this.maze[new Position(i, j)] = el;
                if (el.classList.contains("entrance")) {
                    /* place hero on entrance square */
                    mazePosition = new Position(i, j);
                    this.mazeHero.setHeroPosition(mazePosition);
                    this.maze[this.mazeHero.getHeroPosition()].classList.add("hero");
                    /*trying some complicated stuff here to format the innerHTML by inserting a span inside template literals*/
                    //https://stackoverflow.com/questions/28458208/using-a-css-stylesheet-with-javascript-innerhtml

                    //ORIGINAL HERO
                    // this.maze[this.mazeHero.getHeroPosition()].innerHTML = `<span class="heroValue">${this.mazeHero.getHeroValue()}</span>`;
                    this.maze[this.mazeHero.getHeroPosition()].innerHTML = this.ghostHeroHTML;
                    
                }
            }
        }

        this.heroStepCounter = document.getElementById("step_counter");
        this.heroStepCounter.innerHTML = stepsTaken;
        // this.timer = document.getElementById("timer");
        this.levelCounter = document.getElementById("level_counter");
        this.levelCounter.innerHTML = gameLevel;
        this.mazeMessage = document.getElementById("maze_message");
        // this.minutesElement = document.getElementById("minutes");
        // this.secondsElement = document.getElementById("seconds");
        this.setMessage("...");

        this.startGameButton = document.getElementById("start_game_button");
        this.restartGameButton = document.getElementById("restart_game_button")

        this.mainMessage = document.getElementById("main_message");

        this.startGameButton.addEventListener("click", () => {
            this.startGame();
        });

        this.restartGameButton.addEventListener("click", () => {
            this.restartNewGame();
        });

        this.isFirstStepTaken = false;
        
    }

    startGame() {
        /* activate control keys */
        this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
        document.addEventListener("keydown", this.keyPressHandler, false);

        // * start interval to move Monsters
        this.monstersInterval = setInterval(() => this.monsterMovesHandler(this.monstersArray), this.intervalTime);
        //console.log("Original Monsters Array:", this.monstersArray)
        this.startGameButton.style.display = 'none';
        this.mainMessage.style.display = 'none';
        this.timer.start();

        // Play game music
        //*****TODO: Make music/sfx a part of constructor members */
        // const gameMusic = document.getElementById("game-music");
        // if (gameMusic) {
        //     gameMusic.play();
        // }
    }

    setMessage(text) {
        /* display message on screen */
        this.mazeMessage.innerHTML = text;
    }

    updateStepCounterDisplay() {
        this.heroStepCounter.innerHTML = this.mazeHero.getHeroStepCount();
    }

    //Use this method to see if the Hero can beat the monster
    canHeroBeatMonster(monsterLevel) {
        return this.mazeHero.getHeroValue() > monsterLevel;
    }

    updateGhostHeroHTML() {
        this.ghostHeroHTML = `<span class="ghost">
            <span class="heroValue">
                <span>${this.mazeHero.getHeroValue()}</span>
            </span>
            <span class="pulse">
                <span style="--i:0;"></span>
                <span style="--i:1;"></span>
                <span style="--i:2;"></span>
                <span style="--i:3;"></span>
            </span>
            <span class="ghost__eyes"></span>
            <span class="ghost__dimples"></span> 
        </span>`;
    }    

    heroGetPowerUp(powerUpAtPosition) {
        /* Have Hero's value increase by PowerUp's factor */
        this.mazeHero.powerUpHero(powerUpAtPosition)
    }

    defeatBoss() {
        //this.maze[this.mazeHero.getHeroPosition()].classList.remove("boss");
        this.setMessage("You defeated the boss! The exit is now unlocked.");
        this.unlockExit();
    }
    
    //****EXPLANATION OF ITERATION FOR UNLOCKING EXIT******/
    // The reason this.maze.length is returning 0 despite having many elements is because the object is using non-standard indexing. Instead of using consecutive integer indices (0, 1, 2, ...), it's using string keys in the format "row:column" (like "0:0", "0:1", etc.).
    // This explains why standard array methods and properties (like length) aren't working as expected.
    // To work with this structure, you'll need to use object methods rather than array methods. Here's how you can modify your unlockExit method to work with this structure:
    unlockExit() {
        // Iterate over all properties of this.maze
        for (let key in this.maze) {
            // Check if the property is an object property (not inherited)
            if (this.maze.hasOwnProperty(key)) {
                let cell = this.maze[key];
                // Check if the cell is the exit
                if (cell.classList && cell.classList.contains("exit")) {
                    // Remove the 'locked' class
                    cell.classList.remove("locked");
                    // Remove background
                    cell.style.background = "none";
                    console.log("Exit unlocked");
                    break;
                }
            }
        }
    }

    gameOver(text) {
        /* de-activate control keys */
        document.removeEventListener("keydown", this.keyPressHandler, false);
        clearInterval(this.monstersInterval);
        this.setMessage(text);
        this.timer.stop();
        this.mazeContainer.classList.add("game_over");

        this.mainMessage.innerHTML = "GAME OVER";
        this.mainMessage.style.display = "block";

        this.restartGameButton.style.display = "block";
    }

    levelCompleted(text) {
        /* de-activate control keys */
        document.removeEventListener("keydown", this.keyPressHandler, false);
        clearInterval(this.monstersInterval);
        this.timer.stop();
        this.setMessage(text);
        this.mazeContainer.classList.add("finished");
        this.beatLevel = true;
        this.gameLevel += 1;
    }

    getGameLevel() {
        return this.gameLevel;
    }

    isLevelBeaten() {
        return this.beatLevel;
    }

    startNextLevelCountdown(seconds) {
        let countdownSeconds = seconds;
    
        // Create or update the countdown message
        //let countdownElement = document.getElementById('countdown_message');
    
        const countdownTimer = setInterval(() => {
            //countdownElement.textContent = `Next level will begin in ${countdownSeconds}...`;
            //console.log(countdownSeconds);
            countdownSeconds--;
    
            if (countdownSeconds < 0) {
                clearInterval(countdownTimer);
                //countdownElement.textContent = ''; // Clear the countdown message
    
                // Start the next level
                this.startNextLevel();
            }
        }, 1000); // Update every second (1 second interval)
    }
    

    decideHeroVictory() {

        if (this.mazeHero.getHeroStepCount() > this.mazeHero.getHeroValue()) {
            this.gameOver("You have lost. Steps exceeded Hero level.")
        } else { 
            this.mainMessage.innerHTML = `Level ${this.getGameLevel()} Completed`
            this.mainMessage.style.display = 'block';
            this.levelCompleted("Level Completed");
            //wait for the given seconds, then start next level
            this.startNextLevelCountdown(1);
        }
    }

    tryMoveHero(position) {
        if ("object" !== typeof this.maze[position]) {
            return;
        }

        var nextStep = this.maze[position].className;

        /* make checks before moving to inhibit illegal moves*/
        if (nextStep.match(/wall/)) {
            // console.log("That's a wall!");
            return;
        }

        if (nextStep.match(/exit/)) {
            if (!this.maze[position].classList.contains("locked")) {
                this.decideHeroVictory();
            } else {
                // this.setMessage("You need to defeat the boss to unlock the exit!");
                //console.log("nextStep:", nextStep.className);
                return;
            }
        }

        /* NOTE: I had to 'separate' the 2 steps for what happens when a match with 'powerUp' is found */
        //1) getPowerUpFactor
        //Between) Hero moves
        //2) remove className of 'powerUp' so that the emoji disappears right when the Hero moves onto that square
        if (nextStep.match(/powerUp/)) {
            this.heroGetPowerUp(this.objectsInMazeArray[position.x][position.y][1].getPowerUpFactor());
            this.updateGhostHeroHTML();
        }

        if (nextStep.match(/debuff/)) {
            this.mazeHero.halveHeroValue();
            this.updateGhostHeroHTML();
        }

        if (nextStep.match(/monster/)) {
            //don't allow movement onto monster if Hero is weaker than
            if (!this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                return;
            }
            //allow Hero to defeat monster and take its level
            if (this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                this.mazeHero.increaseHeroValue(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())

                this.updateGhostHeroHTML();

                let defeatedMonster = this.objectsInMazeArray[position.x][position.y][1];
                this.objectsInMazeArray[position.x][position.y].length = 0;
                // Remove the defeated monster from the monsters array
                this.monstersArray = this.monstersArray.filter(monster => monster !== defeatedMonster);
                //console.log("Updated Monsters Array:", this.monstersArray);
            }
        }

        //This is a little too spaghetti code — consider consolidating!
        if (nextStep.match(/boss/)) {
            if (this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                this.mazeHero.increaseHeroValue(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel());
                this.updateGhostHeroHTML();
                this.defeatBoss();
                this.objectsInMazeArray[position.x][position.y].length = 0;
            } else {
                this.setMessage("You're not strong enough to defeat the boss yet!");
                return;
            }
        }

        //****POTENTIAL ISSUE!!*******/
        //ISSUE (8/17/24): It appears that the objectsInMazeArray is never actually updated with the Hero's actual position, and his position is simply updated within his own object instance and is where that state is maintained/updated. However, this may become an issue later?

        /* move hero one step by removing him, then adding him to another position with his vurrent value */
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("hero");
        this.maze[this.mazeHero.getHeroPosition()].innerHTML = "";
        this.maze[position].classList.add("hero");
        this.mazeHero.setHeroPosition(position);
        //ORIGINAL HERO
        // this.maze[position].innerHTML = `<span class="heroValue">${this.mazeHero.getHeroValue()}</span>`;

        this.maze[this.mazeHero.getHeroPosition()].innerHTML = this.ghostHeroHTML;

        if (this.isFirstStepTaken === false) {
            this.isFirstStepTaken = true;
            this.replaceEntranceWithWall();
        }

        /* warp to other spot if available */
        if (nextStep.match(/warp_spot_a/)) {
            const currentWarpPosition = this.mazeHero.getHeroPosition();
            const warpTarget = this.getWarpTargetA(currentWarpPosition);

            if (warpTarget) {
                this.maze[currentWarpPosition].classList.remove("hero");
                this.maze[currentWarpPosition].innerHTML = "";

                this.maze[warpTarget].classList.add("hero");
                this.mazeHero.setHeroPosition(warpTarget);
                this.maze[warpTarget].innerHTML = this.maze[this.mazeHero.getHeroPosition()].innerHTML = this.ghostHeroHTML;
            }
        }

        if (nextStep.match(/warp_spot_b/)) {
            const currentWarpPosition = this.mazeHero.getHeroPosition();
            const warpTarget = this.getWarpTargetB(currentWarpPosition);

            if (warpTarget) {
                this.maze[currentWarpPosition].classList.remove("hero");
                this.maze[currentWarpPosition].innerHTML = "";  

                this.maze[warpTarget].classList.add("hero");
                this.mazeHero.setHeroPosition(warpTarget);
                this.maze[warpTarget].innerHTML = this.maze[this.mazeHero.getHeroPosition()].innerHTML = this.ghostHeroHTML;
            }
        }


        /* check what was stepped on || remove element from display */
        if (nextStep.match(/monster/)) {
            this.maze[this.mazeHero.getHeroPosition()].classList.remove("monster");
            this.objectsInMazeArray[position.x][position.y].length = 0;
            return;
        }

        if (nextStep.match(/boss/)) {
            this.maze[this.mazeHero.getHeroPosition()].classList.remove("boss");
            return;
        }

        if (nextStep.match(/powerUp/)) {
            this.maze[this.mazeHero.getHeroPosition()].classList.remove("powerUp");
            return;
        }

        if (nextStep.match(/debuff/)) {
            this.maze[this.mazeHero.getHeroPosition()].classList.remove("debuff");
            return;
        }
        

        if (nextStep.match(/exit/)) {
            return;
        }

        this.mazeHero.increaseHeroStepCount();

        this.updateStepCounterDisplay();
    }

    replaceEntranceWithWall() {
        for (let key in this.maze) {
            if (this.maze.hasOwnProperty(key)) {
                let cell = this.maze[key];
                if (cell.classList && cell.classList.contains("entrance")) {
                    // Remove the entrance class
                    cell.classList.remove("entrance");
                    // Add the wall class
                    cell.classList.add("wall");
                    break;
                }
            }
        }
    }

    mazeKeyPressHandler(e) {
        var tryPosition = new Position(this.mazeHero.getHeroPosition().x, this.mazeHero.getHeroPosition().y);

        switch (e.key) {
            case "ArrowLeft":
                this.mazeContainer.classList.remove("face-right");
                tryPosition.y--;
                break;

            case "ArrowUp":
                tryPosition.x--;
                break;

            case "ArrowRight":
                this.mazeContainer.classList.add("face-right");
                tryPosition.y++;
                break;

            case "ArrowDown":
                tryPosition.x++;
                break;

            default:
                return;
        }

        this.tryMoveHero(tryPosition);

        e.preventDefault();
    }

    setChildMode() {
        this.mazeHero.childMode = true;
        this.mazeHero.setHeroScore(0);
        this.setMessage("collect all the treasure");
    }

    tryMoveMonster(monster, position) {

            if ("object" !== typeof this.maze[monster.getMonsterPosition()]) {
                return;
            }

            var nextStep = this.maze[position].className;

            /* make checks before moving to inhibit illegal moves*/
            if (nextStep.match(/wall/)) {
                return;
            }

            if (nextStep.match(/warp_spot/)) {
                return;
            }

            if (nextStep.match(/entrance/)) {
                return;
            }

            if (nextStep.match(/exit/)) {
                return
            }

            if (nextStep.match(/boss/)) {
                return
            }

            if (nextStep.match(/powerUp/)) {
                return;
            }

            if (nextStep.match(/monster/)) {
                return
            }

            if (nextStep.match(/debuff/)) {
                return;
            }

            if (nextStep.match(/hero/)) {
                if (monster.getMonsterLevel() > this.mazeHero.getHeroValue()) {
                    this.gameOver("You got eaten by a monster!")
                    console.log("eatten by" + monster)
                } 
                else return;
            }

            //****IMPORTANT!*****//
            //It is/was necessary to update objectsInMazeArray with each Monster's new position so that Monster methods/members can be accessed after they move.

            /* move Monster one step by removing it, then adding it to another position with his its value */
            this.maze[monster.getMonsterPosition()].classList.remove("monster");
            this.maze[monster.getMonsterPosition()].innerHTML = "";
            this.objectsInMazeArray[monster.getMonsterPosition().x][monster.getMonsterPosition().y].length = 0;
            this.maze[position].classList.add("monster");
            monster.setMonsterPosition(position);
            this.maze[position].innerHTML = 
                `
                <div class="monster-container">
                    <span class="monsterValue">${monster.getMonsterLevel()}</span>
                    <span class="monster">
                    <span class="monster__eyes"></span>
                    </span>
                </div>
                `;
            this.objectsInMazeArray[position.x][position.y] = ["monster", monster];
            

            if (nextStep.match(/warp_spot/)) {
                return;
            }

            if (nextStep.match(/debuff/)) {
                return;
            }

            if (nextStep.match(/monster/)) {
                return;
            }

            if (nextStep.match(/boss/)) {
                return;
            }

            if (nextStep.match(/powerUp/)) {
                return;
            }

            if (nextStep.match(/debuff/)) {
                return;
            }
            
            if (nextStep.match(/key/)) {
                return;
            }

            if (nextStep.match(/exit/)) {
                return;
            }

    }

    monsterMovesHandler(monsters) {

        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
          ];

        monsters.forEach((monster) => {
    
            //let validPositions = []; //I may not need this for this purpose?

            //Randomly choose one of the above directions 
            let randomDirectionIdx = Math.floor(Math.random() * directions.length);
    
            //const prevPosition = monster.getMonsterPosition(); //may not need this either? 

            var tryPosition = new Position(
                    monster.getMonsterPosition().x + directions[randomDirectionIdx].x, 
                    monster.getMonsterPosition().y + directions[randomDirectionIdx].y
                );
    
            this.tryMoveMonster(monster, tryPosition);
    
        });

    }

    getWarpTargetA(currentPosition) {
        const [currentX, currentY] = [currentPosition.x, currentPosition.y];
        const lowerWarpSpotA = this.warpPositionA2; // Get the lower warp spot
        const upperWarpSpotA = this.warpPositionA1; // Get the upper warp spot
    
        // Check if the Hero is on the upper warp spot, then warp to the lower one
        if (currentX === upperWarpSpotA[0] && currentY === upperWarpSpotA[1]) {
            return new Position(lowerWarpSpotA[0], lowerWarpSpotA[1]);
        }
        
        // Check if the Hero is on the lower warp spot, then warp to the upper one
        if (currentX === lowerWarpSpotA[0] && currentY === lowerWarpSpotA[1]) {
            return new Position(upperWarpSpotA[0], upperWarpSpotA[1]);
        }
    
        return null;
    }

    getWarpTargetB(currentPosition) {
        const [currentX, currentY] = [currentPosition.x, currentPosition.y];
        const lowerWarpSpotB = this.warpPositionB2; // Get the lower warp spot
        const upperWarpSpotB = this.warpPositionB1; // Get the upper warp spot
    
        // Check if the Hero is on the upper warp spot, then warp to the lower one
        if (currentX === upperWarpSpotB[0] && currentY === upperWarpSpotB[1]) {
            return new Position(lowerWarpSpotB[0], lowerWarpSpotB[1]);
        }
        
        // Check if the Hero is on the lower warp spot, then warp to the upper one
        if (currentX === lowerWarpSpotB[0] && currentY === lowerWarpSpotB[1]) {
            return new Position(upperWarpSpotB[0], upperWarpSpotB[1]);
        }
    
        return null;
    }

    restartNewGame() {
        this.timer.reset();
        let width = 8;
        let height = 8;

        let newMaze = new FancyMazeBuilder(width, height);
        newMaze.display("maze_container");
        let newObjectsInMazeArray = newMaze.returnMazeBuilderArray();
        let newMonstersArray = newMaze.getMonsters();
        let newHeroLevel = 10;
        let newHeroStepCount = 0;
        let newGameLevel = 1;

        let newMazeGame = new MazeController(
            "maze",
            newHeroLevel,
            newHeroStepCount,
            newGameLevel,
            new Timer(),
            newObjectsInMazeArray,
            newMonstersArray,
            newMaze.getUpperWarpSpotA(),
            newMaze.getLowerWarpSpotA(),
            newMaze.getUpperWarpSpotB(),
            newMaze.getLowerWarpSpotB()
        )

        this.restartGameButton.style.display = 'none';
        this.mainMessage.style.display = 'none';

        newMazeGame.startGame();
    }

    startNextLevel() {
    
        // Generate a new, larger maze for the next level
        // const newWidth = Math.ceil(this.objectsInMazeArray[0].length / 2) + 2; // Increase width
        // const newHeight = Math.ceil(this.objectsInMazeArray.length / 2) + 2; // Increase height

        const newWidth = 8;
        const newHeight = 8;
    
        // Create and display the new maze
        let newMaze = new FancyMazeBuilder(newWidth, newHeight);
        newMaze.display("maze_container");
        let newObjectsInMazeArray = newMaze.returnMazeBuilderArray();

        // Grab next Monsters array from new maze
        let newMonstersArray = newMaze.getMonsters();

        //make new Hero's level his value - steps taken
        let newHeroLevel = this.mazeHero.getHeroValue() - this.mazeHero.getHeroStepCount();
    
        // Re-initialize the MazeController with the new maze
        let newMazeGame = new MazeController(
            "maze", 
            newHeroLevel, 
            this.mazeHero.getHeroStepCount(), 
            this.getGameLevel(),
            this.timer,
            newObjectsInMazeArray, 
            newMonstersArray,
            newMaze.getUpperWarpSpotA(), 
            newMaze.getLowerWarpSpotA(),
            newMaze.getUpperWarpSpotB(),
            newMaze.getLowerWarpSpotB()
        );
    
        newMazeGame.startGame();
    }
    
}
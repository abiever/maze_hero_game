import Hero from "./Hero.js";
import FancyMazeBuilder from "./FancyMazeBuilder.js";

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return this.x + ":" + this.y;
    }
}

export default class MazeController {
    constructor(id, heroLevel, objectsInMazeArray) {
        // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
        // Please acknowledge use of this code by including this header.

        this.mazeHero = new Hero(heroLevel);

        /* bind to HTML element */
        this.mazeContainer = document.getElementById(id);

        this.heroStepCounter = document.createElement("div");
        this.heroStepCounter.id = "step_counter";

        this.mazeMessage = document.createElement("div");
        this.mazeMessage.id = "maze_message";

        //this.mazeHero.setHeroScore(this.mazeContainer.getAttribute("data-steps")); // removed "- 2" from here a few commits ago; doesn't seem necessary any more??

        this.maze = []; //This array contains the HTML elements composing the maze itself?
        this.objectsInMazeArray = objectsInMazeArray; //This array will contain the positions of where objects like PowerUps are 

        this.gameOver = false;
        this.beatLevel = false;
        this.gameLevel = 1;

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
                    this.maze[this.mazeHero.getHeroPosition()].innerHTML = `<span class="heroValue">${this.mazeHero.getHeroValue()}</span>`;
                }
            }
        }

        var mazeOutputDiv = document.createElement("div");
        mazeOutputDiv.id = "maze_output";

        mazeOutputDiv.appendChild(this.heroStepCounter);
        mazeOutputDiv.appendChild(this.mazeMessage);

        mazeOutputDiv.style.width = this.mazeContainer.scrollWidth + "px";
        this.setMessage("first find the key");

        this.mazeContainer.insertAdjacentElement("afterend", mazeOutputDiv);

        /* activate control keys */
        this.keyPressHandler = this.mazeKeyPressHandler.bind(this);
        document.addEventListener("keydown", this.keyPressHandler, false);
    }

    setMessage(text) {
        /* display message on screen */
        this.mazeMessage.innerHTML = text;
        /* changed the below to 'step count'. Refactor names for better readability */
        this.heroStepCounter.innerHTML = this.mazeHero.getHeroStepCount();
    }

    //Use this method to see if the Hero can beat the monster
    canHeroBeatMonster(monsterLevel) {
        return this.mazeHero.getHeroValue() > monsterLevel;
    }

    heroGetPowerUp(powerUpAtPosition) {
        /* Have Hero's value increase by PowerUp's factor */
        this.mazeHero.powerUpHero(powerUpAtPosition)
    }

    heroTakeKey() {
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("key");
        this.mazeHero.setHeroHasKey(true);
        this.heroStepCounter.classList.add("has-key");
        this.setMessage("you now have the key!");
    }

    levelCompleted(text) {
        /* de-activate control keys */
        document.removeEventListener("keydown", this.keyPressHandler, false);
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

    heroWins() {
        this.heroStepCounter.classList.remove("has-key");
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("door");
        this.levelCompleted("Level Completed");
    
        // Wait for a moment and then start the next level
        setTimeout(() => {
            this.startNextLevel();
        }, 3000); // 3 seconds delay before the next level
    }

    tryMoveHero(position) {
        if ("object" !== typeof this.maze[position]) {
            return;
        }

        var nextStep = this.maze[position].className;

        /* make checks before moving to inhibit illegal moves*/
        if (nextStep.match(/wall/)) {
            return;
        }

        if (nextStep.match(/exit/)) {
            if (this.mazeHero.hasKey()) {
                this.heroWins();
            } else {
                this.setMessage("you need a key to unlock the door");
                return;
            }
        }

        /* NOTE: I had to 'separate' the 2 steps for what happens when a match with 'powerUp' is found */
        //1) getPowerUpFactor
        //Between) Hero moves
        //2) remove className of 'powerUp' so that the emoji disappears right when the Hero moves onto that square
        if (nextStep.match(/powerUp/)) {
            this.heroGetPowerUp(this.objectsInMazeArray[position.x][position.y][1].getPowerUpFactor());
        }

        if (nextStep.match(/monster/)) {
            //don't allow movement onto monster if Hero is weaker than
            if (!this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                return;
            }
            //allow Hero to defeat monster and take its level
            if (this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                this.mazeHero.increaseHeroValue(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())
            }
        }

        //This is a little too spaghetti code — consider consolidating!
        if (nextStep.match(/boss/)) {
            //don't allow movement onto boss if Hero is weaker than
            if (!this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                return;
            }
            //allow Hero to defeat monster and take its level
            if (this.canHeroBeatMonster(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())) {
                this.mazeHero.increaseHeroValue(this.objectsInMazeArray[position.x][position.y][1].getMonsterLevel())
            }
        }

        /* move hero one step by removing him, then adding him to another position with his vurrent value */
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("hero");
        this.maze[this.mazeHero.getHeroPosition()].innerHTML = "";
        this.maze[position].classList.add("hero");
        this.mazeHero.setHeroPosition(position);
        this.maze[position].innerHTML = `<span class="heroValue">${this.mazeHero.getHeroValue()}</span>`;

        /* check what was stepped on || remove element from display */
        if (nextStep.match(/monster/)) {
            this.maze[this.mazeHero.getHeroPosition()].classList.remove("monster");
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
        
        if (nextStep.match(/key/)) {
            this.heroTakeKey();
            return;
        }

        if (nextStep.match(/exit/)) {
            return;
        }

        this.mazeHero.increaseHeroStepCount();

        this.setMessage("...");
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

    //Use this to check the contents of the MazeControllerArray
    // returnMazeControllerMaze() {
    //     console.log("MazeControllerMazeArray:", this.maze);
    //     return this.maze;
    // }

    restartNewGame() {
        //eventually use this method to restart a new game from the beginning 
    }

    startNextLevel() {
    
        // Generate a new, larger maze for the next level
        const newWidth = Math.ceil(this.objectsInMazeArray[0].length / 2) + 2; // Increase width
        const newHeight = Math.ceil(this.objectsInMazeArray.length / 2) + 2; // Increase height
    
        // Create and display the new maze
        let Maze = new FancyMazeBuilder(newWidth, newHeight);
        Maze.display("maze_container");
        this.objectsInMazeArray = Maze.returnMazeBuilderArray();

        //make new Hero's level his value - steps taken
        let newHeroLevel = this.mazeHero.getHeroValue() - this.mazeHero.getHeroStepCount();
    
        // Re-initialize the MazeController with the new maze
        let newMazeGame = new MazeController("maze", newHeroLevel, this.objectsInMazeArray);
    
        this.setMessage("New Level! Good luck!");
    }
    
}

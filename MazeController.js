import Hero from "./Hero.js";
import PowerUp from "./PowerUp.js";

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return this.x + ":" + this.y;
    }
}

//TODO: I may need to bundle everything with node/npm to get rid of the "Unexpected token 'export'" error in browser

export default class MazeController {
    constructor(id, objectsInMazeArray) {
        // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
        // Please acknowledge use of this code by including this header.

        this.mazeHero = new Hero(5);

        /* bind to HTML element */
        this.mazeContainer = document.getElementById(id);

        this.mazeScore = document.createElement("div");
        this.mazeScore.id = "maze_score";

        this.mazeMessage = document.createElement("div");
        this.mazeMessage.id = "maze_message";

        this.mazeHero.setHeroScore(this.mazeContainer.getAttribute("data-steps") - 2);

        this.maze = []; //This array contains the HTML elements composing the maze itself?
        this.objectsInMazeArray = objectsInMazeArray; //This array will contain the positions of where objects like PowerUps are 

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

        mazeOutputDiv.appendChild(this.mazeScore);
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
        this.mazeScore.innerHTML = this.mazeHero.getHeroScore();
    }

    heroTakeTreasure() {
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("nubbin");
        this.mazeHero.increaseScore(10);
        this.setMessage("yay, treasure!");
    }

    //Use this method to see if the Hero can beat the monster
    heroFightMonster() {
        //Have the Hero's value compared to the monster's value
        //if it is greater, eat the monster
        //Eventually, add a consequence??
    }

    heroGetPowerUp(powerUpAtPosition) {
        /* Have Hero's value increase by PowerUp's factor */
        this.mazeHero.powerUpHero(powerUpAtPosition)
    }

    heroTakeKey() {
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("key");
        this.mazeHero.setHeroHasKey(true);
        this.mazeHero.increaseScore(20);
        this.mazeScore.classList.add("has-key");
        this.setMessage("you now have the key!");
    }

    gameOver(text) {
        /* de-activate control keys */
        document.removeEventListener("keydown", this.keyPressHandler, false);
        this.setMessage(text);
        this.mazeContainer.classList.add("finished");
    }

    heroWins() {
        this.mazeScore.classList.remove("has-key");
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("door");
        this.mazeHero.increaseScore(50);
        this.gameOver("you finished !!!");
    }

    tryMoveHero(position) {
        if ("object" !== typeof this.maze[position]) {
            return;
        }

        var nextStep = this.maze[position].className;

        /* before moving */
        // if (nextStep.match(/powerUp/)) {

        //     // this.heroGetPowerUp(this.maze[position].getPowerUpFactor())

            
        //     return;
        //     // /* defeat monster if hero's value greater */
        //     // // if (this.mazeHero.getHeroValue() > /* this.monster.getValue() */) {

        //     // // }
        //     // /* ran into a monster - lose points */
        //     // this.mazeHero.decreaseScore(5);

        //     // if (!this.mazeHero.childMode && (this.mazeHero.getHeroScore() <= 0)) {
        //     //     /* game over */
        //     //     this.gameOver("sorry, you didn't make it.");
        //     // } else {
        //     //     this.setMessage("ow, that hurt!");
        //     // }

        //     // return;
        // }

        if (nextStep.match(/powerUp/)) {

            // console.log(this.maze[position] instanceof PowerUp);
            // return;
            console.log(true, position);
            console.log(this.objectsInMazeArray[position.x][position.y][1].getPowerUpFactor());
            // console.log(nextStep);
            //NOTE FOR DEBUGGING
            //The MazeBuilderArray and MazeControllerArray appear to be 1:1 with position for objects/classes, I just need some way to "bridge" access of methods.
            //Perhaps "export" the MazeBuilderArray so that it's accessible where I need it?
            return 0;
        }

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

        /* move hero one step by removing him, then adding him to another position with his vurrent value */
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("hero");
        this.maze[this.mazeHero.getHeroPosition()].innerHTML = "";
        this.maze[position].classList.add("hero");
        this.mazeHero.setHeroPosition(position);
        this.maze[position].innerHTML = `<span class="heroValue">${this.mazeHero.getHeroValue()}</span>`;

        /* check what was stepped on */
        if (nextStep.match(/nubbin/)) {
            console.log(this.maze[position])
            this.heroTakeTreasure();
            return;
        }

        if (nextStep.match(/key/)) {
            this.heroTakeKey();
            return;
        }

        if (nextStep.match(/exit/)) {
            return;
        }

        if ((this.mazeHero.getHeroScore() >= 1) && !this.mazeHero.childMode) {
            this.mazeHero.decreaseScore(1);

            if (this.mazeHero.getHeroScore() <= 0) {
                /* game over */
                this.gameOver("sorry, you didn't make it");
                return;
            }
        }

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

    // returnPowerUpIndex() {
    //     return this.maze.indexOf()
    // }

    returnMazeControllerMaze() {
        console.log("MazeControllerMazeArray:", this.maze);
        return this.maze;
    }
}

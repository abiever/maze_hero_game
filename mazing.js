import Hero from "./Hero.js"

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

export default class Mazing {
    constructor(id) {
        // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
        // Please acknowledge use of this code by including this header.

        this.mazeHero = new Hero(5);

        /* bind to HTML element */
        this.mazeContainer = document.getElementById(id);

        this.mazeScore = document.createElement("div");
        this.mazeScore.id = "maze_score";

        this.mazeMessage = document.createElement("div");
        this.mazeMessage.id = "maze_message";

        this.mazeHero.setHeroScore = this.mazeContainer.getAttribute("data-steps") - 2;

        this.maze = [];
        // this.heroPos = {};
        // this.heroHasKey = false;
        // this.childMode = false;

        var mazePosition;
        for (let i = 0; i < this.mazeContainer.children.length; i++) {
            for (let j = 0; j < this.mazeContainer.children[i].children.length; j++) {
                var el = this.mazeContainer.children[i].children[j];
                this.maze[new Position(i, j)] = el;
                if (el.classList.contains("entrance")) {
                    /* place hero on entrance square */
                    // this.heroPos = new Position(i, j);
                    mazePosition = new Position(i, j);
                    this.mazeHero.setHeroPosition(mazePosition);
                    this.maze[this.mazeHero.getHeroPosition()].classList.add("hero");
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
        this.mazeScore.innerHTML = this.heroScore;
    }

    heroTakeTreasure() {
        this.maze[this.heroPos].classList.remove("nubbin");
        this.heroScore += 10;
        this.setMessage("yay, treasure!");
    }

    heroTakeKey() {
        this.maze[this.heroPos].classList.remove("key");
        this.heroHasKey = true;
        this.heroScore += 20;
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
        this.maze[this.heroPos].classList.remove("door");
        this.heroScore += 50;
        this.gameOver("you finished !!!");
    }
    tryMoveHero(pos) {

        if ("object" !== typeof this.maze[pos]) {
            return;
        }

        var nextStep = this.maze[pos].className;

        /* before moving */
        if (nextStep.match(/sentinel/)) {
            /* ran into a monster - lose points */
            this.heroScore = Math.max(this.heroScore - 5, 0);

            if (!this.childMode && (this.heroScore <= 0)) {
                /* game over */
                this.gameOver("sorry, you didn't make it.");
            } else {
                this.setMessage("ow, that hurt!");
            }

            return;
        }

        if (nextStep.match(/wall/)) {
            return;
        }

        if (nextStep.match(/exit/)) {
            if (this.heroHasKey) {
                this.heroWins();
            } else {
                this.setMessage("you need a key to unlock the door");
                return;
            }
        }

        /* move hero one step */
        this.maze[this.mazeHero.getHeroPosition()].classList.remove("hero");
        this.maze[pos].classList.add("hero");
        this.mazeHero.setHeroPosition(pos);

        /* check what was stepped on */
        if (nextStep.match(/nubbin/)) {
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

        if ((this.heroScore >= 1) && !this.childMode) {

            this.heroScore--;

            if (this.heroScore <= 0) {
                /* game over */
                this.gameOver("sorry, you didn't make it");
                return;
            }

        }

        this.setMessage("...");

    }
    mazeKeyPressHandler(e) {

        // var tryPos = new Position(this.heroPos.x, this.heroPos.y);
        var tryPos = new Position(this.mazeHero.getHeroPosition().x, this.mazeHero.getHeroPosition().y);

        switch (e.key) {
            case "ArrowLeft":
                this.mazeContainer.classList.remove("face-right");
                tryPos.y--;
                break;

            case "ArrowUp":
                tryPos.x--;
                break;

            case "ArrowRight":
                this.mazeContainer.classList.add("face-right");
                tryPos.y++;
                break;

            case "ArrowDown":
                tryPos.x++;
                break;

            default:
                return;

        }

        this.tryMoveHero(tryPos);

        e.preventDefault();
    }
    setChildMode() {
        this.childMode = true;
        this.heroScore = 0;
        this.setMessage("collect all the treasure");
    }
}










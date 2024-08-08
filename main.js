import FancyMazeBuilder from "/FancyMazeBuilder.js";
import Mazing from "./mazing.js"; //Don't forget capital 'M'?

var Maze, MazeGame;
      
        const makeMaze = (id, width, height, speech = false) => {
          Maze = new FancyMazeBuilder(width, height);
          Maze.display(id);
          MazeGame = new Mazing("maze");
          if(speech) {
            MazeGame.enableSpeech();
          }
        };
      
        makeMaze("maze_container", 12, 12);

      /*TODO: Separate the 'Hero Class' from the rest of the code */

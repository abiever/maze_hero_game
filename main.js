import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
        const makeMaze = (id, width, height, speech = false) => {
          Maze = new FancyMazeBuilder(width, height);
          Maze.display(id);
          MazeGame = new MazeController("maze");
          if(speech) {
            MazeGame.enableSpeech();
          }
        };
      
        makeMaze("maze_container", 12, 12);

      /*TODO: Separate the 'Hero Class' from the rest of the code */

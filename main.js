import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
const makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    Maze.returnMazeBuilderArray();
    MazeGame = new MazeController("maze", Maze.returnMazeBuilderArray());
    MazeGame.returnMazeControllerMaze();
}        
      
/*TODO: Use the below to create larger and larger mazes for each "level" */
makeMaze("maze_container", 8, 8);


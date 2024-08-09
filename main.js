import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
const makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    MazeGame = new MazeController("maze");
}        
      
/*TODO: Use the below to create larger and larger mazes for each "level" */
makeMaze("maze_container", 20, 12);


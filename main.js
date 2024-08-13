import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
var makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    MazeGame = new MazeController("maze", 5, Maze.returnMazeBuilderArray());
}        
      
/*TODO: Use the below to create larger and larger mazes for each "level" */
makeMaze("maze_container", 11, 9);
//NOTE: 'bare minimum' winnable game: 12, 10


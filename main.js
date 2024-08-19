import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
var makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    MazeGame = new MazeController("maze", 5, 0, Maze.returnMazeBuilderArray(), Maze.getMonsters(), Maze.getUpperWarpSpot(), Maze.getLowerWarpSpot());
}        
      
makeMaze("maze_container", 11, 9);




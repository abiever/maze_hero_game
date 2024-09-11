import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame; 
      
var makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    MazeGame = new MazeController(
            "maze", 
            10, //Adjust hero level here for testing purposes
            0, 
            1,
            Maze.returnMazeBuilderArray(), 
            Maze.getMonsters(), 
            Maze.getUpperWarpSpot(), 
            Maze.getLowerWarpSpot());
}        
      
makeMaze("maze_container", 11, 9);




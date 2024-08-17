import FancyMazeBuilder from "/FancyMazeBuilder.js";
import MazeController from "./MazeController.js"; 

var Maze, MazeGame;
      
var makeMaze = (id, width, height) => {
    Maze = new FancyMazeBuilder(width, height);
    Maze.display(id);
    MazeGame = new MazeController("maze", 5, 0, Maze.returnMazeBuilderArray(), Maze.getMonsters(), Maze.getUpperWarpSpot(), Maze.getLowerWarpSpot());
}        
      
makeMaze("maze_container", 11, 9);
//NOTE: 'bare minimum' winnable game: 12, 10

//TODO: 8/14/24
//Trying to make enemy movmenet


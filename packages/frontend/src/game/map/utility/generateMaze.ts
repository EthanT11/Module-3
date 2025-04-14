import { MAP_CONFIG } from "../mapConfig";
import { Vector2 } from "@babylonjs/core";

// Generate a random position that is an odd coordinate
const randomPosition = (mapWidth: number, mapHeight: number): Vector2 => {
    let x = 1 + 2 * Math.floor(Math.random() * ((mapWidth - 2) / 2));
    let y = 1 + 2 * Math.floor(Math.random() * ((mapHeight - 2) / 2));
    return new Vector2(x, y);
}

// https://cloudfour.com/thinks/generating-random-mazes-with-javascript/ | Source for the maze generation algorithm
const generateMaze = () => {
    const mapWidth = MAP_CONFIG.MAZE_CONFIG.width;
    const mapHeight = MAP_CONFIG.MAZE_CONFIG.height;
        
    // Fill entire map with walls (1's)
    const generatedMaze = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(1));

    // Generate random start and goal positions (must be at odd coordinates to ensure walls between paths)
    let start: Vector2;
    let goal: Vector2;
    let distance: number;
    let maxDistance: number;
    let i: number = 0;

    // do...while loops are really cool. do (statement) while (condition) | This do while loop ensures that the goal is far enough from the start position
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while
    do {
        i++;
        // Generate random goal position that is an odd coordinate
        start = randomPosition(mapWidth, mapHeight);
        goal = randomPosition(mapWidth, mapHeight);

        distance = Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);
        maxDistance = Math.max(mapWidth, mapHeight) / 2;
        // console.log("Distance:", distance, "Max Distance:", maxDistance, "Iteration:", i);
    } while (
        // Check if the goal is far enough from the start position
        distance < maxDistance
    );

    // Recursive function to carve paths
    const carvePath = (x: number, y: number, visited: Set<string>) => {
        const directions = [
            [0, -2], // North
            [0, 2],  // South
            [2, 0],  // East
            [-2, 0]  // West
        ];
        
        // Shuffle directions
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        // Add the current cell to the visited set
        visited.add(`${x},${y}`);
        generatedMaze[y][x] = 0; // Carve current cell

        // Carve the path
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            let newCell: Vector2 = new Vector2(newX, newY);
            
            // Check if the new cell is within the bounds of the map and not visited
            if (newCell.x > 0 && newCell.x < mapWidth - 1 && 
                newCell.y > 0 && newCell.y < mapHeight - 1 && 
                !visited.has(`${newCell.x},${newCell.y}`)) {
                // Carve path between current cell and next cell
                const carveX = x + dx/2;
                const carveY = y + dy/2;
                const carveCell: Vector2 = new Vector2(carveX, carveY);

                generatedMaze[carveCell.y][carveCell.x] = 0;

                carvePath(newX, newY, visited);
            }
        }
    };

    // Start carving from the start position
    const visited = new Set<string>();
    carvePath(start.x, start.y, visited);
    // console.log("Visited:", visited);

    // Place start and goal
    generatedMaze[start.y][start.x] = 3;
    generatedMaze[goal.y][goal.x] = 4;

    return generatedMaze;
};

export default generateMaze;
import { MeshBuilder, Vector2, StandardMaterial, Color3, Scene } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import { createWall, createPlatform } from "../map_objects/index";
import { SCENE_CONFIG } from "../../config";

const fillMaze = (map: number[][], scene: Scene) => {
    // Get the ground size
    const groundWidth = MAP_CONFIG.GROUND_CONFIG.width;
    const groundHeight = MAP_CONFIG.GROUND_CONFIG.height;
    
    console.log("Ground Positions: ", groundWidth, groundHeight);
    
    // Calculate cell dimensions | This gets the width and height of each cell in the map based on the ground size so it can scale to different ground sizes
    const cellWidth = groundWidth / map[0].length;
    const cellDepth = groundHeight / map.length;

    console.log("Cell Dimensions: ", cellWidth, cellDepth);

    let wallHeight: number;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            // Convert maze coordinates to world coordinates
            // Center the maze on the ground and adjust for cell centers
            const x = (j - map[0].length/2) * cellWidth + cellWidth/2;
            const z = (i - map.length/2) * cellDepth + cellDepth/2;

            // Check if the cell is a wall
            if (map[i][j] === 1) { // Wall
                wallHeight = MAP_CONFIG.WALL_CONFIG.height;
                createWall(x, z, cellWidth, cellDepth, wallHeight, scene);
            }
            if (map[i][j] === 2) { // Platform
                // TODO: Make the heights adjustable
                createPlatform(x, 0, z, scene);
            }
            if (map[i][j] === 3) { // Start Point
                console.log("=== Start Point Creation ===");
                console.log("Maze indices (i,j):", i, j);
                console.log("Calculated world position (x,z):", x, z);
                console.log("Ground bounds:", -groundWidth/2, "to", groundWidth/2);

                const startPoint = MeshBuilder.CreateSphere("startPoint", { diameter: 1 }, scene);
                const startPointMaterial = new StandardMaterial("startPoint", scene);
                startPointMaterial.diffuseColor = new Color3(0, 1, 0);
                startPointMaterial.emissiveColor = new Color3(0, 0.5, 0);
                startPoint.material = startPointMaterial;

                // position the start point on the cell
                startPoint.position.set(x, 1, z);
                // Set the spawn position to the start point
                MAP_CONFIG.SPAWN_CONFIG.startPosition.set(x, 0, z);

                // console.log("Start point created at", x, z);
            }
            if (map[i][j] === 4) { // Goal
                console.log("=== Goal Creation ===");
                console.log("Maze indices (i,j):", i, j);
                console.log("Calculated world position (x,z):", x, z);
                console.log("Ground bounds:", -groundWidth/2, "to", groundWidth/2);
                
                const goal = MeshBuilder.CreateSphere("goal", { diameter: 2 }, scene);
                const goalMaterial = new StandardMaterial("goal", scene);
                goalMaterial.diffuseColor = new Color3(1, 0, 0);
                goalMaterial.emissiveColor = new Color3(0.5, 0, 0);
                goal.material = goalMaterial;

                goal.checkCollisions = true;
                
                goal.position.set(x, 1, z);
                console.log("Final goal position:", goal.position);
            }
        }
    }
}

export default fillMaze;
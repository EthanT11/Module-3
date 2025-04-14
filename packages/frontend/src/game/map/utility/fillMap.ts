import { MeshBuilder, Vector2, StandardMaterial, Color3, Scene } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import { createWall, createPlatform } from "../mapObjects/index";

const fillMap = (map: number[][], scene: Scene) => {
    // Get the ground size
    const groundWidth = MAP_CONFIG.GROUND_CONFIG.width;
    const groundHeight = MAP_CONFIG.GROUND_CONFIG.height;
    
    // Calculate cell dimensions | This gets the width and height of each cell in the map based on the ground size so it can scale to different ground sizes
    const cellWidth = groundWidth / map[0].length;
    const cellDepth = groundHeight / map.length;

    let wallHeight: number;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            // TODO: Maybe make this into a switch case?
            let cell: Vector2 = new Vector2(j, i);
            const x = -groundWidth/2 + cell.x * cellWidth + cellWidth/2; 
            const z = -groundHeight/2 + cell.y * cellDepth + cellDepth/2; 

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
                const startPoint = MeshBuilder.CreateSphere("startPoint", { diameter: 1 }, scene);
                const startPointMaterial = new StandardMaterial("startPoint", scene);
                startPointMaterial.diffuseColor = new Color3(0, 1, 0);
                startPoint.material = startPointMaterial;

                // position the start point on the cell
                startPoint.position.set(x, 0, z);
                MAP_CONFIG.SPAWN_CONFIG.startPosition.set(x, 0, z);

                // console.log("Start point created at", x, z);
            }
            if (map[i][j] === 4) { // Goal
                const goal = MeshBuilder.CreateSphere("goal", { diameter: 1 }, scene);
                const goalMaterial = new StandardMaterial("goal", scene);
                goalMaterial.diffuseColor = new Color3(1, 0, 0);
                goal.material = goalMaterial;
                
                goal.position.set(x, 0, z);
            }
        }
    }
}

export default fillMap;
import { MeshBuilder, StandardMaterial, Color3, Scene } from "@babylonjs/core";
// import { SCENE_CONFIG } from "../config";
import { MAP_CONFIG } from "./mapConfig";
import createTexture from "./createTexture";

// Walls
const createWall = (x: number, z: number, width: number, depth: number, height: number, scene: Scene) => {
    const wall = MeshBuilder.CreateBox("wall", { 
        width: width,
        height: height,
        depth: depth
    }, scene);
    wall.position.set(x, height/2, z); // Position at half height so it sits on the ground
    
    wall.checkCollisions = true;
    wall.freezeWorldMatrix(); // Optimize performance for static objects
    
    wall.material = createTexture({name: "wall", folderName: MAP_CONFIG.WALL_CONFIG.assetFolder, uvScale: MAP_CONFIG.WALL_CONFIG.uvScale, scene}); 
    return wall;
};

// Platforms
const createPlatform = (x: number, y: number, z: number, scene: Scene) => {
    const platform = MeshBuilder.CreateBox("platform", { 
        width: 4,
        height: 0.5,
        depth: 4
    }, scene);
    platform.position.set(x, y, z);

    platform.checkCollisions = true;
    platform.isPickable = true;

    platform.freezeWorldMatrix();
    
    return platform;
};

    // w = Wall
    // p = Platform
    //       200
    // [W , W , W , W , W , W]
    // [W , _ , _ , _ , _ , W]  2
    // [W , P , S1 , S2 , _ , W]  0
    // [W , _ , _ , _ , _ , W]  0
    // [W , W , W , W , W , W]
const createMap = (scene: Scene) => {
    // 0 = Empty // Ground
    // 1 = Wall
    // 2 = Platform
    // 3 = Start Point
    // 4 = Goal
    // 5 = Pillar
    // Maze | Could be cool to have a way to generate mazes
    // Arena
    // The array size can be changes to make the map more detailed since it scales to the ground size
    // const map = [       
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    //     [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 0, 0, 4, 0, 1, 0, 1], 
    //     [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 3, 1, 0, 0, 1, 0, 1],
    //     [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1],  
    //     [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],   
    //     [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // ];
    const map = [       
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],  
        [1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],   
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    
    let wallHeight: number;

    const groundWidth = MAP_CONFIG.GROUND_CONFIG.width;
    const groundHeight = MAP_CONFIG.GROUND_CONFIG.height;
    
    // Calculate cell dimensions | This gets the width and height of each cell in the map based on the ground size so it can scale to different ground sizes
    const cellWidth = groundWidth / map[0].length;
    const cellDepth = groundHeight / map.length;
    
    // TODO: Extract this into a function
    // for each row
    for (let i = 0; i < map.length; i++) {
        // for each column
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 1) { // Wall
                wallHeight = MAP_CONFIG.WALL_CONFIG.height;
                // Center the wall on the cell
                const x = -groundWidth/2 + j * cellWidth + cellWidth/2; 
                const z = -groundHeight/2 + i * cellDepth + cellDepth/2; 
                createWall(x, z, cellWidth, cellDepth, wallHeight, scene);
            }
            if (map[i][j] === 2) { // Platform
                // TODO: Make the heights adjustable
                const x = -groundWidth/2 + j * cellWidth + cellWidth/2;
                const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                createPlatform(x, 0, z, scene);
            }
            if (map[i][j] === 3) { // Start Point
                // TODO: Find a way to map this to the player spawn point | Right now it's just a sphere at 0, 0
                const startPoint = MeshBuilder.CreateSphere("startPoint", { diameter: 1 }, scene);
                const startPointMaterial = new StandardMaterial("startPoint", scene);
                startPointMaterial.diffuseColor = new Color3(0, 1, 0);
                startPoint.material = startPointMaterial;

                // position the start point on the cell
                const x = -groundWidth/2 + j * cellWidth + cellWidth/2; 
                const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                startPoint.position.set(x, 0, z);
                // console.log("Start point created at", x, z);
            }
            if (map[i][j] === 4) { // Goal
                const goal = MeshBuilder.CreateSphere("goal", { diameter: 1 }, scene);
                const goalMaterial = new StandardMaterial("goal", scene);
                goalMaterial.diffuseColor = new Color3(1, 0, 0);
                goal.material = goalMaterial;
                
                const x = -groundWidth/2 + j * cellWidth + cellWidth/2;
                const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                goal.position.set(x, 0, z);
            }
            if (map[i][j] === 5) { // Pillar
                wallHeight = MAP_CONFIG.PILLAR_CONFIG.height;

                const x = (-groundWidth/2 + j * cellWidth + cellWidth/2) - cellWidth/2;
                const z = (-groundHeight/2 + i * cellDepth + cellDepth/2) - cellDepth/2;

                createWall(x, z, cellWidth, cellDepth, wallHeight, scene);

                // wallHeight = MAP_CONFIG.WALL_CONFIG.height;
                // // Center the wall on the cell
                // const x = -groundWidth/2 + j * cellWidth + cellWidth/2; 
                // const z = -groundHeight/2 + i * cellDepth + cellDepth/2; 
                // createWall(x, z, cellWidth, cellDepth, wallHeight, scene);
            }
        }
    }

    return map;
}

export default createMap;
import { MeshBuilder, StandardMaterial, Color3, Vector2, Scene } from "@babylonjs/core";
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
    const handleFog = () => {
        // Random Fog
        scene.fogMode = Scene.FOGMODE_EXP2;
        scene.fogColor = new Color3(Math.random(), Math.random(), Math.random());
        scene.fogDensity = (Math.random() * 0.05) + 0.01; // 0.1 is very thick
    }
    handleFog();

    
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
    //     [1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    //     [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 0, 0, 4, 0, 1, 0, 1], 
    //     [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    //     [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1],  
    //     [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],   
    //     [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // ];
    // const map = [       
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    //     [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],  
    //     [1, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0, 1],   
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    // ];
    let generatedMap: number[][];
    let mapWidth: number;
    let mapHeight: number;

    const generateMap = () => {
        // https://cloudfour.com/thinks/generating-random-mazes-with-javascript/ | Source for the maze generation algorithm
        // TODO: Make this random as well? 8 seems to be a good small size and probably increase by 4 each size. 16+ seemed much too large.
        mapWidth = MAP_CONFIG.MAZE_CONFIG.width;
        mapHeight = MAP_CONFIG.MAZE_CONFIG.height;
        
        // Fill entire map with walls (1's)
        generatedMap = Array(mapHeight).fill(0).map(() => Array(mapWidth).fill(1));

        const randomPosition = (): Vector2 => {
            let x = 1 + 2 * Math.floor(Math.random() * ((mapWidth - 2) / 2));
            let y = 1 + 2 * Math.floor(Math.random() * ((mapHeight - 2) / 2));
            return new Vector2(x, y);
        }

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
            start = randomPosition();
            goal = randomPosition();
        
            distance = Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y);
            maxDistance = Math.max(mapWidth, mapHeight) / 2;
            console.log("Distance:", distance, "Max Distance:", maxDistance, "Iteration:", i);
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
            generatedMap[y][x] = 0; // Carve current cell

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

                    generatedMap[carveCell.y][carveCell.x] = 0;

                    carvePath(newX, newY, visited);
                }
            }
        };

        // Start carving from the start position
        const visited = new Set<string>();
        carvePath(start.x, start.y, visited);
        console.log("Visited:", visited);

        // Place start and goal
        generatedMap[start.y][start.x] = 3;
        generatedMap[goal.y][goal.x] = 4;

        return generatedMap;
    };
    const map = generateMap();
    console.log("Generated Map:", map);
    
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

    return map;
}

export default createMap;
import { Scene, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3 } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SCENE_CONFIG } from "../config";
import { createGroundMaterial } from "../map/groundMaterial";
import useSupabase from "../../hooks/useSupabase";


// TODO: Maybe have a way to choose to load locally or from supabase
export const setupObjects = async (scene: Scene): Promise<void> => {
    const { getAssetUrl } = useSupabase();

    try {
        // Scene objects
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.y = 20 // Same as the light
        
        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene); 
        box.position.x = 20
        box.checkCollisions = true;
        
        
        // Skybox
        // https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
        // https://opengameart.org/content/retro-skyboxes-pack
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false; 
        skyboxMaterial.disableLighting = true;
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;
        
        // TODO: Look into using a single texture for the skybox | dds files are faster to load
        skyboxMaterial.reflectionTexture = new CubeTexture(
            '',
            scene,
            null,
            undefined,
            [
                getAssetUrl("textures/skybox", "skybox_nx.jpg"), // Left
                getAssetUrl("textures/skybox", "skybox_py.jpg"), // Top
                getAssetUrl("textures/skybox", "skybox_nz.jpg"), // Back
                getAssetUrl("textures/skybox", "skybox_px.jpg"), // Right
                getAssetUrl("textures/skybox", "skybox_ny.jpg"), // Bottom
                getAssetUrl("textures/skybox", "skybox_pz.jpg"), // Front
            ]
        )
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        
        skybox.renderingGroupId = 0;
        
        
        // Floor
        const ground = MeshBuilder.CreateGround(
            "ground",
            SCENE_CONFIG.GROUND_CONFIG,
            scene
        );
        ground.checkCollisions = true;
        ground.isPickable = true;
        ground.material = createGroundMaterial(scene);

        // Walls
        const createWall = (x: number, z: number, width: number, depth: number, height: number) => {
            const wall = MeshBuilder.CreateBox("wall", { 
                width: width,
                height: height,
                depth: depth
            }, scene);
            wall.position.set(x, height/2, z); // Position at half height so it sits on the ground
            wall.checkCollisions = true;
            wall.isPickable = true;
            wall.freezeWorldMatrix(); // Optimize performance for static objects
            
            // TODO: Get a material for the walls
            wall.material = createGroundMaterial(scene); 
            return wall;
        };
        // Platforms
        const createPlatform = (x: number, y: number, z: number) => {
            const platform = MeshBuilder.CreateBox("platform", { 
                width: 4,
                height: 0.5,
                depth: 4
            }, scene);
            platform.position.set(x, y, z);
            platform.checkCollisions = true;
            platform.isPickable = true;
            platform.freezeWorldMatrix(); // Optimize performance for static objects

            // Visualize the collision box
            platform.showBoundingBox = true;
            
            return platform;
        };

        // TODO: Probably start a config file for object sizing
        
        // Walls around the ground perimeter
        
        

        // 200/10
        // w = Wall
        // p = Platform
        //       200
        // [W , W , W , W , W , W]
        // [W , _ , _ , _ , _ , W]  2
        // [W , P , S1 , S2 , _ , W]  0
        // [W , _ , _ , _ , _ , W]  0
        // [W , W , W , W , W , W]
        
        const createMap = () => {
            const wallHeight = 1;
            const wallThickness = 1;
            // 0 = Empty
            // 1 = Wall
            // 2 = Platform
            // 3 = Spawn Point
            // 20 x 10 
                                // j = 2
            const map = [       // ^
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // i = 0
                            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // i = 1
                            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        ];
            
            const groundWidth = SCENE_CONFIG.GROUND_CONFIG.width;
            const groundHeight = SCENE_CONFIG.GROUND_CONFIG.height;
            
            // Calculate cell dimensions | This gets the width and height of each cell in the map based on the ground size so it can scale to different ground sizes
            const cellWidth = groundWidth / map[0].length;
            const cellDepth = groundHeight / map.length;
            
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++) {
                    if (map[i][j] === 1) { // Wall
                        const x = -groundWidth/2 + j * cellWidth + cellWidth/2;
                        const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                        createWall(x, z, cellWidth, cellDepth, wallHeight);
                    }
                    if (map[i][j] === 2) { // Platform
                        const x = -groundWidth/2 + j * cellWidth + cellWidth/2;
                        const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                        createPlatform(x, 0, z);
                    }
                    if (map[i][j] === 3) { // Spawn Point
                        const spawnPoint = MeshBuilder.CreateSphere("spawnPoint", { diameter: 1 }, scene);
                        const x = -groundWidth/2 + j * cellWidth + cellWidth/2;
                        const z = -groundHeight/2 + i * cellDepth + cellDepth/2;
                        spawnPoint.position.set(x, 0, z);
                        console.log("Spawn point created at", x, z);
                    }
                }
            }
            return map;
        }

        const map = createMap();
        console.log(map);


        // createPlatform(5, 2, 0);
        // createPlatform(10, 4, 3);
        // createPlatform(15, 6, -2);
        // createPlatform(8, 8, 1);
        // createPlatform(12, 10, -3);
        // createPlatform(16, 12, 2);
        // createPlatform(18, 14, -1);
        // createPlatform(20, 16, 3);
        // createPlatform(22, 18, -2);
        // createPlatform(24, 20, 1);
        // createPlatform(26, 22, -3);
        // createPlatform(28, 24, 2);

        console.log("Objects loaded");
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}
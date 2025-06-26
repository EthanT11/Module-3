import { Color3, CreateGround, HemisphericLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { createWall } from "../map/map_objects";
import createTexture from "../map/utility/createTexture";
import { MAP_CONFIG } from "../map/mapConfig";
import { buildMapFromArray, generateMaze, lobbyMap } from "../map/utility";

export const createLobbyMap = (scene: Scene) => {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    
    const groundOptions = {
        width: 1000,
        height: 1000,
        subdivisions: 10,
        subdivisionsX: 10,
    }   
    const ground = CreateGround("ground", groundOptions, scene);
    ground.position.y = 0;
    const groundMaterial = createTexture({name: "ground", folderName: MAP_CONFIG.GROUND_CONFIG.assetFolder, uvScale: MAP_CONFIG.GROUND_CONFIG.uvScale, scene});
    ground.material = groundMaterial;

    // Generate maze
    // const map = generateMaze(11, 11);
    // TODO: Make a cooler lobby map
    const map = lobbyMap;
    console.log(map);

    // Build the map from the array
    const { walls, spawnPosition, endPosition } = buildMapFromArray(map, scene, 
    {
        wallHeight: 8,
        wallWidth: 12,
        wallDepth: 12,
        startX: -75, // Center the map
        startZ: -75
    });

    return { walls, ground, spawnPosition, endPosition };
}
import { Color3, CreateGround, HemisphericLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { createWall } from "../map/map_objects";
import createTexture from "../map/utility/createTexture";
import { MAP_CONFIG } from "../map/mapConfig";
import { buildMapFromArray } from "../map/utility";

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

    // 2D map array | 0 = empty, 1 = wall, 2 = spawn point, 3 = end point
    const map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 3, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const map2 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 3, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    // Build the map from the array
    const { walls, spawnPosition, endPosition } = buildMapFromArray(map, scene, {
        wallHeight: 8,
        wallWidth: 12,
        wallDepth: 12,
        startX: -75, // Center the map
        startZ: -75
    });

    return { walls, ground, spawnPosition, endPosition };
}
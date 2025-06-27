import { Color3, CreateSphere, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { createWall } from "../map_objects";
import { MAP_CONFIG } from "../mapConfig";

export interface MapArrayConfig {
    cellSize?: number;
    wallHeight?: number;
    wallWidth?: number;
    wallDepth?: number;
    startX?: number;
    startZ?: number;
}

export interface MapBuildResult {
    walls: any[];
    spawnPosition?: Vector3;
    endPosition?: Vector3;
}

export const buildMapFromArray = (
    mapArray: number[][], 
    scene: Scene, 
    config: MapArrayConfig = {}
): MapBuildResult => {
    const {
        cellSize = 10,
        wallHeight = MAP_CONFIG.WALL_CONFIG.height,
        wallWidth = 10,
        wallDepth = 10,
        startX = 0,
        startZ = 0
    } = config;

    const walls: any[] = [];
    let spawnPosition: Vector3 | undefined;
    let endPosition: Vector3 | undefined;

    // iterate through the map array
    for (let row = 0; row < mapArray.length; row++) {
        for (let col = 0; col < mapArray[row].length; col++) {
            const cellValue = mapArray[row][col];
            const x = startX + col * cellSize;
            const z = startZ + row * cellSize;
            
            // create wall
            if (cellValue === 1) {
                const wall = createWall(x, z, wallWidth, wallDepth, wallHeight, scene);
                walls.push(wall);
            }

            // create spawn
            // TODO: Maybe try and see if we can break down the spawn cell into quarters, one for each player spawn
            if (cellValue === 2) {
                const spawnOrb = CreateSphere("spawnOrb", { diameter: 1 }, scene);
                const material = new StandardMaterial("spawnOrbMaterial", scene);
                material.diffuseColor = new Color3(0, 1, 0);
                material.alpha = 0.5;
                material.backFaceCulling = false;
                spawnOrb.material = material;
                
                spawnPosition = new Vector3(x, 1, z);
                spawnOrb.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
            }

            // create end orb
            if (cellValue === 3) {
                const endOrb = CreateSphere("endOrb", { diameter: 2 }, scene);
                const material = new StandardMaterial("endOrbMaterial", scene);
                material.diffuseColor = new Color3(1, 0, 0);
                material.emissiveColor = new Color3(1, 0, 0);
                // material.alpha = 0.5;
                material.backFaceCulling = false;
                endOrb.material = material;

                endPosition = new Vector3(x, 1, z);
                endOrb.position.set(endPosition.x, endPosition.y, endPosition.z);
            }
        }
    }

    return { walls, spawnPosition, endPosition };
}; 
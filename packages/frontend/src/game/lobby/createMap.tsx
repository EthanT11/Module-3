import { Color3, CreateGround, HemisphericLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { createWall } from "../map/map_objects";
import createTexture from "../map/utility/createTexture";
import { MAP_CONFIG } from "../map/mapConfig";
import { buildMapFromArray, generateMaze, lobbyMap } from "../map/utility";
import { Room } from "colyseus.js";

const setMapState = (room: Room, map: number[][]) => {
    try {
        const flatMap = map.flat();
        room.send("setMapState", {
            data: flatMap,
            width: map[0].length,
            height: map.length,
            fogColor: [0, 0, 0],
            fogDensity: 0
        });
    } catch (error) {
        console.error("Error setting map state:", error);
    }
}

const getMapState = (room: Room): Promise<number[][]> => {
    return new Promise((resolve) => {
        try {
            room.onMessage("mapState", (message) => {
                const width = message.width;
                const height = message.height;
                const map: number[][] = [];
                for (let i = 0; i < height; i++) {
                    map[i] = message.data.slice(i * width, (i + 1) * width);
                }
                // If map is empty, try again after a short delay
                if (!map.length || !map[0].length) {
                    setTimeout(() => {
                        room.send("getMapState");
                    }, 100); // 100ms delay
                    return;
                }
                console.log("Received MapState:", map);
                resolve(map);
            });
            room.send("getMapState");
        } catch (error) {
            console.error("Error getting map state:", error);
            resolve([[0]]);
        }
    });
}

export const createMap = async (scene: Scene, isLobby: boolean, isHost: boolean, room: Room) => {
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
    let map: number[][];
    if (isLobby) {
        map = lobbyMap;
    } else {
        if (isHost) {
            map = generateMaze(11, 11);
            setMapState(room, map);
        } else {
            // Get map from server
            console.log("Getting map from server");
            map = await getMapState(room);
        }
    }
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
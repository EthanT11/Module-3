import { Scene, Color3 } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { createLight, createFog, createSkyBox, createGround } from "./map_objects";
import { PlayerStateManager } from "../player/PlayerState";
import generateMaze from "./utility/generateMaze";
import fillMaze from "./utility/fillMaze";

let map: number[][] = [];
let fog: { fogColor: number[], fogDensity: number };

const loadLocalMap = async (scene: Scene, playerStateManager: PlayerStateManager, room: Room) => {
    // Host generates and sets the map
    const useTestMap = true;
    if (useTestMap) {
        map = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    } else {
        map = generateMaze();
    }
    fog = createFog(scene);
    createLight(scene);
    createSkyBox(scene);
    createGround(scene);
    fillMaze(map, scene);
    
    // We need to flatten the map to send it to the server
    const flatMap = map.flat();
    
    // Send map to server
    try {
        await playerStateManager.setMapState({
            data: flatMap,
            width: map[0].length,
            height: map.length,
            fogColor: fog.fogColor,
            fogDensity: fog.fogDensity
        }, room);
    } catch (error) {
        console.error("Error setting map state:", error);
    }
};

const loadRemoteMap = async (scene: Scene, playerStateManager: PlayerStateManager, room: Room) => {
    // Non-host clients request and wait for map data
    return new Promise((resolve) => {
        // Listen for map state response
        room.onMessage("mapState", (message) => {
            // Reconstruct 2D array from flat data  
            const width = message.width;
            const height = message.height;
            map = [];
            
            // This breaks the map into rows
            for (let i = 0; i < height; i++) {
                map[i] = message.data.slice(i * width, (i + 1) * width);
            }
            
            console.log("Received MapState:", map);
            
            // Create scene objects 
            const fogColor = [message.fogColor[0], message.fogColor[1], message.fogColor[2]];
            const fogDensity = message.fogDensity;
            createFog(scene, fogColor, fogDensity);
            createLight(scene);
            createSkyBox(scene);
            createGround(scene);
            fillMaze(map, scene);
            
            // resolve the promise with the map
            resolve(map);
        });
        
        // Request map state
        room.send("getMapState");
    });
};

const loadMap = async (scene: Scene, playerStateManager: PlayerStateManager, isHost: boolean, room: Room) => {
    playerStateManager.setIsHost(isHost);
    if (isHost) {
        loadLocalMap(scene, playerStateManager, room);
    } else {
        loadRemoteMap(scene, playerStateManager, room);
    }
};


export default loadMap;
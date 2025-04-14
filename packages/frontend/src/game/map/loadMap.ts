import { Scene } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { createLight, createFog, createSkyBox, createGround, createWall, createPlatform } from "./mapObjects";
import { PlayerStateManager } from "../player/PlayerState";
import generateMaze from "./utility/generateMaze";
import fillMap from "./utility/fillMap";

const loadMap = async (scene: Scene, playerStateManager: PlayerStateManager, isHost: boolean, room: Room) => {
    let map: number[][] = [];

    if (isHost) {
        // Host generates and sets the map
        playerStateManager.setIsHost(true);
        map = generateMaze();
        
        // We need to flatten the map to send it to the server
        const flatMap = map.flat();
        
        // Send map to server
        await playerStateManager.setMapState({
            data: flatMap,
            width: map[0].length,
            height: map.length,
            fogColor: scene.fogColor,
            fogDensity: scene.fogDensity
        }, room);
        
        console.log("Generated and sent MapState:", map);
    } else {
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
                createLight(scene);
                createFog(scene);
                createSkyBox(scene);
                createGround(scene);
                fillMap(map, scene);
                
                // resolve the promise with the map
                resolve(map);
            });
            
            // Request map state
            room.send("getMapState");
        });
    }

    // Host creates scene objects immediately
    if (isHost) {
        createLight(scene);
        createFog(scene);
        createSkyBox(scene);
        createGround(scene);
        fillMap(map, scene);
        
        return map;
    }
};

export default loadMap;
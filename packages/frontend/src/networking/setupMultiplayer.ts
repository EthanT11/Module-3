import { Scene, UniversalCamera, Mesh, StandardMaterial, MeshBuilder } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";

export const BACKEND_URL = import.meta.env.PROD 
    ? `wss://${import.meta.env.VITE_BACKEND_URL}` // Production URL
    : "ws://localhost:2567"; // Local URL

export const setupMultiplayer = (
    scene: Scene,
    camera: UniversalCamera,
    existingRoom?: Room
) => {
    let playerSphere: Mesh | null = null;

    if (!existingRoom) { // If no room connection provided, return null
        return { playerSphere };
    }

    const room = existingRoom; // If a room connection is provided, use it
    const roomState = room.state as MyRoomState;

    console.log("Setting up multiplayer with room: ", room)
    
    roomState.players.onAdd((player, sessionId) => { // When a player joins the room
        console.log("Player joined", player, sessionId);
        // Create a sphere for the player
        const sphere = MeshBuilder.CreateSphere(`player-${sessionId}`, { 
            segments: 10, // # of segments on the sphere | More segments = smoother sphere
            diameter: 2  
        }, scene); 
        sphere.position.set(player.x, player.y, player.z); // Set the position of the sphere to the player's position
    
        // Set the camera to the player
        if (sessionId === room.sessionId) {
            playerSphere = sphere;
        }
    
        // Create a material for the player
        const material = new StandardMaterial(`player-${sessionId}`, scene);
        sphere.material = material;
    
        // Update the player's position when it changes
        player.onChange(() => {
            if (sessionId !== room.sessionId) {  // Only update other players
                sphere.position.set(player.x, player.y, player.z);
            }
        });
    })

    // Update the player's position when the camera moves
    // TODO: Look into if this is the best way to do this
    scene.registerBeforeRender(() => {
        if (playerSphere && room) {
            playerSphere.position.copyFrom(camera.position);
        }


        // Send the player's position to the server
        room.send("updatePosition", {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z 
        });
    })
    
    // Dispose of the sphere when the player leaves
    roomState.players.onRemove((player, sessionId) => {
        const sphereToRemove = scene.getMeshByName(`player-${sessionId}`);
        if (sphereToRemove) {
            sphereToRemove.dispose();
            console.log("Removed player sphere: ", sphereToRemove);
        }
        if (sessionId === room.sessionId) {
            playerSphere = null;
        }
    })

    return { playerSphere };
}

import { Scene, UniversalCamera, TransformNode, AbstractMesh, Vector3, Scalar } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState, Player } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerTransformNode } from "../game/player/createPlayerTransformNode";

export const BACKEND_URL = import.meta.env.PROD 
    ? `wss://${import.meta.env.VITE_BACKEND_URL}` // Production URL
    : "ws://localhost:2567"; // Local URL


// Interpolate the player's position | Interpolation is used to smooth the movement
const updatePlayerPosition = ( mesh: AbstractMesh, targetPosition: Vector3, smoothness: number = 0.15
) => {
    mesh.position = Vector3.Lerp(
        mesh.position,
        targetPosition,
        smoothness
    );
}

// Interpolate the player's rotation | Interpolation is used to smooth the movement
const updatePlayerRotation = ( mesh: AbstractMesh, targetRotation: number, smoothness: number = 0.15) => {
    const currentRotation = mesh.rotation.y;
    // Handle rotation wrapping around 360 degrees
    let difference = targetRotation - currentRotation; // Calculate the difference between the target and current rotation
    if (difference > Math.PI) difference -= Math.PI * 2; // If the difference is greater than 180 degrees, wrap around to the other side
    if (difference < -Math.PI) difference += Math.PI * 2; // If the difference is less than -180 degrees, wrap around to the other side
    
    mesh.rotation.y = currentRotation + difference * smoothness;
}


export const setupMultiplayer = (
    scene: Scene,
    camera: UniversalCamera,
    existingRoom?: Room
) => {
    const playerMeshes = new Map<string, AbstractMesh>(); // Map of player ID to mesh
    let playerModel: AbstractMesh | undefined = undefined;
    
    if (!existingRoom) {
        return;
    }
    
    const room = existingRoom; // If a room connection is provided, use it
    const roomState = room.state as MyRoomState;
    console.log("Setting up multiplayer with room: ", room)
    
    // When a player joins the room
    roomState.players.onAdd(async (player, sessionId) => {
        const playerID = sessionId;
        console.log("Player joined: ", player, playerID);
        
        try {
            // todo: remove transformNode since it doesn't need it
            const { transformNode, mesh } = await createPlayerTransformNode(scene);
            console.log(`Player created: ${playerID}`, transformNode, mesh);

            // Spawn mesh at the player's position and rotation from the server
            if (transformNode && mesh) {
                mesh.position.set(player.x, player.y, player.z); 
                mesh.rotation.y = player.rotationY;
                
                // Store ID and mesh in map
                playerMeshes.set(playerID, mesh);
            }

            // Check if the player is the local player
            if (sessionId === room.sessionId) {
                if (mesh) {
                    playerModel = mesh;
                    playerModel.isVisible = false;
                    // Set initial camera position behind the player
                    camera.position = mesh.position.clone();
                    camera.position.y += 2; // Camera height offset
                    camera.position.z -= 5; // Camera distance behind player
                    camera.setTarget(mesh.position);
                }
            }

        } catch (error) {
            console.error("Error creating player: ", error); 
        }

    
        // Update the player's position when it changes 
        player.onChange(() => {
            // Only update the mesh if it's not the local player
            const playerMesh = playerMeshes.get(playerID);
           
            if (playerMesh && sessionId !== room.sessionId) {
                const targetPosition = new Vector3(player.x, player.y, player.z);
                updatePlayerPosition(playerMesh, targetPosition);

                const targetRotation = player.rotationY;
                updatePlayerRotation(playerMesh, targetRotation);
            }
        });
    })

    // Update the player model's position and rotation every frame
    scene.registerBeforeRender(() => {
        if (playerModel) {
            // Calculate the target position (where the player should be)
            const targetPosition = camera.position.clone();
            targetPosition.y -= 0.5; // Adjust for camera height offset

            updatePlayerPosition(playerModel, targetPosition);

            // Update player model rotation to match camera | We don't
            playerModel.rotation.y = camera.rotation.y + Math.PI;

            // Send the player's position and rotation to the server
            room.send("updatePosition", {
                x: playerModel.position.x,
                y: playerModel.position.y,
                z: playerModel.position.z,
                rotationY: playerModel.rotation.y
            });
        }
    })
    
    // Dispose of the model when the player leaves
    roomState.players.onRemove((player, sessionId) => {
        const playerMesh = playerMeshes.get(sessionId);
        if (playerMesh) {
            playerMesh.dispose();
            playerMeshes.delete(sessionId);
        }
    })

}

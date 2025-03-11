import { Scene, UniversalCamera, TransformNode, AbstractMesh, Vector3, Scalar } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState, Player } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerTransformNode } from "../game/player/createPlayerTransformNode";

export const BACKEND_URL = import.meta.env.PROD 
    ? `wss://${import.meta.env.VITE_BACKEND_URL}` // Production URL
    : "ws://localhost:2567"; // Local URL


// Interpolate the player's position | Interpolation is used to smooth the movement
const interpolatePlayerPosition = ( mesh: AbstractMesh, targetPosition: Vector3, smoothness: number = 0.15
) => {
    mesh.position = Vector3.Lerp(
        mesh.position,
        targetPosition,
        smoothness
    );
}

// Interpolate the player's rotation | Interpolation is used to smooth the movement
const interpolatePlayerRotation = ( mesh: AbstractMesh, targetRotation: number, smoothness: number = 0.15) => {
    const currentRotation = mesh.rotation.y;
    // Handle rotation wrapping around 360 degrees
    let difference = targetRotation - currentRotation; // Calculate the difference between the target and current rotation
    if (difference > Math.PI) difference -= Math.PI * 2; // If the difference is greater than 180 degrees, wrap around to the other side
    if (difference < -Math.PI) difference += Math.PI * 2; // If the difference is less than -180 degrees, wrap around to the other side
    
    mesh.rotation.y = currentRotation + difference * smoothness;
}

interface InitializePlayerProps {
    scene: Scene;
    sessionId: string;
    player: Player;
    playerMeshes: Map<string, AbstractMesh>;
    isLocalPlayer: boolean;
    camera: UniversalCamera;
}

const initializePlayer = async ({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera }: InitializePlayerProps): Promise<AbstractMesh | undefined> => {
    try {
        const { mesh } = await createPlayerTransformNode(scene); // Create the player mesh
        console.log(`Player created: ${sessionId}`, mesh);

        if (mesh) {
            mesh.position.set(player.x, player.y, player.z); // Set the player's position
            mesh.rotation.y = player.rotationY; // Set the player's rotation
            playerMeshes.set(sessionId, mesh); // Store the player's mesh in the map

            // If the player is the local player, set the camera position and target and hide the mesh
            if (isLocalPlayer) {
                mesh.isVisible = false;
                camera.position = mesh.position.clone();
                camera.position.y += 2; // Camera height offset
                camera.position.z -= 5; // Camera distance behind player
                camera.setTarget(mesh.position);

                return mesh;
            }
        }
    } catch (error) {
        console.error("Error creating player: ", error);
    }

    return undefined;
}


export const setupMultiplayer = (
    scene: Scene,
    camera: UniversalCamera,
    existingRoom?: Room
) => {
    let playerModel: AbstractMesh | undefined = undefined;
    const playerMeshes = new Map<string, AbstractMesh>(); // Map of player ID to mesh
    
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


        // Initialize the player
        const isLocalPlayer = sessionId === room.sessionId;
        const playerMesh = await initializePlayer({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera });
        
        // If the player is the local player, set the player model
        if (isLocalPlayer && playerMesh) {
            playerModel = playerMesh;
        }
    
        // Update the player's position when it changes 
        player.onChange(() => {
            // Only update the mesh if it's not the local player
            const playerMesh = playerMeshes.get(playerID);
           
            if (playerMesh && sessionId !== room.sessionId) {
                const targetPosition = new Vector3(player.x, player.y, player.z);
                interpolatePlayerPosition(playerMesh, targetPosition);

                const targetRotation = player.rotationY;
                interpolatePlayerRotation(playerMesh, targetRotation);
            }
        });
    })

    // Update the player model's position and rotation every frame
    scene.registerBeforeRender(() => {
        if (playerModel) {
            // Calculate the target position (where the player should be)
            const targetPosition = camera.position.clone();
            targetPosition.y -= 0.5; // Adjust for camera height offset

            interpolatePlayerPosition(playerModel, targetPosition);

            // Update player model rotation to match camera | We don't interpolate local player rotation
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

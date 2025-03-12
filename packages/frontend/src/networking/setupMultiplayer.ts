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
            playerMeshes.set(sessionId, mesh); // Store the id and player's mesh in the map

            // If the player is the local player, set the camera position and target, and hide the mesh
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

// Update the player's position and rotation and send it to the server
const updatePlayerPosition = (
    playerModel: AbstractMesh,
    camera: UniversalCamera,
    room: Room
) => {
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

export const setupMultiplayer = (
    scene: Scene,
    camera: UniversalCamera,
    existingRoom?: Room
) => {
    let playerModel: AbstractMesh | undefined;
    const playerMeshes = new Map<string, AbstractMesh>(); // Map of player ID to mesh
    let room: Room;
    let roomState: MyRoomState;
    
    if (!existingRoom) {
        return;
    }
    
    room = existingRoom; // If a room connection is provided, use it
    roomState = room.state;
    console.log("Setting up multiplayer with room: ", room)
    
    roomState.players.onAdd(async (player, sessionId) => {
        const playerID = sessionId;
        console.log("Player joined: ", player, playerID);

        // Check if the player is the local player
        const isLocalPlayer = sessionId === room.sessionId;

        // Initialize the player
        const playerMesh = await initializePlayer({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera });
        
        // If the player is the local player, set the player model
        if (isLocalPlayer && playerMesh) {
            playerModel = playerMesh;
        }
    
        player.onChange(() => {
            // Update the player's position when it changes if it's not the local player
            const currentPlayerMesh = playerMeshes.get(playerID);
            if (currentPlayerMesh && !isLocalPlayer) {
                const targetPosition = new Vector3(player.x, player.y, player.z);
                interpolatePlayerPosition(currentPlayerMesh, targetPosition);

                const targetRotation = player.rotationY;
                interpolatePlayerRotation(currentPlayerMesh, targetRotation);
            }
        });
    })

    // Update the player model's position and rotation every frame
    scene.registerBeforeRender(() => {
        if (playerModel) {
            updatePlayerPosition(playerModel, camera, room);
        }
    })
    
    // Dispose of the model when the player leaves
    roomState.players.onRemove((player, sessionId) => {
        console.log("Player left: ", player, sessionId);
        const playerMesh = playerMeshes.get(sessionId);
        if (playerMesh) {
            playerMesh.dispose();
            playerMeshes.delete(sessionId);
        }
    })

}

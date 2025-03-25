import { Scene, UniversalCamera, AbstractMesh, Vector3, AnimationGroup } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState, Player } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerTransformNode, PlayerTransformNode } from "../game/player/createPlayerTransformNode";
import { interpolatePlayerPosition } from "../game/player/interpolatePlayer";
import { SCENE_CONFIG } from "../game/config";
import { PlayerState } from "../game/player/PlayerState";

export const BACKEND_URL = import.meta.env.PROD 
    ? `wss://${import.meta.env.VITE_BACKEND_URL}` // Production URL
    : "ws://localhost:2567"; // Local URL


interface InitializePlayerProps {
    scene: Scene;
    sessionId: string;
    player: Player;
    playerMeshes: Map<string, AbstractMesh>;
    isLocalPlayer: boolean;
    camera: UniversalCamera;
}

const initializePlayer = async ({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera }: InitializePlayerProps): Promise<PlayerTransformNode | undefined> => {
    try {
        const { mesh, transformNode, animations } = await createPlayerTransformNode(scene);
        console.log(`Player created: ${sessionId}`, mesh);

        if (mesh) {
            mesh.position.set(player.x, 0, player.z); // Force Y position to 0 for ground level
            mesh.rotationQuaternion = null;
            
            if (isLocalPlayer) {
                // Hide the mesh
                mesh.isVisible = false;
                mesh.scaling = new Vector3(0.001, 0.001, 0.001); // This is a hack to make the mesh not visible. for some reason isVisible is not working will come back to this.
                
                // Set the camera to the player's position
                camera.position = mesh.position.clone();
                camera.position.y += 1;
                camera.position.z -= 5;
                camera.setTarget(mesh.position);
            } else {
                // For remote players
                mesh.isVisible = true;
                // mesh.scaling = SCENE_CONFIG.MODEL_CONFIG.scaling;
                // Rotate 180 degrees around X axis to flip model right-side up
                mesh.rotate(new Vector3(1, 0, 0), Math.PI);

                // Start with idle animation for remote players
                if (animations.idle) {
                    animations.idle.play(true);
                }
            }
            
            playerMeshes.set(sessionId, mesh);
            return {mesh, transformNode, animations};
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
    const targetPosition = camera.position.clone();
    targetPosition.y -= SCENE_CONFIG.GROUND_CONFIG.yOffset;

    interpolatePlayerPosition(playerModel, targetPosition);

    // Get camera rotation and add PI to face the correct direction
    const rotationY = camera.absoluteRotation.toEulerAngles().y + Math.PI;

    room.send("updatePosition", {
        x: playerModel.position.x,
        y: playerModel.position.y,
        z: playerModel.position.z,
        rotationY: rotationY
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
        const playerTransformNode = await initializePlayer({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera });
        
        // If the player is the local player, set the player model
        if (isLocalPlayer && playerTransformNode) {
            playerModel = playerTransformNode.mesh;
        }
    
        player.onChange(() => {
            const currentPlayerMesh = playerMeshes.get(playerID);
            if (currentPlayerMesh && !isLocalPlayer) {
                const targetPosition = new Vector3(player.x, player.y, player.z);
                interpolatePlayerPosition(currentPlayerMesh, targetPosition);

                // Ensure rotation is not locked
                currentPlayerMesh.rotationQuaternion = null;
                
                // Try rotating the mesh directly
                currentPlayerMesh.rotation.y = player.rotationY;
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

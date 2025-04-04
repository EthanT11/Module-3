import { Scene, UniversalCamera, AbstractMesh, Vector3, AnimationGroup, MeshBuilder, IMeshDataOptions, Space } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState, Player } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerTransformNode, PlayerTransformNode } from "../game/player/createPlayerTransformNode";
import { interpolatePlayerPosition } from "../game/player/interpolatePlayer";
import { SCENE_CONFIG } from "../game/config";
import { PlayerStateManager } from "../game/player/PlayerState";

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

const initializePlayerMesh = async ({ scene, sessionId, player, playerMeshes, isLocalPlayer, camera }: InitializePlayerProps): Promise<PlayerTransformNode | undefined> => {
    try {
        const { mesh, transformNode, animations } = await createPlayerTransformNode(scene);
        // console.log(`Player created: ${sessionId}`, {
        //     isLocal: isLocalPlayer,
        //     meshScale: mesh?.scaling.toString(),
        //     transformScale: transformNode?.scaling.toString()
        // });

        if (!mesh || !transformNode) return undefined;
        
        // Set initial position and rotation
        mesh.position.set(player.x, 0, player.z); // Force Y position to 0 for ground level
        mesh.rotationQuaternion = null;
        
        if (isLocalPlayer) {
            // Hide the local player mesh
            mesh.isVisible = false;
            mesh.getChildMeshes().forEach(childMesh => {
                childMesh.isVisible = false;
            });
            
            // Set the camera to the player's position
            camera.position = mesh.position.clone();
            camera.position.y += 1;
            camera.position.z -= 5;
            camera.setTarget(mesh.position);
        } else {
            // For remote players
            mesh.isVisible = true;
            mesh.rotationQuaternion = null;
            
            // Set initial rotation - keep upright and face forward
            mesh.rotation.x = 0;
            mesh.rotation.y = player.rotationY + Math.PI; // Add PI to face forward
            mesh.rotation.z = 0;
            
            // console.log(`Remote player ${sessionId} initial state:`, {
            //     rotation: mesh.rotation.toString(),
            //     position: mesh.position.toString(),
            //     scaling: mesh.scaling.toString()
            // });

            // Enable collisions for remote players only
            mesh.checkCollisions = true;
            mesh.ellipsoid = SCENE_CONFIG.CAMERA_CONFIG.ellipsoid;
            mesh.ellipsoidOffset = SCENE_CONFIG.CAMERA_CONFIG.ellipsoidOffset;
            
            // Enable collisions on the root mesh only
            mesh.getChildMeshes().forEach(childMesh => {
                childMesh.checkCollisions = false;
            });

            // Create a collision box for better player interaction
            const collisionBox = MeshBuilder.CreateBox("collisionBox_" + sessionId, {
                width: 1,
                height: 2,
                depth: 1
            }, scene);
            collisionBox.parent = mesh;
            collisionBox.position = new Vector3(0, 1, 0);
            collisionBox.visibility = 0;
            collisionBox.checkCollisions = true;
            collisionBox.isPickable = false;

            
            mesh.showBoundingBox = true;
            mesh.getChildMeshes().forEach(childMesh => {
                childMesh.showBoundingBox = true;
            });

            // Compute the bounding box info to ensure it's updated
            mesh.computeWorldMatrix(true);
            mesh.refreshBoundingInfo({});

        }

        // Start with idle animation for remote players
        if (animations.idle) {
            animations.idle.play(true);
        }
        
    
        playerMeshes.set(sessionId, mesh);
        return {mesh, transformNode, animations};
    } catch (error) {
        console.error("Error creating player: ", error);
        return undefined;
    }
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
    playerStateManager: PlayerStateManager,
    existingRoom?: Room,
) => {
    if (!existingRoom) return;

    const playerMeshes = new Map<string, AbstractMesh>(); // Map of player ID to mesh
    let localPlayerMesh: AbstractMesh | undefined;

    let room: Room;
    let roomState: MyRoomState;
    room = existingRoom; // If a room connection is provided, use it
    roomState = room.state;
    console.log("Setting up multiplayer with room: ", room)
    
    roomState.players.onAdd(async (player, sessionId) => {
        // Check if the player is the local player
        const isLocalPlayer = sessionId === room.sessionId;
        
        // Add new player to player state manager
        playerStateManager.addPlayer(sessionId);
        if (isLocalPlayer) {
            playerStateManager.setLocalPlayer(sessionId);
        }

        const playerTransformNode = await initializePlayerMesh({ 
            scene, 
            sessionId, 
            player, 
            playerMeshes, 
            isLocalPlayer, 
            camera 
        });
        
        if (isLocalPlayer && playerTransformNode) {
            localPlayerMesh = playerTransformNode.mesh;
        }
    
        player.onChange(() => {
            // Fetch the changing player's mesh and player state
            const currentPlayerMesh = playerMeshes.get(sessionId);
            const playerState = playerStateManager.getPlayer(sessionId);
            
            // If the player is not the local player and the player state exists, update the player's position and rotation
            if (currentPlayerMesh && !isLocalPlayer && playerState) {
                const targetPosition = new Vector3(player.x, player.y, player.z);
                playerState.updatePosition(targetPosition);
                playerState.updateRotationY(player.rotationY);
                
                interpolatePlayerPosition(currentPlayerMesh, targetPosition);
                currentPlayerMesh.rotationQuaternion = null;
                currentPlayerMesh.rotation.x = 0;
                currentPlayerMesh.rotation.y = player.rotationY + Math.PI; // Add PI to face forward
                currentPlayerMesh.rotation.z = 0;
                
                // console.log(`Remote player ${sessionId} update:`, {
                //     rotation: currentPlayerMesh.rotation.toString(),
                //     position: currentPlayerMesh.position.toString()
                // });
            }
        });
    });

    // Update the player model's position and rotation every frame
    scene.registerBeforeRender(() => {
        if (localPlayerMesh) {
            updatePlayerPosition(localPlayerMesh, camera, room);
        }
    })
    
    // Dispose of the model when the player leaves
    roomState.players.onRemove((player, sessionId) => {
        console.log("Player left: ", player, sessionId);
        const removedPlayerMesh = playerMeshes.get(sessionId);
        if (removedPlayerMesh) {
            removedPlayerMesh.dispose();
            playerMeshes.delete(sessionId);
            playerStateManager.removePlayer(sessionId);
        }
    })

}

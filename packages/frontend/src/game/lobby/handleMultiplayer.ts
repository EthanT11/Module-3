import { Scene, AbstractMesh } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState } from "../../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerModel } from "./createPlayerModel";
import { AnimationHandler } from "./handleAnimations";

export const playerMeshes = new Map<string, AbstractMesh>();
export const playerAnimations = new Map<string, AnimationHandler>();

export const handleMultiplayer = (
    scene: Scene,
    room: Room,
    playerMesh: AbstractMesh
) => {
    if (!room) return;

    let roomState: MyRoomState;
    roomState = room.state;

    // Send initial position when joining
    room.send("updatePosition", {
        x: playerMesh.position.x,
        y: playerMesh.position.y,
        z: playerMesh.position.z,
        rotationY: playerMesh.rotation.y
    });

    // When a player joins the room
    roomState.players.onAdd(async (player, sessionId) => {
        const isLocalPlayer = sessionId === room.sessionId;
        // Don't need to create a model for local players
        if (isLocalPlayer) return;

        // Create a model for remote players
        const playerResult = await createPlayerModel(scene, sessionId);
        if (!playerResult) {
            console.error("CreateLobby: Failed to create player");
            return;
        }
        const { playerMesh: remoteMesh, animations: remoteAnimations } = playerResult;
        playerMesh.showBoundingBox = true;
        remoteMesh.showBoundingBox = true;
        
        // Store remote player mesh in map
        playerMeshes.set(sessionId, remoteMesh);

        // Setup animation handler
        const animationHandler = new AnimationHandler(scene, remoteAnimations);
        playerAnimations.set(sessionId, animationHandler);
        

        // Set initial position
        remoteMesh.position.set(player.x, player.y, player.z);
        remoteMesh.rotation.y = player.rotationY;
    });
    
    roomState.players.onRemove((player, sessionId) => {
        console.log("Player left: ", player, sessionId);
        // Remote Player Mesh
        const removedPlayerMesh = playerMeshes.get(sessionId);
        if (removedPlayerMesh) {
            removedPlayerMesh.dispose();
            playerMeshes.delete(sessionId);
        }

        // Remote Player Animation Handler
        const animationHandler = playerAnimations.get(sessionId);
        if (animationHandler) {
            animationHandler.dispose();
            playerAnimations.delete(sessionId);
        }
    });

    // Update remote player positions
    scene.onBeforeRenderObservable.add(() => {
        roomState.players.forEach((player, sessionId) => {
            if (sessionId === room.sessionId) return; // Skip local player

            const remoteMesh = playerMeshes.get(sessionId);
            const animationHandler = playerAnimations.get(sessionId);
            
            if (remoteMesh) {
                remoteMesh.position.set(player.x, player.y, player.z);
                remoteMesh.rotation.y = player.rotationY;

                // Handle remote player movement animation
                if (animationHandler) {
                    const isMoving = player.isMoving;
                    animationHandler.handleMovement(isMoving);
                }
            }
        });
    });

    // Send local player position updates
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1; // Update every 100ms, lower is smoother BUT may cause lag

    scene.onBeforeRenderObservable.add(() => {
        if (playerMesh) {
            const currentTime = Date.now();
            // Check if the current time minus the last update time is greater than the update interval
            if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
                room.send("updatePosition", {
                    x: playerMesh.position.x,
                    y: playerMesh.position.y,
                    z: playerMesh.position.z,
                    rotationY: playerMesh.rotation.y
                });
                lastUpdateTime = currentTime;
            }
        }
    });
};
import { Scene, AbstractMesh } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState } from "../../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerModel } from "./createPlayerModel";

const playerMeshes = new Map<string, AbstractMesh>();

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
        const playerResult = await createPlayerModel(scene);
        if (!playerResult) {
            console.error("CreateLobby: Failed to create player");
            return;
        }
        const { playerMesh: remoteMesh } = playerResult;
        playerMesh.showBoundingBox = true;
        remoteMesh.showBoundingBox = true;
        
        // Store remote player mesh in map
        playerMeshes.set(sessionId, remoteMesh);

        // Set initial position
        remoteMesh.position.set(player.x, player.y, player.z);
        remoteMesh.rotation.y = player.rotationY;
    });
    
    roomState.players.onRemove((player, sessionId) => {
        console.log("Player left: ", player, sessionId);
        const removedPlayerMesh = playerMeshes.get(sessionId);
        if (removedPlayerMesh) {
            removedPlayerMesh.dispose();
            playerMeshes.delete(sessionId);
        }
    });

    // Update remote player positions
    scene.onBeforeRenderObservable.add(() => {
        roomState.players.forEach((player, sessionId) => {
            if (sessionId === room.sessionId) return; // Skip local player

            const remoteMesh = playerMeshes.get(sessionId);
            if (remoteMesh) {
                remoteMesh.position.set(player.x, player.y, player.z);
                remoteMesh.rotation.y = player.rotationY;
            }
        });
    });

    // Send local player position updates
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 100; // Update every 100ms, lower is smoother BUT may cause lag

    scene.onBeforeRenderObservable.add(() => {
        if (playerMesh) {
            const currentTime = Date.now();
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
import { Scene, AbstractMesh } from "@babylonjs/core";
import { Room } from "colyseus.js";
import { MyRoomState } from "../../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { createPlayerModel } from "./createPlayerModel";
import { AnimationHandler, PlayerAnimation } from "./handleAnimations";
import { PlayerState } from "./PlayerState";
import { GameHUD } from "../game_hud/GameHUD";

export const playerMeshes = new Map<string, AbstractMesh>();
export const remotePlayerStates = new Map<string, PlayerState>();
export const playerAnimations = new Map<string, AnimationHandler>();

const sendLocalPlayerPosition = (room: Room, playerState: PlayerState) => {
    const localPlayerPosition = playerState.getPosition();
    const localPlayerRotationY = playerState.getRotationY();
    
    room.send("updatePosition", {
        x: localPlayerPosition.x,
        y: localPlayerPosition.y,
        z: localPlayerPosition.z,
        rotationY: localPlayerRotationY
    });
};

export const handleMultiplayer = (
    scene: Scene,
    room: Room,
    playerState: PlayerState,
    gameHUD: GameHUD
) => {
    if (!room) return;

    let roomState: MyRoomState;
    roomState = room.state;

    // Ready States
    const playerReadyStates = new Map<string, boolean>();

    // Function to update ready states in HUD
    const updateReadyStatesInHUD = () => {
        const allPlayersReady = Array.from(playerReadyStates.values()).every(ready => ready);
        const hasMultiplePlayers = playerReadyStates.size >= 2;
        
        // Enable/disable start button based on ready states
        if (playerState.isHost) {
            gameHUD.setStartButtonEnabled(allPlayersReady && hasMultiplePlayers);
        }
    };

    // Send local player position to server
    sendLocalPlayerPosition(room, playerState);

    // Send initial ready state to server
    room.send("setReady", {
        ready: playerState.getIsReady()
    });

    // Initialize ready states for existing players
    roomState.players.forEach((player, sessionId) => {
        playerReadyStates.set(sessionId, player.ready);
        // Update player list with ready indicators
        gameHUD.updatePlayerReady(sessionId, player.ready);
    });
    updateReadyStatesInHUD();

    // Handle ready state updates
    room.onMessage("playerReady", (message) => {
        console.log("Player ready state update:", message);
        playerReadyStates.set(message.playerId, message.ready);
        
        // Update HUD to reflect ready states
        updateReadyStatesInHUD();
        
        // Update player list with ready indicators
        gameHUD.updatePlayerReady(message.playerId, message.ready);
    });

    // Handle game start
    room.onMessage("gameStarted", () => {
        console.log("Game started!");
        // TODO: Navigate to game screen or start the actual game
        // For now, just log the event
    });

    // Handle start game error
    room.onMessage("startGameError", (message) => {
        console.log("Start game error:", message.message);
        // TODO: Show error message to user
    });

    // Handle hit notifications
    room.onMessage("hit", (message) => {
        console.log("Hit received: ", message);
        // If the hit player is the local player
        if (message.hitPlayer === room.sessionId) {
            console.log(`You were hit for ${message.damage} damage!`);
            playerState.setHealth(playerState.getHealth() - message.damage);
            console.log(`Your health is now ${playerState.getHealth()}`);
            
            // Play hit animation
            const animationHandler = playerState.getAnimationHandler();
            if (animationHandler) {
                animationHandler.handleHit(true);
                // Reset hit state after animation
                setTimeout(() => {
                    animationHandler.handleHit(false);
                }, 500); // Adjust timing based on your hit animation length
            }
        } else {
            // If the hit player is a remote player
            const remotePlayerMesh = playerMeshes.get(message.hitPlayer);
            if (remotePlayerMesh) {
                const remotePlayerAnimationHandler = playerAnimations.get(message.hitPlayer);
                if (remotePlayerAnimationHandler) {
                    remotePlayerAnimationHandler.handleHit(true);
                    // Reset hit state after animation
                    setTimeout(() => {
                        remotePlayerAnimationHandler.handleHit(false);
                    }, 1000); 
                }
            }
        }
    });

    // Handle punch animations from remote players
    room.onMessage("punch", (message) => {
        console.log("Punch received: ", message);
        const remotePlayerAnimationHandler = playerAnimations.get(message.playerId);
        if (remotePlayerAnimationHandler) {
            remotePlayerAnimationHandler.handlePunch(true);
            // Reset punch state after animation completes
            setTimeout(() => {
                remotePlayerAnimationHandler.handlePunch(false);
            }, 1000);
        }
    });

    // When a player joins the room
    roomState.players.onAdd(async (player, sessionId) => {
        const isLocalPlayer = sessionId === room.sessionId;
        
        // Track ready state for all players
        playerReadyStates.set(sessionId, player.ready);
        updateReadyStatesInHUD();
        
        // Update player list
        gameHUD.updatePlayerReady(sessionId, player.ready);
        
        // Don't need to create a model for local players
        if (isLocalPlayer) return;

        // Add player to HUD
        gameHUD.addPlayer(sessionId, "-");

        // Create a model for remote players
        const playerResult = await createPlayerModel(scene, sessionId);
        if (!playerResult) {
            console.error("CreateLobby: Failed to create player");
            return;
        }
        const { playerMesh: remoteMesh, animations: remoteAnimations } = playerResult;
        
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
        
        // Remove ready state
        playerReadyStates.delete(sessionId);
        updateReadyStatesInHUD();
        
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
                // Update the mesh position
                remoteMesh.position.set(player.x, player.y, player.z);
                remoteMesh.rotation.y = player.rotationY;

                // Update the player state if it exists
                const remotePlayerState = remotePlayerStates.get(sessionId);
                if (remotePlayerState) {
                    remotePlayerState.updatePosition(player.x, player.y, player.z);
                    remotePlayerState.setRotationY(player.rotationY);
                }

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
    const UPDATE_INTERVAL = 50;

    scene.onBeforeRenderObservable.add(() => {
        const currentTime = Date.now();
        // Check if the current time minus the last update time is greater than the update interval
        if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
            sendLocalPlayerPosition(room, playerState);
            lastUpdateTime = currentTime;
        }
    });
};
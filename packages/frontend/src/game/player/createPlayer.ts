import { AbstractMesh, Scene, UniversalCamera, TransformNode } from "@babylonjs/core";
// TODO: Set up index.ts for player setup
import { handlePlayerMovement } from "./handlePlayerMovement";
import { createPlayerTransformNode, PlayerTransformNode } from "./createPlayerTransformNode";
import { PlayerStateManager } from "./PlayerState";

export const createPlayer = async (scene: Scene, camera: UniversalCamera, playerStateManager: PlayerStateManager): Promise<void> => {
    let playerModel: PlayerTransformNode | undefined;

    try {
        // Load the player mesh & transform node
        playerModel = await createPlayerTransformNode(scene);
        if (!playerModel.mesh || !playerModel.transformNode) {
            console.error("Player mesh not found: setupPlayer");
            return;
        }
        
        // We want the camera to be a child of the player transform
        camera.parent = playerModel.transformNode;
        handlePlayerMovement(camera, scene, playerModel, playerStateManager);
        
    } catch (error) {
        console.error("Error setting up player:", error);
        throw error;
    }
}
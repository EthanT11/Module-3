import { AbstractMesh, Scene, UniversalCamera } from "@babylonjs/core";
// TODO: Set up index.ts for player setup
import { handlePlayerMovement } from "../player/handlePlayerMovement";
import { createPlayerTransformNode, PlayerTransformNode } from "../player/createPlayerTransformNode";

export const setupPlayer = async (scene: Scene, camera: UniversalCamera): Promise<void> => {
    let player: PlayerTransformNode | undefined;

    try {
        // Load the player mesh & transform node
        player = await createPlayerTransformNode(scene);
        if (!player.mesh || !player.transformNode) {
            console.error("Player mesh not found: setupPlayer");
            return;
        }
        
        // We want the camera to be a child of the player transform
        camera.parent = player.transformNode; 
        handlePlayerMovement(camera, scene, player);
        
    } catch (error) {
        console.error("Error setting up player:", error);
        throw error;
    }
}
import { AbstractMesh, Scene, TransformNode, UniversalCamera } from "@babylonjs/core";
import useSupabase from "../../hooks/useSupabase";
import { SCENE_CONFIG } from "../config";
// TODO: Set up index.ts for player setup
import { handlePlayerMovement } from "../player/handlePlayerMovement";
import { handleLoadPlayerMesh } from "../player/handleLoadPlayerMesh";

export const setupPlayer = async (scene: Scene, camera: UniversalCamera): Promise<void> => {
    const { getAssetUrl } = useSupabase();
    const playerModelUrl = getAssetUrl("models", "humanMaleTest.glb");
    const playerMeshName = "HumanMale";

    let playerMesh: AbstractMesh | undefined;

    try {
        // Load the player mesh
        playerMesh = await handleLoadPlayerMesh(playerModelUrl, playerMeshName, scene);
        if (!playerMesh) {
            console.error("Player mesh not found: setupPlayer");
            return;
        }

        console.log("Player mesh loaded: ", playerMesh);

        // Place the mesh into a transform node to parent the camera & 
        const playerTransformNode = new TransformNode("playerTransformNode", scene);
        playerTransformNode.addChild(playerMesh); // Add the player mesh to the transform node

        playerTransformNode.scaling = SCENE_CONFIG.MODEL_CONFIG.scaling; // Scale the player mesh
        playerTransformNode.position = SCENE_CONFIG.CAMERA_CONFIG.startPosition;  // Set the position of the player mesh

        scene.addMesh(playerMesh);
        
        camera.parent = playerTransformNode; // We want the camera to be a child of the player transform
        handlePlayerMovement(camera, scene, playerMesh);

        // TODO: Add Player Animation
        // TODO: Add collision to transform node
        
    } catch (error) {
        console.error("Error setting up player:", error);
        throw error;
    }
}
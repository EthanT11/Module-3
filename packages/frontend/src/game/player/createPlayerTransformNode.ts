import { AssetContainer, LoadAssetContainerAsync, AbstractMesh, Scene, LoadAssetContainerOptions, TransformNode, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import useSupabase from "../../hooks/useSupabase";

export interface PlayerTransformNode {
    mesh: AbstractMesh | undefined;
    transformNode: TransformNode | undefined;
}

const loadPlayerMesh = async (scene: Scene): Promise<AbstractMesh | undefined> => {
    const { getAssetUrl } = useSupabase();
    const modelUrl = getAssetUrl("models", "bot.glb");
    const rootMeshName = "__root__"; // We need the root mesh to be the player model

    let playerMesh: AbstractMesh | undefined = undefined;

    // AssetContainer options
    const containerOptions: LoadAssetContainerOptions = {
        pluginExtension: ".glb"
    }
    
    // Load the player model from Supabase and place it in a asset container
    const modelContainer: AssetContainer = await LoadAssetContainerAsync(
        modelUrl,
        scene,
        containerOptions
    )
    
    // Add all meshes and animations to the scene
    modelContainer.meshes.forEach(mesh => {
        scene.addMesh(mesh);
        mesh.rotate(new Vector3(1, 0, 0), Math.PI); // Rotate the mesh 180 degrees around the X axis to flip it right-side up
    });

    modelContainer.animationGroups.forEach(group => {
        scene.addAnimationGroup(group);
    });

    // Play idle animation if it exists
    const idleAnim = modelContainer.animationGroups.find(group => group.name === "idle"); // idle, jump, run
    if (idleAnim) {
        idleAnim.play(true);
    }
    
    // Find the root mesh that contains all parts
    playerMesh = modelContainer.meshes.find(mesh => mesh.name === rootMeshName);
    if (!playerMesh) {
        console.error("Error loading player mesh: ", modelUrl);
        return;
    }
    console.log("Player mesh loaded: ", playerMesh.position); 
    
    return playerMesh;
}

// Returns an object with the mesh and transform node { mesh: AbstractMesh, transformNode: TransformNode }
export const createPlayerTransformNode = async (scene: Scene): Promise<PlayerTransformNode> => {
    let mesh: AbstractMesh | undefined = undefined;
    let transformNode: TransformNode | undefined = undefined;
    let result: PlayerTransformNode | undefined = { mesh, transformNode }; 

    try {
        mesh = await loadPlayerMesh(scene);
        if (!mesh) {
            console.error("Error loading player mesh: createPlayerTransformNode.ts");
            return result;
        }
        
        // Create a transform node to hold the player model
        transformNode = new TransformNode("playerTransformNode", scene);
        transformNode.addChild(mesh);

        transformNode.scaling = SCENE_CONFIG.MODEL_CONFIG.scaling;
        transformNode.position = SCENE_CONFIG.CAMERA_CONFIG.startPosition;

        // Add the mesh to the scene
        scene.addMesh(mesh);

        result = { mesh, transformNode };

        return result;
    } catch (error) {
        console.error("Error creating player transform node:", error);
        throw error;
    }
}

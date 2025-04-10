import { AssetContainer, LoadAssetContainerAsync, AbstractMesh, Scene, LoadAssetContainerOptions, TransformNode, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import useSupabase from "../../hooks/useSupabase";

export interface PlayerTransformNode {
    mesh: AbstractMesh | undefined;
    transformNode: TransformNode | undefined;
    // TODO: Find type for animations
    animations: {
        jump?: any;
        run?: any;
        idle?: any;
    };
}

const loadPlayerMesh = async (scene: Scene): Promise<{ mesh: AbstractMesh | undefined, animations: any }> => {
    const { getAssetUrl } = useSupabase();
    const modelUrl = getAssetUrl("models", "botwithanimsnohead.glb");
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
        // console.log("Adding mesh to scene: ", mesh);
        scene.addMesh(mesh);
        mesh.scaling = new Vector3(1, 1, 1);
        
        // console.log(`Initial mesh state for ${mesh.name}:`, {
        //     rotation: mesh.rotation.toString(),
        //     position: mesh.position.toString(),
        //     scaling: mesh.scaling.toString()
        // });
    });

    // Probably don't need to add these to the scene EVERY time we load a player
    modelContainer.animationGroups.forEach(group => {
        if (scene.animationGroups.find(g => g.name === group.name)) { // If the animation group already exists, remove it || This is to prevent duplicate animation groups
            scene.removeAnimationGroup(group);
        }
        scene.addAnimationGroup(group);
    });
    // console.log("Scene Animation Groups: ", scene.animationGroups);
    
    // Find the root mesh that contains all parts
    playerMesh = modelContainer.meshes.find(mesh => mesh.name === rootMeshName);
    if (!playerMesh) {
        console.error("Error loading player mesh: ", modelUrl);
        return { mesh: undefined, animations: {} };
    } 
    
    // Set initial rotation to face forward
    if (playerMesh) {
        // Model is naturally upright but facing backward, so rotate 180° around Y to face forward
        playerMesh.rotation.y = Math.PI;
        console.log("Set player mesh to face forward:", playerMesh.rotation);
    }
    
    const animations = {
        jump: modelContainer.animationGroups.find(group => group.name === "jump"),
        run: modelContainer.animationGroups.find(group => group.name === "run"),
        idle: modelContainer.animationGroups.find(group => group.name === "idle")
    };
    
    return { mesh: playerMesh, animations };
}

// Returns an object with the mesh and transform node { mesh: AbstractMesh, transformNode: TransformNode, animations: {}}
export const createPlayerTransformNode = async (scene: Scene): Promise<PlayerTransformNode> => {
    let mesh: AbstractMesh | undefined = undefined;
    let transformNode: TransformNode | undefined = undefined;
    let result: PlayerTransformNode = { 
        mesh, 
        transformNode,
        animations: {} 
    };

    try {
        const { mesh: loadedMesh, animations } = await loadPlayerMesh(scene);
        mesh = loadedMesh;
        if (!mesh) {
            console.error("Error loading player mesh: createPlayerTransformNode.ts");
            return result;
        }
        
        // Create a transform node to hold the player model
        transformNode = new TransformNode("playerTransformNode", scene);
        transformNode.addChild(mesh);

        // Set initial transform
        transformNode.scaling = SCENE_CONFIG.MODEL_CONFIG.scaling;
        transformNode.position = SCENE_CONFIG.CAMERA_CONFIG.startPosition;
        transformNode.rotation = new Vector3(0, 0, 0); // Keep transform node rotation neutral

        // Add the mesh to the scene
        scene.addMesh(mesh);
        // console.log("Transform node animations: ", transformNode.animations);

        result = { mesh, transformNode, animations };

        return result;
    } catch (error) {
        console.error("Error creating player transform node:", error);
        throw error;
    }
}

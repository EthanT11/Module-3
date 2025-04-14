import { AssetContainer, LoadAssetContainerAsync, AbstractMesh, Scene, LoadAssetContainerOptions, TransformNode, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
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
    // TODO: Put this in config
    const modelFile = "botwithanimsnohead.glb";
    let modelUrl: string;

    try {
        const { getAssetUrl } = useSupabase();
        modelUrl = getAssetUrl("models", modelFile);
        // console.log("Attempting to load from Supabase:", modelUrl);
    } catch (error) {
        console.warn("Failed to get model from Supabase, using local file:", error);
        modelUrl = `/models/${modelFile}`;
        console.warn("Falling back to local file:", modelUrl);
    }
    
    let playerMesh: AbstractMesh | undefined = undefined;
    
    try {
        // AssetContainer options
        const containerOptions: LoadAssetContainerOptions = {
            pluginExtension: ".glb"
        }
        
        // Load the player model and place it in an asset container
        const modelContainer: AssetContainer = await LoadAssetContainerAsync(
            modelUrl,
            scene,
            containerOptions
        ).catch(async (error) => {
            console.warn("Failed to load from Supabase, trying local file:", error);
            modelUrl = `/models/${modelFile}`;
            return await LoadAssetContainerAsync(modelUrl, scene, containerOptions);
        });
        
        // console.log("Model loaded successfully");
        
        // Add all meshes and animations to the scene
        modelContainer.meshes.forEach(mesh => {
            // console.log("Adding mesh to scene:", mesh.name);
            scene.addMesh(mesh);
            mesh.scaling = new Vector3(1, 1, 1);
        });
        
        // Add animations
        // TODO: Try and reuse animation groups since models aren't likely to change
        modelContainer.animationGroups.forEach(group => {
            // console.log("Found animation group:", group.name);
            if (scene.animationGroups.find(g => g.name === group.name)) {
                scene.removeAnimationGroup(group);
            }
            scene.addAnimationGroup(group);
        });
        
        // Find the root mesh
        const rootMeshName = "__root__";
        playerMesh = modelContainer.meshes.find(mesh => mesh.name === rootMeshName);
        if (!playerMesh) {
            console.error("Root mesh not found. Available meshes:", modelContainer.meshes.map(m => m.name));
            return { mesh: undefined, animations: {} };
        }
        
        // Set initial rotation
        playerMesh.rotation.y = Math.PI;
        console.log("Player mesh setup complete");
        
        const animations = {
            jump: modelContainer.animationGroups.find(group => group.name === "jump"),
            run: modelContainer.animationGroups.find(group => group.name === "run"),
            idle: modelContainer.animationGroups.find(group => group.name === "idle")
        };
        
        return { mesh: playerMesh, animations };
    } catch (error) {
        console.error("Error in loadPlayerMesh:", error);
        throw error;
    }
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

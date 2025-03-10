import { AssetContainer, LoadAssetContainerAsync, AbstractMesh, Scene, LoadAssetContainerOptions, TransformNode } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import useSupabase from "../../hooks/useSupabase";

export interface PlayerTransformNode {
    mesh: AbstractMesh | undefined;
    transformNode: TransformNode | undefined;
}

const loadPlayerMesh = async (scene: Scene): Promise<AbstractMesh | undefined> => {
    const { getAssetUrl } = useSupabase();
    const modelUrl = getAssetUrl("models", "zombieMan.glb");
    const meshName = "HumanMale";

    let playerMesh: AbstractMesh | undefined = undefined;

    // container options
    const containerOptions: LoadAssetContainerOptions = {
        pluginExtension: ".glb", // Need explicit extension for glb files
    }
    
    // LoadAssetContainer returns a container with all the meshes, skeletons, and animation groups
    const modelContainer: AssetContainer = await LoadAssetContainerAsync(
        modelUrl,
        scene,
        containerOptions
    )
    
    // Find the mesh in the container
    playerMesh = modelContainer.meshes.find(mesh => mesh.name === meshName);
    if (!playerMesh) {
        console.error("Error loading player mesh: ", modelUrl);
        return;
    }

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
    
        transformNode = new TransformNode("playerTransformNode", scene);
        transformNode.addChild(mesh);

        transformNode.scaling = SCENE_CONFIG.MODEL_CONFIG.scaling;
        transformNode.position = SCENE_CONFIG.CAMERA_CONFIG.startPosition;
        
        scene.addMesh(mesh);
        result = { mesh, transformNode };

        return result;
    } catch (error) {
        console.error("Error creating player transform node:", error);
        throw error;
    }
}

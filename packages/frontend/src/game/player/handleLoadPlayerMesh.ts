import { LoadAssetContainerAsync, AbstractMesh, Scene, LoadAssetContainerOptions } from "@babylonjs/core";

// TODO: As we add more models, we should probably move this to a separate file and make it more universal | hook
export const handleLoadPlayerMesh = async (modelUrl: string, meshName: string, scene: Scene): Promise<AbstractMesh | undefined> => {
    // container options
    const containerOptions: LoadAssetContainerOptions = {
        pluginExtension: ".glb", // Need explicit extension for glb files
    }
    
    // LoadAssetContainer returns a container with all the meshes, skeletons, and animation groups
    const modelContainer = await LoadAssetContainerAsync(
        modelUrl,
        scene,
        containerOptions
    )
    
    // Find the mesh in the container
    const mesh = modelContainer.meshes.find(mesh => mesh.name === meshName);
    if (!mesh) {
        console.error("Mesh not found: ", meshName);
        return undefined;
    }
    
    return mesh;
}

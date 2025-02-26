import { Scene, 
    LoadAssetContainerAsync, LoadAssetContainerOptions, 
    AbstractMesh, MeshBuilder, StandardMaterial, 
    CubeTexture, Texture, Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SCENE_CONFIG } from "../config";
import { createGroundMaterial } from "../materials/groundMaterial";
import useSupabase from "../../hooks/useSupabase";


// TODO: Maybe have a way to choose to load locally or from supabase
export const setupObjects = async (scene: Scene): Promise<void> => {
    const { getAssetUrl } = useSupabase();
    const playerModelUrl = getAssetUrl("models", "human.glb");
    const playerMeshName = "HumanMale";

    // TODO: As we add more models, we should probably move this to a separate file and make it more universal | hook
    const loadModelContainer = async (modelUrl: string, meshName: string): Promise<AbstractMesh | undefined> => {
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
            return;
        }

        return mesh;
    }


    try {
        // Scene objects
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.y = 20 // Same as the light
        
        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene); 
        box.position.x = 20
        box.checkCollisions = true;
        
        
        // Skybox
        // https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
        // https://opengameart.org/content/retro-skyboxes-pack
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false; 
        skyboxMaterial.disableLighting = true;
        skybox.infiniteDistance = true;
        skybox.material = skyboxMaterial;
        
        // TODO: Look into using a single texture for the skybox | dds files are faster to load
        skyboxMaterial.reflectionTexture = new CubeTexture(
            '',
            scene,
            null,
            undefined,
            [
                getAssetUrl("textures/skybox", "skybox_nx.jpg"), // Left
                getAssetUrl("textures/skybox", "skybox_py.jpg"), // Top
                getAssetUrl("textures/skybox", "skybox_nz.jpg"), // Back
                getAssetUrl("textures/skybox", "skybox_px.jpg"), // Right
                getAssetUrl("textures/skybox", "skybox_ny.jpg"), // Bottom
                getAssetUrl("textures/skybox", "skybox_pz.jpg"), // Front
            ]
        )
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        
        skybox.renderingGroupId = 0;
        
        
        // Floor
        const ground = MeshBuilder.CreateGround(
            "ground",
            SCENE_CONFIG.GROUND_CONFIG,
            scene
        );
        ground.checkCollisions = true;
        ground.material = createGroundMaterial(scene);
        
        console.log("Objects loaded");
        // Load player model
        const playerMesh = await loadModelContainer(playerModelUrl, playerMeshName);
        if (playerMesh) {
            scene.addMesh(playerMesh);
            playerMesh.position = new Vector3(0, 0, 0);
            playerMesh.rotation = new Vector3(0, Math.PI, 0);
            playerMesh.checkCollisions = true;
        }
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}
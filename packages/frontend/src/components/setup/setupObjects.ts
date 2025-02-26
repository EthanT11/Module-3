import { Scene, 
    LoadAssetContainerAsync, LoadAssetContainerOptions, 
    MeshBuilder, StandardMaterial, CubeTexture, Texture 
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { SCENE_CONFIG } from "../config";
import { createGroundMaterial } from "../materials/groundMaterial";
import useSupabase from "../../hooks/useSupabase";


// TODO: Maybe have a way to choose to load locally or from supabase
export const setupObjects = async (scene: Scene): Promise<void> => {
    const { getAssetUrl } = useSupabase();

    try {
        // Scene objects
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.y = 20 // Same as the light
        
        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene); 
        box.position.x = 20
        box.checkCollisions = true;

        // Load human model
        const playerModelContainerOptions: LoadAssetContainerOptions = {
            pluginExtension: ".glb", // Need explicit extension for glb files
        }

        // Load the model
        const playerModelContainer = await LoadAssetContainerAsync(
            getAssetUrl("models", "human.glb"),
            scene,
            playerModelContainerOptions
        )

        // Add the model to the scene | human.glb has two meshes, HumanMale and HumanFemale
        const playerMesh = playerModelContainer.meshes.find(mesh => mesh.name === "HumanMale");
        if (playerMesh) {
            scene.addMesh(playerMesh);
        }

        console.log("Model loaded: ", {
            meshes: playerModelContainer.meshes.length,
            meshNames: playerModelContainer.meshes.map(mesh => mesh.name),
            skeletons: playerModelContainer.skeletons.length,
            animationGroups: playerModelContainer.animationGroups.length
        });
        

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
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}
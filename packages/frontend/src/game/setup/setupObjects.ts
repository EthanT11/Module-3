import { Scene, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3 } from "@babylonjs/core";
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
        ground.isPickable = true;
        ground.material = createGroundMaterial(scene);

        // Add platforms
        const createPlatform = (x: number, y: number, z: number) => {
            const platform = MeshBuilder.CreateBox("platform", { 
                width: 4,
                height: 0.5,
                depth: 4
            }, scene);
            platform.position.set(x, y, z);
            platform.checkCollisions = true;
            platform.isPickable = true;
            platform.freezeWorldMatrix(); // Optimize performance for static objects

            // Visualize the collision box
            platform.showBoundingBox = true;
            
            return platform;
        };

        createPlatform(5, 2, 0);
        createPlatform(10, 4, 3);
        createPlatform(15, 6, -2);
        createPlatform(8, 8, 1);
        createPlatform(12, 10, -3);
        createPlatform(16, 12, 2);
        createPlatform(18, 14, -1);
        createPlatform(20, 16, 3);
        createPlatform(22, 18, -2);
        createPlatform(24, 20, 1);
        createPlatform(26, 22, -3);
        createPlatform(28, 24, 2);

        console.log("Objects loaded");
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}
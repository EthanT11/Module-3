import { Scene, MeshBuilder, StandardMaterial, CubeTexture, Texture } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import { createGroundMaterial } from "../materials/groundMaterial";
import useSupabase from "../../hooks/useSupabase";
export const setupObjects = (scene: Scene): void => {
    try {
        // Scene objects
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.y = 20 // Same as the light
        
        
        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene); 
        box.position.y = 1
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
        
        const { getTextureUrl } = useSupabase();
        // skyboxMaterial.reflectionTexture = new CubeTexture("/textures/skybox/skybox", scene); 
        skyboxMaterial.reflectionTexture = new CubeTexture(
            '',
            scene,
            null,
            undefined,
            [
                getTextureUrl("textures/skybox", "skybox_nx.jpg"), // Left
                getTextureUrl("textures/skybox", "skybox_py.jpg"), // Top
                getTextureUrl("textures/skybox", "skybox_nz.jpg"), // Back
                getTextureUrl("textures/skybox", "skybox_px.jpg"), // Right
                getTextureUrl("textures/skybox", "skybox_ny.jpg"), // Bottom
                getTextureUrl("textures/skybox", "skybox_pz.jpg"), // Front
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
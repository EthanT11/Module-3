import { Scene, MeshBuilder } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import { createGroundMaterial } from "../materials/groundMaterial";

export const setupObjects = (scene: Scene): void => {
    try {
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene) 
        sphere.position.y = 20 // Same as the light
        

        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene) 
        box.position.y = 1
        box.checkCollisions = true;

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
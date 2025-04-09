import { Scene, Color4, Color3, Engine } from "@babylonjs/core";
import { MAP_CONFIG } from "../map/mapConfig";
export const setupScene = async (engine: Engine): Promise<Scene> => {
    try {
        const scene = new Scene(engine);
        
        // Scene Colour 
        scene.clearColor = new Color4(0.5, 0.8, 0.9, 1);
        scene.ambientColor = new Color3(0.3, 0.3, 0.3);

        // Fog 
        scene.fogMode = Scene.FOGMODE_EXP2;
        scene.fogColor = MAP_CONFIG.FOG_CONFIG.color;
        scene.fogDensity = MAP_CONFIG.FOG_CONFIG.density;

        // Collisions
        scene.collisionsEnabled = true;

        // Pointer Lock
        scene.onPointerDown = (event) => {
            if (event.button === 0) {
                engine.enterPointerlock();
            }
            if (event.button === 1) {
                engine.exitPointerlock();
            }
        }
        console.log("Scene setup complete");
        return scene;
    } catch (error) {
        console.error("Error setting up scene:", error);
        throw error;
    }
}
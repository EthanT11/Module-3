import { Scene, Vector3, Color4, Color3, HemisphericLight, MeshBuilder, Engine } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupScene = async (engine: Engine): Promise<Scene> => {
    try {
        const scene = new Scene(engine);
        
        // Scene Colour 
        scene.clearColor = new Color4(0.5, 0.8, 0.9, 1);
        scene.ambientColor = new Color3(0.3, 0.3, 0.3);

        // Fog 
        scene.fogMode = Scene.FOGMODE_EXP2;
        // scene.fogColor = new Color3(0.5, 0.8, 0.9);
        const skyBlue = new Color3(255/255, 206/255, 235/255);
        scene.fogColor = skyBlue;
        scene.fogDensity = 0.05;

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
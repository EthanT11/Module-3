import { Engine, Scene, Color4, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupScene = (engine: Engine): Scene => {
    try {
        const scene = new Scene(engine); // Create a new scene
        scene.clearColor = new Color4(0.5, 0.5, 0.5, 1);
        
        scene.gravity = new Vector3(0, SCENE_CONFIG.GRAVITY, 0); // Gravity in babylon is measured in units/frame
        scene.collisionsEnabled = true;

        scene.onPointerDown = (event) => { // 0 left click, 1 middle click, 2 right click
            if (event.button === 0) { // Lock the camera to the player when they left click the screen
                engine.enterPointerlock();
            }
            if (event.button === 1) { // Unlock the camera when they middle mouse click the screen
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
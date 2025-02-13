import { Scene, HemisphericLight } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupLight = (scene: Scene): HemisphericLight => {
    try {
        const light = new HemisphericLight("light", SCENE_CONFIG.LIGHT_CONFIG.position, scene);
        light.intensity = SCENE_CONFIG.LIGHT_CONFIG.intensity;

        console.log("Light setup complete");
        return light;
    } catch (error) {
        console.error("Error setting up light:", error);
        throw error;
    }
}
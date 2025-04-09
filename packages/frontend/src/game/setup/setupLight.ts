import { Scene, HemisphericLight } from "@babylonjs/core";
import { MAP_CONFIG } from "../map/mapConfig";

export const setupLight = (scene: Scene): HemisphericLight => {
    try {
        const light = new HemisphericLight("light", MAP_CONFIG.LIGHT_CONFIG.position, scene);
        light.intensity = MAP_CONFIG.LIGHT_CONFIG.intensity;

        console.log("Light setup complete");
        return light;
    } catch (error) {
        console.error("Error setting up light:", error);
        throw error;
    }
}
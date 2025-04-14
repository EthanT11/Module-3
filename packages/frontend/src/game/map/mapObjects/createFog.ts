import { Color3, Scene } from "@babylonjs/core";

export type Fog = {
    fogColor: number[];
    fogDensity: number;
}

const createFog = (scene: Scene, fogColor?: number[], fogDensity?: number): Fog => {
    scene.fogMode = Scene.FOGMODE_EXP2;
    // Deconstruct recieved fogColor and fogDensity if remote player
    if (fogColor && fogDensity) {
        scene.fogColor = new Color3(fogColor[0], fogColor[1], fogColor[2]);
        scene.fogDensity = fogDensity;
    } else {
        // Generate random fog color and density for local player
        scene.fogColor = new Color3(Math.random(), Math.random(), Math.random());
        scene.fogDensity = (Math.random() * 0.05) + 0.01; // 0.1 is very thick
    }
    return { fogColor: [scene.fogColor.r, scene.fogColor.g, scene.fogColor.b], fogDensity: scene.fogDensity };
}

export default createFog;   
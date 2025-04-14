import { Color3, Scene } from "@babylonjs/core";

const createFog = (scene: Scene): { fogColour: Color3, fogDensity: number } => {
    const fogColour = new Color3(Math.random(), Math.random(), Math.random());
    const fogDensity = (Math.random() * 0.05) + 0.01; // 0.1 is very thick
    
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogColor = fogColour;
    scene.fogDensity = fogDensity;

    return { fogColour, fogDensity };
}

export default createFog;   
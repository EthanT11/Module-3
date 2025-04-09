import { Scene, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3 } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

import createMap from "../map/createMap";
import createSkyBox from "../map/createSkyBox";
import createGround from "../map/createGround";

export const setupObjects = async (scene: Scene): Promise<void> => {
    try {
        // Skybox
        createSkyBox(scene);
        
        // Floor
        createGround(scene);

        // Map
        createMap(scene);

        console.log("Objects loaded");
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}
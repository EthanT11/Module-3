import { MeshBuilder, Scene } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import createTexture from "../utility/createTexture";

const createGround = (scene: Scene, width?: number, height?: number) => {
    // if width and height are provided, use them otherwise default | For testing lobby
    const groundConfig = width && height ? { width, height } : MAP_CONFIG.GROUND_CONFIG;
    const ground = MeshBuilder.CreateGround(
        "ground",
        groundConfig,
        scene
    );
    ground.checkCollisions = true;
    ground.isPickable = true;
    ground.material = createTexture({ name: "ground", folderName: MAP_CONFIG.GROUND_CONFIG.assetFolder, uvScale: MAP_CONFIG.GROUND_CONFIG.uvScale, scene });

    return ground
}

export default createGround;

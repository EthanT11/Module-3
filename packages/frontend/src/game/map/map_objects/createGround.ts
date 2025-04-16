import { MeshBuilder, Scene } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import createTexture from "../utility/createTexture";

const createGround = (scene: Scene) => {
    const ground = MeshBuilder.CreateGround(
        "ground",
        MAP_CONFIG.GROUND_CONFIG,
        scene
    );
    ground.checkCollisions = true;
    ground.isPickable = true;
    ground.material = createTexture({ name: "ground", folderName: MAP_CONFIG.GROUND_CONFIG.assetFolder, uvScale: MAP_CONFIG.GROUND_CONFIG.uvScale, scene });

    return ground
}

export default createGround;

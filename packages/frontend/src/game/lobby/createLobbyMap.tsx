import { Color3, CreateGround, HemisphericLight, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { createWall } from "../map/map_objects";
import createTexture from "../map/utility/createTexture";
import { MAP_CONFIG } from "../map/mapConfig";

export const createLobbyMap = (scene: Scene) => {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    const groundOptions = {
        width: 1000,
        height: 1000,
        subdivisions: 10,
        subdivisionsX: 10,
    }   
    const ground = CreateGround("ground", groundOptions, scene);
    ground.position.y = 0;
    const groundMaterial = createTexture({name: "ground", folderName: MAP_CONFIG.GROUND_CONFIG.assetFolder, uvScale: MAP_CONFIG.GROUND_CONFIG.uvScale, scene});
    ground.material = groundMaterial;

    const wall = createWall(10, 10, 10, 10, 10, scene);
    wall.position.y = 0;
    wall.showBoundingBox = false;
}
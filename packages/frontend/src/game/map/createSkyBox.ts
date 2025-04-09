import { CubeTexture, StandardMaterial, MeshBuilder, Scene, Texture } from "@babylonjs/core";

import useSupabase from "../../hooks/useSupabase";

const createSkyBox = (scene: Scene) => {
    const { getAssetUrl } = useSupabase();
    // Skybox
    // https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
    // https://opengameart.org/content/retro-skyboxes-pack
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false; 
    skyboxMaterial.disableLighting = true;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
    
    // TODO: Look into using a single texture for the skybox | dds files are faster to load
    skyboxMaterial.reflectionTexture = new CubeTexture(
        '',
        scene,
        null,
        undefined,
        [
            getAssetUrl("textures/skybox", "skybox_nx.jpg"), // Left
            getAssetUrl("textures/skybox", "skybox_py.jpg"), // Top
            getAssetUrl("textures/skybox", "skybox_nz.jpg"), // Back
            getAssetUrl("textures/skybox", "skybox_px.jpg"), // Right
            getAssetUrl("textures/skybox", "skybox_ny.jpg"), // Bottom
            getAssetUrl("textures/skybox", "skybox_pz.jpg"), // Front
        ]
    )
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    
    skybox.renderingGroupId = 0;

    return skybox;
}

export default createSkyBox;
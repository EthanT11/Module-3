import { MeshBuilder, Scene } from "@babylonjs/core";
// Platforms
const createPlatform = (x: number, y: number, z: number, scene: Scene) => {
    const platform = MeshBuilder.CreateBox("platform", { 
        width: 4,
        height: 0.5,
        depth: 4
    }, scene);
    platform.position.set(x, y, z);

    platform.checkCollisions = true;
    platform.isPickable = true;

    platform.freezeWorldMatrix();
    
    return platform;
};

export default createPlatform;
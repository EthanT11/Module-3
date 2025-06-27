import { Color3, MeshBuilder, Scene, StandardMaterial, MultiMaterial, SubMesh } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import { createTexture } from ".";


// Walls
const createWall = (x: number, z: number, width: number, depth: number, height: number, scene: Scene) => {
    const wall = MeshBuilder.CreateBox("wall", { 
        width: width,
        height: height,
        depth: depth,
        // sideOrientation: 3
    }, scene);
    wall.position.set(x, height/2, z); // Position at half height so it sits on the ground
    wall.material = createTexture({name: "wall", folderName: MAP_CONFIG.WALL_CONFIG.assetFolder, uvScale: MAP_CONFIG.WALL_CONFIG.uvScale, scene});
    
    wall.checkCollisions = true;
    wall.isPickable = true;
    wall.freezeWorldMatrix(); // Optimize performance for static objects | Stops updating the walls since they're static
    
    return wall;
};

export default createWall;
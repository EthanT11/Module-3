import { MeshBuilder, Scene } from "@babylonjs/core";
import { MAP_CONFIG } from "../mapConfig";
import createTexture from "../utility/createTexture";

// Walls
const createWall = (x: number, z: number, width: number, depth: number, height: number, scene: Scene) => {
    const wall = MeshBuilder.CreateBox("wall", { 
        width: width,
        height: height,
        depth: depth
    }, scene);
    wall.position.set(x, height/2, z); // Position at half height so it sits on the ground
    
    wall.checkCollisions = true;
    wall.freezeWorldMatrix(); // Optimize performance for static objects
    
    wall.material = createTexture({name: "wall", folderName: MAP_CONFIG.WALL_CONFIG.assetFolder, uvScale: MAP_CONFIG.WALL_CONFIG.uvScale, scene}); 
    return wall;
};

export default createWall;
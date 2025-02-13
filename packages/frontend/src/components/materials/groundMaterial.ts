import { StandardMaterial, Texture, Scene } from "@babylonjs/core";


export const createGroundMaterial = (scene: Scene): StandardMaterial => {
    // TODO: Look into cleaning up this function
    try {
        const material = new StandardMaterial("groundMaterial", scene);
        const uvScale = 4; // Scale of the texture
        const textueArray: Texture[] = [];
        
        const diffuseTexture = new Texture("/textures/rocky_terrain/rocky_terrain_diffuse.jpg", scene);
        material.diffuseTexture = diffuseTexture; // A diffuse texture is a texture that is used to change the color of the material
        textueArray.push(diffuseTexture);

        const normalTexture = new Texture("/textures/rocky_terrain/rocky_terrain_normal.jpg", scene);
        material.bumpTexture = normalTexture; // A bump texture is a texture that is used to change the normal of the material | Normal is the direction of the material
        textueArray.push(normalTexture);

        const aoTexture = new Texture("/textures/rocky_terrain/rocky_terrain_ao.jpg", scene);
        material.ambientTexture = aoTexture; // A ambient texture is a texture that is used to change the ambient of the material | Ambient is the overall color of the material
        textueArray.push(aoTexture);

        const specularTexture = new Texture("/textures/rocky_terrain/rocky_terrain_spec.jpg", scene);
        material.specularTexture = specularTexture; // A specular texture is a texture that is used to change the specular of the material | Specular is the highlight of the material
        textueArray.push(specularTexture);


        textueArray.forEach(texture => { // Apply scale to each texture
            texture.uScale = uvScale;
                texture.vScale = uvScale;
            });

        return material;
    } catch (error) {
        console.error("Error setting up ground material:", error);
        throw error;
    }
}
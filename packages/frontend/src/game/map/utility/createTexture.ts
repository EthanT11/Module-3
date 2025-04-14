import { Texture } from "@babylonjs/core";
import { Scene } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core";
import useSupabase from "../../../hooks/useSupabase";

interface TextureProps {
    name: string;
    folderName: string;
    uvScale: number;
    scene: Scene;
}

const createTexture = ({ name, folderName, uvScale, scene }: TextureProps): StandardMaterial => {
    // TODO: Probably have a failsafe for if the texture can't be loaded from supabase then take from public folder
    // TODO: Maybe find a way to cache the textures so they don't have to be loaded every time
    
    try {
        const material = new StandardMaterial(`${name}Material`, scene);
        const textueArray: Texture[] = [];
        const { getAssetUrl } = useSupabase();

        const diffuseTexture = new Texture(getAssetUrl(`textures/${folderName}`, `${folderName}_diffuse.jpg`), scene);
        material.diffuseTexture = diffuseTexture; // A diffuse texture is a texture that is used to change the color of the material
        textueArray.push(diffuseTexture);

        const normalTexture = new Texture(getAssetUrl(`textures/${folderName}`, `${folderName}_normal.jpg`), scene);
        material.bumpTexture = normalTexture; // A bump texture is a texture that is used to change the normal of the material | Normal is the direction of the material
        textueArray.push(normalTexture);

        const aoTexture = new Texture(getAssetUrl(`textures/${folderName}`, `${folderName}_ao.jpg`), scene);
        material.ambientTexture = aoTexture; // A ambient texture is a texture that is used to change the ambient of the material | Ambient is the overall color of the material
        textueArray.push(aoTexture);

        textueArray.forEach(texture => { // Apply scale to each texture
            texture.uScale = uvScale;
                texture.vScale = uvScale;
        });

        return material;
    } catch (error) {
        console.error(`Error setting up ${name} material:`, error);
        throw error;
    }
}

export default createTexture;
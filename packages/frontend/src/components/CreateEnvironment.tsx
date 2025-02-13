import { Engine, Scene, MeshBuilder, Texture, StandardMaterial } from "@babylonjs/core"
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "./networking/setupMultiplayer";
import { setupCamera } from "./setup/setupCamera";
import { setupLight } from "./setup/setupLight";
import { setupScene } from "./setup/setupScene";
import { SCENE_CONFIG } from "./config";

// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// TEXTURES
// https://polyhaven.com/a/rocky_terrain_02 | Covered under CC0 license 

// TODOS:
// - Add a skybox
// - Add a UI
// - Add a player model
// - Add hands to screen
// - Add better movement | Sprinting, jumping, climbing?

const setupObjects = (scene: Scene): void => {
    try {
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene) 
        sphere.position.y = 20 // Same as the light
        

        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene) 
        box.position.y = 1
        box.checkCollisions = true;

        const ground = MeshBuilder.CreateGround(
            "ground",
            SCENE_CONFIG.GROUND_CONFIG,
            scene
        );
        ground.checkCollisions = true;
        ground.material = createGroundMaterial(scene);

        console.log("Objects loaded");
    } catch (error) {
        console.error("Error setting up objects:", error);
        throw error;
    }
}


const createGroundMaterial = (scene: Scene): StandardMaterial => {
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


const CreateEnvironment = () => {
    // TODO: Look into better error handling for the engine and canvas
    const reactCanvas = useRef(null); // Use useRef to store the canvas element

    useEffect(() => {
        const canvas = reactCanvas.current; // Get the canvas element
        if (!canvas) {
            console.error("CreateEnvironment: Canvas not found")
            return;
        }

        // Init
        const engine = new Engine(canvas, true) // First argument is the canvas element, second argument is antialiasing
        const scene = setupScene(engine);
        
        // Scene setup
        setupLight(scene);
        setupObjects(scene);
        const camera = setupCamera(scene, canvas);

        const { playerSphere } = setupMultiplayer(scene, camera); // Get the player sphere from the multiplayer setup

        engine.runRenderLoop(() => { 
            scene.render() // Render the scene
        })

        window.addEventListener("resize", () => {
            engine.resize() // Resize the engine when the window is resized
        })

        return () => {
            engine.dispose() // Dispose of the engine when the component unmounts | This is for clean up and memory management
        }

    }, [])

    return <canvas ref={reactCanvas} style={{ width: "100%", height: "100vh" }} />
};

export default CreateEnvironment;

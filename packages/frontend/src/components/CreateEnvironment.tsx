import { Engine } from "@babylonjs/core"
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "./networking/setupMultiplayer";
import { setupCamera } from "./setup/setupCamera";
import { setupLight } from "./setup/setupLight";
import { setupScene } from "./setup/setupScene";
import { setupObjects } from "./setup/setupObjects";

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

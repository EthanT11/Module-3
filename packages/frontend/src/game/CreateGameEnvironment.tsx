import { Engine } from "@babylonjs/core"
import { Room } from "colyseus.js";
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "../networking/setupMultiplayer";
import { setupPlayerCamera } from "./player/setupPlayerCamera";
import { setupLight } from "./setup/setupLight";
import { setupScene } from "./setup/setupScene";
import { setupObjects } from "./setup/setupObjects";
import { SCENE_CONFIG } from "./config";
import { setupPlayer } from "./setup/setupPlayer";
import { PlayerStateManager } from "./player/PlayerState";

// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// TEXTURES
// https://polyhaven.com/a/rocky_terrain_02 | Covered under CC0 license 

const CreateGameEnvironment = ({ room }: { room: Room }): JSX.Element => {
    // TODO: Look into better error handling for the engine and canvas
    const reactCanvas = useRef(null); // Use useRef to store the canvas element

    useEffect( () => {
        const canvas = reactCanvas.current; // Get the canvas element
        if (!canvas) {
            console.error("CreateEnvironment: Canvas not found")
            return;
        }

        // Init
        const engine = new Engine(canvas, SCENE_CONFIG.ANTIALIASING)
        engine.setHardwareScalingLevel(1.0); // Helps with performance on low end devices
        engine.maxFPS = SCENE_CONFIG.MAX_FPS;

        // Engine built in loading screen
        engine.loadingScreen.displayLoadingUI();
        engine.loadingScreen.loadingUIBackgroundColor = "white";

        try {
            // Scene setup
            const scene = setupScene(engine);
            setupLight(scene);
            setupObjects(scene);
            
            // Player setup
            // TODO: move the camera setup directly into the player setup
            const camera = setupPlayerCamera(scene, canvas);

            // Create the player state manager
            const playerStateManager = new PlayerStateManager();
            setupPlayer(scene, camera, playerStateManager);
            setupMultiplayer(scene, camera, playerStateManager, room);

            scene.executeWhenReady(() => {
                // Hide the loading screen when the scene is ready
                engine.loadingScreen.hideLoadingUI();

                engine.runRenderLoop(() => { 
                    scene.render() // Render the scene
                })
            })
        } catch (error) {
            console.error("CreateEnvironment: Error setting up scene", error);
            engine.loadingScreen.hideLoadingUI();
            // TODO: when we have a place to boot people if failed, this is where we do it
        }


        window.addEventListener("resize", () => {
            engine.resize() // Resize the engine when the window is resized
        })

        return () => {
            engine.dispose() // Dispose of the engine when the component unmounts | This is for clean up and memory management
        }

    }, [])

    return <canvas ref={reactCanvas} style={{ width: "100%", height: "100vh" }} />
};

export default CreateGameEnvironment;

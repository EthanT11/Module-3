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
        let engine: Engine;

        const setupGame = async () => {
            const canvas = reactCanvas.current;
            if (!canvas) {
                console.error("CreateEnvironment: Canvas not found")
                return;
            }

            // Init
            engine = new Engine(canvas, SCENE_CONFIG.ANTIALIASING)
            engine.setHardwareScalingLevel(1.0); // Helps with performance on low end devices
            engine.maxFPS = SCENE_CONFIG.MAX_FPS;

            // Start the loading screen
            // TODO: Customize the loading screen
            engine.loadingScreen.displayLoadingUI();
            engine.loadingScreen.loadingUIBackgroundColor = "white";

            try {
                const scene = await setupScene(engine);
                // TODO: Move setupLight and Objects into the scene function
                setupLight(scene); 
                setupObjects(scene);
                
                const camera = setupPlayerCamera(scene, canvas);
                const playerStateManager = new PlayerStateManager();
                setupPlayer(scene, camera, playerStateManager); // TODO: Probably consolidate this into the setupPlayerCamera function
                setupMultiplayer(scene, camera, playerStateManager, room);

                scene.executeWhenReady(() => {
                    engine.loadingScreen.hideLoadingUI();
                    engine.runRenderLoop(() => { 
                        scene.render()
                    })
                })
            } catch (error) {
                console.error("CreateEnvironment: Error setting up scene", error);
                engine.loadingScreen.hideLoadingUI();
            }
        };

        setupGame();

        window.addEventListener("resize", () => {
            engine.resize()
        })

        return () => {
            engine.dispose()
        }
    }, [])

    return <canvas ref={reactCanvas} style={{ width: "100%", height: "100vh" }} />
};

export default CreateGameEnvironment;

import { Engine } from "@babylonjs/core"
import { Room } from "colyseus.js";
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "../networking/setupMultiplayer";
import createPlayerCamera from "./player/createPlayerCamera";
import { setupScene } from "./setupScene";
import { SCENE_CONFIG } from "./config";
import { createPlayer } from "./player/createPlayer";
import { PlayerStateManager } from "./player/PlayerState";
import loadMap from "./map/loadMap";

// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// TEXTURES
// https://polyhaven.com/a/rocky_terrain_02 | Covered under CC0 license 

const CreateGameEnvironment = ({ room, isHost }: { room: Room, isHost: boolean }): JSX.Element => {
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
            engine.loadingScreen.loadingUIBackgroundColor = "teal";

            try {
                // Initialize the player state manager
                const playerStateManager = new PlayerStateManager();

                // Setup the scene
                const scene = await setupScene(engine);
                
                // Setup the player
                const camera = createPlayerCamera(scene, canvas);
                createPlayer(scene, camera, playerStateManager); // TODO: Probably consolidate this into the setupPlayerCamera function
                
                // Setup the multiplayer
                setupMultiplayer(scene, camera, playerStateManager, room);
                loadMap(scene, playerStateManager, isHost, room);

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

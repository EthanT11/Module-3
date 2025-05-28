import { Engine, Vector3, HemisphericLight } from "@babylonjs/core"
import { useRef, useEffect } from "react"
// import { setupMultiplayer } from "../../networking/setupMultiplayer";
import { setupScene } from "../setupScene";
import { SCENE_CONFIG } from "../config";
// import { PlayerStateManager } from "../player/PlayerState";
// import loadMap from "../map/loadMap";
// import { GameHUD } from "./game_hud/GameHUD";
import { useRoomContext } from "../../context/RoomContext";
import { useNavigate } from "react-router";
import { createGround } from "../map/map_objects";
import { setupMultiplayer } from "../../networking/setupMultiplayer";
import { createPlayerModel } from "./createPlayerModel";
import { createCamera } from "./createCamera";
import { setupMovement } from "./handleMovement";
import { setupCombat } from "./handleCombat";
// https://kenney.nl/assets/animated-characters-2
// mixamo

const CreateLobby = (): JSX.Element => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element
    // const { room, isHost } = useRoomContext();
    const navigate = useNavigate();

    useEffect(() => {
        let engine: Engine;

        const setupGame = async () => {
            const canvas = reactCanvas.current;
            if (!canvas) {
                console.error("CreateEnvironment: Canvas not found");
                return;
            }
            
            // Init engine
            engine = new Engine(canvas, SCENE_CONFIG.ANTIALIASING);
            engine.setHardwareScalingLevel(1.0);
            engine.maxFPS = SCENE_CONFIG.MAX_FPS;

            // Start loading screen
            engine.loadingScreen.displayLoadingUI();
            engine.loadingScreen.loadingUIBackgroundColor = "black";

            try {
                const scene = await setupScene(engine);
                
                // Create player and get mesh with animations
                const playerResult = await createPlayerModel(scene);
                if (!playerResult) {
                    console.error("CreateLobby: Failed to create player");
                    return;
                }
                const { playerMesh, animations } = playerResult;

                // Setup camera
                const camera = createCamera(playerMesh, scene);

                // Setup player controls and interactions
                const movementState = setupMovement(scene, playerMesh, animations);
                // NOTE: Just factored out to clean up the code
                setupCombat(scene, animations, movementState);

                // Setup scene lighting and ground
                const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
                light.intensity = 0.5;
                const ground = createGround(scene, 1000, 1000);
                ground.position.y = 0;

                // Start rendering
                scene.executeWhenReady(() => {
                    engine.loadingScreen.hideLoadingUI();
                    engine.runRenderLoop(() => { 
                        scene.render();
                    });
                });
            } catch (error) {
                console.error("CreateLobby: Error setting up lobby scene", error);
                engine.loadingScreen.hideLoadingUI();
                navigate("/");
            }
        };

        setupGame();

        // Handle window resize
        window.addEventListener("resize", () => {
            engine?.resize();
        });

        // Cleanup
        return () => {
            engine?.dispose();
        };
    }, []);

    return <canvas ref={reactCanvas} style={{ width: "100%", height: "100vh" }} />
};

export default CreateLobby;

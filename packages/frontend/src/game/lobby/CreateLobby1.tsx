import { Engine, Mesh, AbstractMesh, Vector3, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core"
import { Room } from "colyseus.js";
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "../../networking/setupMultiplayer";
import createPlayerCamera from "../player/createPlayerCamera";
import { setupScene } from "../setupScene";
import { SCENE_CONFIG } from "../config";
import { createPlayer } from "../player/createPlayer";
import { PlayerStateManager } from "../player/PlayerState";
import loadMap from "../map/loadMap";
// import { GameHUD } from "./game_hud/GameHUD";
import { useRoomContext } from "../../contexts/RoomContext";
import { useNavigate } from "react-router";

const CreateLobby = (): JSX.Element => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element
    const { room, isHost } = useRoomContext();
    const navigate = useNavigate();

    useEffect( () => {
        let engine: Engine;
        // TODO: Add a lobby HUD
        // let gameHUD: GameHUD;

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
                
                // TODO: Add a lobby HUD
                
                // Setup the multiplayer and map
                if (room) {
                    setupMultiplayer(scene, camera, playerStateManager, room);
                    // TODO: Create a lobby Map
                    loadMap(scene, playerStateManager, isHost, room);
                } else {
                    // If failed redirect to main menu
                    console.error("CreateEnvironment: Current room is not found");
                    navigate("/");
                }

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

export default CreateLobby;

import { Engine, Mesh, AbstractMesh, Vector3, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core"
import { Room } from "colyseus.js";
import { useRef, useEffect } from "react"
import { setupMultiplayer } from "../networking/setupMultiplayer";
import createPlayerCamera from "./player/createPlayerCamera";
import { setupScene } from "./setupScene";
import { SCENE_CONFIG } from "./config";
import { createPlayer } from "./player/createPlayer";
import { PlayerStateManager } from "./player/PlayerState";
import loadMap from "./map/loadMap";
import { GameHUD } from "./game_hud/GameHUD";
import { useRoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router";
// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// TEXTURES
// https://polyhaven.com/a/rocky_terrain_02 | Covered under CC0 license 

const CreateGameEnvironment = (): JSX.Element => {
    // TODO: Look into better error handling for the engine and canvas
    const reactCanvas = useRef(null); // Use useRef to store the canvas element
    const { room, isHost } = useRoomContext();
    const navigate = useNavigate();


    useEffect( () => {
        let engine: Engine;
        let gameHUD: GameHUD;

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
                
                // Babylon Inspector for debugging
                // window.addEventListener("keydown", (ev) => {
                //     if (ev.key === 'i' && (ev.ctrlKey || ev.metaKey)) {
                //         if (scene.debugLayer.isVisible()) {
                //             scene.debugLayer.hide();
                //         } else {
                //             scene.debugLayer.show({
                //                 embedMode: true,
                //                 handleResize: true,
                //             });
                //         }
                //     }
                // });

                // scene.debugLayer.show({
                //     embedMode: true,
                //     handleResize: true,
                // });

                // Setup the player
                const camera = createPlayerCamera(scene, canvas);
                createPlayer(scene, camera, playerStateManager); // TODO: Probably consolidate this into the setupPlayerCamera function
                gameHUD = new GameHUD(scene);
                
                // Setup the multiplayer and map
                if (room) {
                    setupMultiplayer(scene, camera, playerStateManager, room, gameHUD);
                    loadMap(scene, playerStateManager, isHost, room);
                } else {
                    // If failed redirect to main menu
                    console.error("CreateEnvironment: Current room is not found");
                    navigate("/");
                }

                // Add debug logging for goal creation
                console.log("Checking for goal mesh:", scene.getMeshByName("goal"));

                // Setup goal collision detection - FIXED VERSION
                scene.registerBeforeRender(() => {
                    const goal = scene.getMeshByName("goal");
                    const debugSphere = scene.getMeshByName("debugSphere");
                    
                    if (goal) {
                        if (!debugSphere) {
                            const sphere = MeshBuilder.CreateSphere("debugSphere", { diameter: 20 }, scene);
                            const material = new StandardMaterial("debugMaterial", scene);
                            material.diffuseColor = new Color3(1, 0, 0);
                            material.alpha = 0.2;
                            sphere.material = material;
                            sphere.position = goal.position.clone();
                            console.log("Created debug sphere at position:", sphere.position);
                        }

                        if (debugSphere) {
                            debugSphere.position = goal.position.clone();
                        }
                        // Get the distance between the goal and the camera
                        const distance = Vector3.Distance(
                            goal.position,
                            camera.position
                        );

                        // NOTE: Remove me | For debugging
                        if (scene.getFrameId() % 60 === 0) { // Log every 60 frames
                            // console.log("=== Position Check ===");
                            // console.log("Goal position:", goal.position);
                            // console.log("Debug sphere position:", debugSphere?.position);
                            // console.log("Distance to goal:", distance);
                            // console.log("Camera position:", camera.position);
                            
                            // Check if positions are within expected bounds
                            if (Math.abs(goal.position.x) > 20 || Math.abs(goal.position.z) > 20) {
                                console.warn("Goal position is outside expected bounds!");
                            }
                        }

                        // Goal reached
                        if (distance < 5) {
                            console.log("Player reached goal! Distance:", distance);
                            if (gameHUD && gameHUD.isRunning) {
                                console.log("Reached goal, Player position:", camera.position);
                                console.log("Stopping timer...");
                                const finalTime = gameHUD.stopTimer();
                                console.log("Final time:", finalTime);
                                gameHUD.showCongratulations(finalTime);
                            }
                        }
                    }
                });

                scene.executeWhenReady(() => {
                    engine.loadingScreen.hideLoadingUI();
                    gameHUD.startTimer();
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
            gameHUD.dispose();
            engine.dispose()
        }
    }, [])

    return <canvas ref={reactCanvas} style={{ width: "100%", height: "100vh" }} />
};

export default CreateGameEnvironment;

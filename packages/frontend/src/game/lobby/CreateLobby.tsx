import { Engine, Vector3, HemisphericLight, CreateGround, StandardMaterial, Color3 } from "@babylonjs/core"
import { useRef, useEffect } from "react"
// import { setupMultiplayer } from "../../networking/setupMultiplayer";
import { setupScene } from "../setupScene";
import { SCENE_CONFIG } from "../config";
// import { PlayerStateManager } from "../player/PlayerState";
// import loadMap from "../map/loadMap";
import { GameHUD } from "../game_hud/GameHUD";
import { useRoomContext } from "../../contexts/RoomContext";
import { useNavigate } from "react-router";
import { createWall } from "../map/map_objects";
import { createPlayerModel } from "./createPlayerModel";
import { createCamera } from "./createCamera";
import { setupMovement } from "./handleMovement";
import { setupCombat } from "./handleCombat";
import { handleMultiplayer } from "./handleMultiplayer";
import { AnimationHandler } from "./handleAnimations";
import { PlayerState } from "./PlayerState";
import { createLobbyMap } from "./createLobbyMap";

// https://kenney.nl/assets/animated-characters-2
// mixamo

const CreateLobby = (): JSX.Element => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element
    const { room, isHost } = useRoomContext();
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
                // Setup scene
                const scene = await setupScene(engine);

                // Create game HUD
                const gameHUD = new GameHUD(scene);
                if (!gameHUD) {
                    throw new Error("CreateLobby: Failed to create game HUD");
                }
                
                // Initialize player state
                const playerId = room?.sessionId;
                if (!playerId) {
                    throw new Error("CreateLobby: No player ID found");
                }
                gameHUD.addPlayer(playerId, "-");
                
                const playerState = new PlayerState(playerId, isHost);
                
                // Create player model
                const playerResult = await createPlayerModel(scene, playerId);
                if (!playerResult) {
                    throw new Error("CreateLobby: Failed to create player");
                }
                const { playerMesh, animations } = playerResult;
                playerState.setMesh(playerMesh);
                playerState.setPosition();

                // Create and Attach Camera to playerMesh
                createCamera(playerMesh, scene);
                
                // Setup player controls and interactions
                const animationHandler = new AnimationHandler(scene, animations);
                playerState.setAnimationHandler(animationHandler);


                // TODO: Will probably need to feed this into the gameHUD for the fist component later
                setupCombat(scene, playerState, room);

                if (room) {
                    handleMultiplayer(scene, room, playerState, gameHUD);
                } else {
                    console.log("CreateLobby: No room found, unable to setup multiplayer");
                }

                // Setup scene lighting and ground
                const { spawnPosition, endPosition } = createLobbyMap(scene);

                // Set player position to spawn point if available
                if (spawnPosition) {
                    playerState.setPosition(spawnPosition);
                }

                const movementState = setupMovement(scene, playerState, endPosition, gameHUD);
                if (!movementState) {
                    throw new Error("CreateLobby: Failed to setup movement");
                }
                playerState.setMovementState(movementState);

                // Lobby functions
                // Will move these to the handleMultiplayer function later
                gameHUD.onReadyClick(() => {
                    playerState.setIsReady(!playerState.getIsReady());
                    if (playerState.getIsReady()) {
                        console.log("Player is ready");
                    } else {
                        console.log("Player is not ready");
                    }
                    
                    // Send ready state to server
                    if (room) {
                        room.send("setReady", {
                            ready: playerState.getIsReady()
                        });
                    }
                });
                
                // TODO: Navigate to game route when game starts
                gameHUD.onStartClick(() => {
                    if (room && playerState.isHost) {
                        console.log("Host attempting to start game");
                        room.send("startGame", {});
                    }
                });
                
                gameHUD.onMainMenuClick(() => {
                    navigate("/");
                });

                // Start rendering
                scene.executeWhenReady(() => {
                    engine.loadingScreen.hideLoadingUI();
                    gameHUD.startTimer();
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

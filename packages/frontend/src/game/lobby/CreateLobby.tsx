import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, MeshBuilder, Color4, Color3, AbstractMesh, LoadAssetContainerAsync, AssetContainer, AnimationGroup, TransformNode, Matrix, FollowCamera, PointerEventTypes } from "@babylonjs/core"
import { useRef, useEffect } from "react"
// import { setupMultiplayer } from "../../networking/setupMultiplayer";
import { setupScene } from "../setupScene";
import { SCENE_CONFIG } from "../config";
// import { createPlayer } from "../player/createPlayer";
// import { PlayerStateManager } from "../player/PlayerState";
// import loadMap from "../map/loadMap";
// import { GameHUD } from "./game_hud/GameHUD";
import { useRoomContext } from "../../context/RoomContext";
import { useNavigate } from "react-router";
import useSupabase from "../../hooks/useSupabase";
// https://kenney.nl/assets/animated-characters-2
// mixamo

const CreateLobby = (): JSX.Element => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element
    const { room, isHost } = useRoomContext();
    const navigate = useNavigate();

    useEffect( () => {
        let engine: Engine;
        let playerRotationY = 0;
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
            engine.loadingScreen.loadingUIBackgroundColor = "black";

            try {
                const scene = await setupScene(engine);
                scene.clearColor = new Color4(0 , 0.8, 0.9, 1);
                scene.ambientColor = new Color3(0.3, 0.3, 0.3);

                try {
                    let modelUrl: string;
                    let modelContainer: AssetContainer;
                    let playerMesh: AbstractMesh;
                    let camera: FollowCamera;
                    let playerTransformNode: TransformNode;

                    interface Animations {
                        tpose: AnimationGroup;
                        idle: AnimationGroup;
                        run: AnimationGroup;
                        jump: AnimationGroup;
                        jumpUp: AnimationGroup;
                        punch: AnimationGroup;
                        bigPunch: AnimationGroup;
                        getHit: AnimationGroup;
                        death: AnimationGroup;
                        victory: AnimationGroup;
                    }

                    let animations: Animations;
                    try {
                        const { getAssetUrl } = useSupabase();
                        modelUrl = getAssetUrl("models", "newCharacterModel.glb");
                        try {
                            modelContainer = await LoadAssetContainerAsync(
                                modelUrl,
                                scene,
                                {
                                    pluginExtension: ".glb"
                                }
                            )
                            console.log("Model container loaded:", modelContainer);
                            modelContainer.meshes.forEach(mesh => {
                                scene.addMesh(mesh);
                                console.log("Added mesh to scene:", mesh.name, "Has skeleton:", !!mesh.skeleton);
                            });
                            modelContainer.animationGroups.forEach(group => {
                                // Remove any existing animation groups with the same name
                                if (scene.animationGroups.find(g => g.name === group.name)) {
                                    scene.removeAnimationGroup(group);
                                }
                                scene.addAnimationGroup(group);
                                // console.log("Added animation group to scene:", group.name);
                            });
                            animations = {
                                tpose: scene.getAnimationGroupByName("t-pose") as AnimationGroup,
                                idle: scene.getAnimationGroupByName("idle") as AnimationGroup,
                                run: scene.getAnimationGroupByName("run") as AnimationGroup,
                                jump: scene.getAnimationGroupByName("jump") as AnimationGroup,
                                jumpUp: scene.getAnimationGroupByName("jumpUp") as AnimationGroup,
                                punch: scene.getAnimationGroupByName("punch1") as AnimationGroup,
                                bigPunch: scene.getAnimationGroupByName("punch2") as AnimationGroup,
                                getHit: scene.getAnimationGroupByName("hit") as AnimationGroup,
                                death: scene.getAnimationGroupByName("death") as AnimationGroup,
                                victory: scene.getAnimationGroupByName("dance") as AnimationGroup,
                            }
                            if (animations.idle) {
                                animations.idle.play(true);
                            }

                            playerMesh = scene.getMeshByName("characterMedium") as AbstractMesh;
                            

                            camera = new FollowCamera("ThirdPersonCam", new Vector3(0, 8, -7), scene);
                            camera.inertia = 0.4;
                            camera.fov = 1.2;
                            camera.minZ = 0.1;

                            // Set the camera to always follow the player mesh
                            camera.lockedTarget = playerMesh;
                            camera.rotationOffset = 180; // Always behind the player

                            // Rotation handling
                            scene.onPointerObservable.add((pointerInfo) => {
                                if (pointerInfo.type === PointerEventTypes.POINTERMOVE && document.pointerLockElement) {
                                    const deltaX = pointerInfo.event.movementX || 0;
                                    const sensitivity = 0.003;
                                    playerRotationY += deltaX * sensitivity;

                                    // Normalize
                                    playerRotationY = (playerRotationY + Math.PI * 2) % (Math.PI * 2);
                                    playerMesh.rotation.y = playerRotationY;
                                }
                            });
                        } catch (error) {
                            console.error("CreateLobby: Error fetching modelContainer", error);
                        }
                        
                    } catch (error) {
                        console.error("CreateLobby: Error loading model", error);
                    }


                    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
                    light.intensity = 0.5;
                    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
                    ground.position.y = 0;
                    // Initialize the player state manager
                    // const playerStateManager = new PlayerStateManager();

                    // Setup the player
                    // const camera = createPlayerCamera(scene, canvas);
                    // createPlayer(scene, camera, playerStateManager); // TODO: Probably consolidate this into the setupPlayerCamera function
                    
                    // TODO: Add a lobby HUD
                    
                    // Setup the multipldeathand map
                    // if (room) {
                    //     setupMultiplayer(scene, camera, playerStateManager, room);
                    //     // TODO: Create a lobby Map
                    //     loadMap(scene, playerStateManager, isHost, room);
                    // } else {
                    //     // If failed redirect to main menu
                    //     console.error("CreateEnvironment: Current room is not found");
                    //     navigate("/");
                    // }
                } catch (error) {
                    console.error("CreateLobby: Error setting up camera", error);
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

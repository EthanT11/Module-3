import { Engine, Scene, Vector3, HemisphericLight, UniversalCamera, MeshBuilder, Texture, Color3, Color4, StandardMaterial, Mesh } from "@babylonjs/core"
import { Client } from "colyseus.js";
import { MyRoomState } from "../../../backend-colyseus/src/rooms/schema/MyRoomState";
import { useRef, useEffect } from "react"

// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// TEXTURES
// https://polyhaven.com/a/rocky_terrain_02 | Covered under CC0 license 

// configs
const SCENE_CONFIG = {
    FPS: 60,
    GRAVITY: -9.81,

    CAMERA_CONFIG: {
        speed: 0.50,
    },
    GROUND_CONFIG: {
        width: 200,
        height: 200,
    },
    LIGHT_CONFIG: {
        intensity: 0.8, // 0 to 1
        position: new Vector3(0, 20, 0),
    },
}



const setupCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
    try {
        const camera = new UniversalCamera(
            "camera", 
            new Vector3(0, 10, 0),
            scene
        );
        camera.attachControl(canvas, true);
    
        camera.applyGravity = true;
        camera.checkCollisions = true;
        camera.ellipsoid = new Vector3(1, 1, 1); // Collision box of the camera
        
        camera.minZ = 0.1; // Helps with camera clipping
        camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;
        
        // Controls
        camera.keysUp = [87]; // W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // A
        camera.keysRight = [68]; // D

        console.log("Camera setup complete");
        return camera;
    } catch (error) {
        console.error("Error setting up camera:", error);
        throw error;
        
    }
}


const setupLight = (scene: Scene): HemisphericLight => {
    try {
        const light = new HemisphericLight("light", SCENE_CONFIG.LIGHT_CONFIG.position, scene);
        light.intensity = SCENE_CONFIG.LIGHT_CONFIG.intensity;

        console.log("Light setup complete");
        return light;
    } catch (error) {
        console.error("Error setting up light:", error);
        throw error;
    }
}


const setupScene = (engine: Engine): Scene => {
    try {
        const scene = new Scene(engine); // Create a new scene
        scene.clearColor = new Color4(0.5, 0.5, 0.5, 1);
        scene.gravity = new Vector3(0, SCENE_CONFIG.GRAVITY/SCENE_CONFIG.FPS, 0); // Gravity in babylong is measured in units/frame
        scene.onPointerDown = (event) => { // 0 left click, 1 middle click, 2 right click
            if (event.button === 0) { // Lock the camera to the player when they left click the screen
                engine.enterPointerlock();
            }
            if (event.button === 1) { // Unlock the camera when they middle mouse click the screen
                engine.exitPointerlock();
                }
            }
        console.log("Scene setup complete");
        return scene;
    } catch (error) {
        console.error("Error setting up scene:", error);
        throw error;
    }
}


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

        let playerSphere: Mesh | null = null; // Store ref to the player sphere

        // Colyseus connection
        const BACKEND_URL = import.meta.env.PROD // If the environment is production, use the backend URL from the environment variable
          ? `wss://${import.meta.env.VITE_BACKEND_URL}` 
          : "ws://localhost:2567";

        console.log("Connecting to backend at:", BACKEND_URL); // Debug log
        const colyseusClient = new Client(BACKEND_URL);
        colyseusClient
            .joinOrCreate("my_room")
            .then(room => {
                console.log("Joined room: ", room);
                const roomState = room.state as MyRoomState;

                // onAdd: When a player joins the room
                roomState.players.onAdd((player, sessionId) => {
                    console.log("Player joined", player, sessionId);

                    // Create a sphere for the player
                    const sphere = MeshBuilder.CreateSphere(`player-${sessionId}`, { 
                        segments: 10, // # of segments on the sphere | More segments = smoother sphere
                        diameter: 2  
                    }, scene); 
                    sphere.position.set(player.x, player.y, player.z); // Set the position of the sphere to the player's position

                    // Set the camera to the player
                    if (sessionId === room.sessionId) {
                        playerSphere = sphere;
                    }

                    // Create a material for the player
                    const material = new StandardMaterial(`player-${sessionId}`, scene);
                    sphere.material = material;

                    // Update the player's position when it changes
                    player.onChange(() => {
                        if (sessionId !== room.sessionId) {  // Only update other players
                            sphere.position.set(player.x, player.y, player.z);
                        }
                    });
                })

                // Update the player's position when the camera moves
                // TODO: Look into if this is the best way to do this
                scene.registerBeforeRender(() => {
                    if (playerSphere && room) {
                        playerSphere.position.copyFrom(camera.position);
                    }

                    // Send the player's position to the server
                    room.send("updatePosition", {
                        x: camera.position.x,
                        y: camera.position.y,
                        z: camera.position.z 
                    });
                })

                
                // Dispose of the sphere when the player leaves
                roomState.players.onRemove((player, sessionId) => {
                    const sphereToRemove = scene.getMeshByName(`player-${sessionId}`);
                    if (sphereToRemove) {
                        sphereToRemove.dispose();
                        console.log("Removed player sphere: ", sphereToRemove);
                    }
                    if (sessionId === room.sessionId) {
                        playerSphere = null;
                    }
                })


            })
            .catch(error => {
                console.error("Error joining room:", error);
            });
        

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

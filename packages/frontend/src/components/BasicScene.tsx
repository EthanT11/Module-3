import { Engine, Scene, Vector3, HemisphericLight, UniversalCamera, MeshBuilder, Mesh, Color4 } from "@babylonjs/core"
import { useRef, useEffect } from "react"

// TODO: handle movement | Need a control scheme that's easy to use for the player WASD and mouse only
// TODO: Add a camera to the player
// TODO: Start factoring out the scene props when this gets too big

// RESOURCES
// https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
// https://www.youtube.com/watch?v=npt_oXGTLfg

// configs
const SCENE_CONFIG = {
    PLAYER_CONFIG: {
        position: new Vector3(4, 1, 0),
        size: 1,
        speed: 0.1,
    },
    GROUND_CONFIG: {
        width: 125,
        height: 121,
    },
    LIGHT_CONFIG: {
        intensity: 0.8, // 0 to 1
        position: new Vector3(0, 20, 0),
    },

}

const GRAVITY = -9.81;
const FPS = 60;

// const createPlayer = (scene: Scene): Mesh => { // Should return a player mesh
//     const player = MeshBuilder.CreateBox("player", { size: SCENE_CONFIG.PLAYER_CONFIG.size}, scene);
//     player.position.y = SCENE_CONFIG.PLAYER_CONFIG.position.y;
//     player.position.x = SCENE_CONFIG.PLAYER_CONFIG.position.x;

//     player.isVisible = true; // Hide the player mesh

//     return player
// }

const setupCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
    const camera = new UniversalCamera(
        "camera", 
        new Vector3(1, 1, 1), // Start position of the camera
        scene
    );

    camera.attachControl(canvas, true);
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1, 1, 1); // Collision box of the camera
    camera.minZ = 0.1; // Helps with camera clipping


    return camera;
}

const setupLight = (scene: Scene): HemisphericLight => {
    const light = new HemisphericLight("light", SCENE_CONFIG.LIGHT_CONFIG.position, scene);
    light.intensity = SCENE_CONFIG.LIGHT_CONFIG.intensity;

    return light;
}



const CreateBasicScene = () => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element

    useEffect(() => {
        const canvas = reactCanvas.current; // Get the canvas element
        if (!canvas) {
            console.error("CreateBasicScene: Canvas not found")
            return
        }

        // Init
        const engine = new Engine(canvas, true) // First argument is the canvas element, second argument is antialiasing

        const scene = new Scene(engine) // Create a new scene
        scene.clearColor = new Color4(0.5, 0.5, 0.5, 1);
        scene.gravity = new Vector3(0, GRAVITY/FPS, 0); // Gravity in babylong is measured in units/frame

        setupLight(scene)
        setupCamera(scene, canvas)

        // Objects
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

export default CreateBasicScene;

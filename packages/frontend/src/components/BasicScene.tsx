import { Engine, Scene, Vector3, HemisphericLight, UniversalCamera, MeshBuilder, Mesh } from "@babylonjs/core"
import { useRef, useEffect } from "react"

// TODO: handle movement | Need a control scheme that's easy to use for the player WASD and mouse only
// TODO: Add a camera to the player
// TODO: Start factoring out the scene props when this gets too big

// configs
const PLAYER_CONFIG = {
    size: 1,
    position: {
        x: 4,
        y: 1,
    }
}

const createPlayer = (scene: Scene): Mesh => { // Should return a player mesh
    const player = MeshBuilder.CreateBox("player", { size: PLAYER_CONFIG.size}, scene);
    player.position.y = PLAYER_CONFIG.position.y;
    player.position.x = PLAYER_CONFIG.position.x;
    return player
}

const setupCamera = (scene: Scene, canvas: HTMLCanvasElement, target: Mesh): UniversalCamera => {
    const camera = new UniversalCamera("camera", new Vector3(0, 0, -10), scene);
    camera.attachControl(canvas, true);
    camera.setTarget(target.position);

    return camera
}

const setupLight = (scene: Scene): HemisphericLight => {
    const light = new HemisphericLight("light", new Vector3(0, 20, 0), scene);
    light.intensity = 0.7;
    return light;
}


const CreateBasicScene = (): HTMLCanvasElement => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element


    useEffect(() => {
        const canvas = reactCanvas.current; // Get the canvas element
        if (!canvas) {
            console.error("CreateBasicScene: Canvas not found")
            return
        }

        const engine = new Engine(canvas, true) // First argument is the canvas element, second argument is antialiasing
        const scene = new Scene(engine) // Create a new scene

        const player = createPlayer(scene)
        setupCamera(scene, canvas, player)
        setupLight(scene)
        
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene) 
        sphere.position.y = 20

        
        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene) 
        box.position.y = 1

        MeshBuilder.CreateGround(
            "ground",
            { width: 125, height: 121 },
            scene
        )

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

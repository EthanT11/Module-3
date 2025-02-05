import { Engine, Scene, Vector3, HemisphericLight, FreeCamera, MeshBuilder } from "@babylonjs/core"
import { useRef, useEffect } from "react"

const CreateBasicScene = () => {
    const reactCanvas = useRef(null); // Use useRef to store the canvas element

    useEffect(() => {
        const canvas = reactCanvas.current; // Get the canvas element
        if (!canvas) {
            console.error("CreateBasicScene: Canvas not found")
            return
        }

        const engine = new Engine(canvas, true) // First argument is the canvas element, second argument is antialiasing
        const scene = new Scene(engine) // Create a new scene

        const camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene) // Create a new camera
        camera.setTarget(Vector3.Zero()) // Set the target of the camera to x/y/z 0/0/0
        camera.attachControl(canvas, true) // Allows the camera to be controlled by the mouse and arrow keys


        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene) // Create a new light
        light.intensity = 0.7 // From 0 to 1

        const box = MeshBuilder.CreateBox("box", { size: 2 }, scene) // Create a box
        box.position.y = 1

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

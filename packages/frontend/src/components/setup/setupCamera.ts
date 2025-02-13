import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
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
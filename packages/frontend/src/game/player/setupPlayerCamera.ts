import { Scene, UniversalCamera } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupPlayerCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
    try {
        const camera = new UniversalCamera(
            "camera", 
            SCENE_CONFIG.CAMERA_CONFIG.startPosition,
            scene
        );
        camera.attachControl(canvas, true);
    
        // camera.applyGravity = true; // Gravity is applied in the handlePlayerMovement function |
        camera.checkCollisions = true;
        camera.ellipsoid = SCENE_CONFIG.CAMERA_CONFIG.ellipsoid; // Collision box of the camera
        camera.ellipsoidOffset = SCENE_CONFIG.CAMERA_CONFIG.ellipsoidOffset; // offset to match player's height
        
        camera.minZ = 0.1; // Helps with camera clipping
        camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;
        camera.inertia = SCENE_CONFIG.CAMERA_CONFIG.inertia; // 0 is no inertia, 1 is full inertia

        console.log("Camera setup complete");
        return camera;
    } catch (error) {
        console.error("Error setting up camera:", error);
        throw error;
        
    }
}
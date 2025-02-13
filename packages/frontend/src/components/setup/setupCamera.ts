import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

const handlePlayerMovement = (camera: UniversalCamera, scene: Scene) => {
    // Handle movement
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    // Handle sprinting
    let isSprinting = false;
    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) { // check if key_down event
            if (kb.event.key === "Shift") {
                isSprinting = true;
                camera.speed = SCENE_CONFIG.CAMERA_CONFIG.sprintSpeed;
            }
        } else if (kb.type === 2) { // check if key_up event
            if (kb.event.key === "Shift") {
                isSprinting = false;
                camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;
            }
        }
    });

    // Handle jumping
    let jumpCount = 0;
    let isJumping = false;
    let verticalVelocity = 0;

    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) { // check if key_down event
            if (kb.event.code === "Space" && jumpCount < SCENE_CONFIG.CAMERA_CONFIG.maxJumps) {
                isJumping = true;
                verticalVelocity = SCENE_CONFIG.CAMERA_CONFIG.jumpPower;
                jumpCount++;
            }
        }
    });

    scene.registerBeforeRender(() => {
        // Apply gravity to the camera
        //  initial velocity is 0, or if jumping, it is the jump power
        //  we get the the time between frames and change it to seconds
        //  then we apply the gravity to the vertical velocity
        verticalVelocity += scene.gravity.y * (scene.getEngine().getDeltaTime() / 1000);
        
        // console.log("Vertical Velocity: ", verticalVelocity)
        // console.log("Gravity: ", scene.gravity.y)
        camera.position.y += verticalVelocity;

        console.log(scene.getEngine().getFps())
        // if camera is below the ground threshhold | Will defenitely have to change this but it works for now.
        if (camera.position.y <= 2.1) { 
            camera.position.y = 2.1; // reset camera to the ground
            if (isJumping || verticalVelocity < 0) {
                console.log("landed")
                isJumping = false;
                jumpCount = 0;
                verticalVelocity = 0;
            }
        }
    });
}

export const setupCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
    try {
        const camera = new UniversalCamera(
            "camera", 
            new Vector3(0, 10, 0),
            scene
        );
        camera.attachControl(canvas, true);
    
        // camera.applyGravity = true; // Gravity is applied in the handlePlayerMovement function |
        camera.checkCollisions = true;
        camera.ellipsoid = new Vector3(1, 2, 1); // Collision box of the camera
        camera.ellipsoidOffset = new Vector3(0, 2, 0); // offset to match player's height
        
        camera.minZ = 0.1; // Helps with camera clipping
        camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;

        handlePlayerMovement(camera, scene);

        console.log("Camera setup complete");
        return camera;
    } catch (error) {
        console.error("Error setting up camera:", error);
        throw error;
        
    }
}
import { AbstractMesh, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const handlePlayerMovement = (camera: UniversalCamera, scene: Scene, playerModel: AbstractMesh) => {
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
        
        camera.position.y += verticalVelocity; // TODO: this might be why the camera floats in the air when looking down

        // if camera is below the ground threshhold | Will defenitely have to change this but it works for now.
        if (camera.position.y <= 2.1) { 
            camera.position.y = 2.1; // reset camera to the ground
            if (isJumping || verticalVelocity < 0) {
                isJumping = false;
                jumpCount = 0;
                verticalVelocity = 0;
            }
        }

        // Check if camera has a parent and if so, move the player model to the camera's position
        if (camera.parent) {
            playerModel.position = camera.position.clone(); 

            playerModel.rotation.y = camera.rotation.y + Math.PI; // Look left to right
            playerModel.rotation.z = camera.rotation.z;
        } else {
            console.error("Camera does not have a parent: handlePlayerMovement.ts");
        }
    });
}
import { Scene, UniversalCamera } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
import { PlayerTransformNode } from './createPlayerTransformNode';

export const handlePlayerMovement = (camera: UniversalCamera, scene: Scene, player: PlayerTransformNode) => {
    // Handle movement
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    let isMoving = false;

    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) { // key down
            if (kb.event.code === "KeyW" && !isMoving) {
                isMoving = true;
                if (player.animations.run) {
                    player.animations.run.stop();
                    player.animations.run.play(true);
                }
            }
        } else if (kb.type === 2) { // key up
            if (kb.event.code === "KeyW") {
                isMoving = false;
                if (player.animations.run) {
                    player.animations.run.stop();
                }
                if (player.animations.idle) {
                    player.animations.idle.play(true);
                }
            }
        }
    });

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
                
                // Play jump animation
                if (player.animations.jump) {
                    player.animations.jump.stop();
                    player.animations.jump.play(false);
                }
            }
        }
    });

    scene.registerBeforeRender(() => {
        // Apply gravity to the camera
        //  initial velocity is 0, or if jumping, it is the jump power
        //  we get the the time between frames and change it to seconds
        //  then we apply the gravity to the vertical velocity
        verticalVelocity += scene.gravity.y * (scene.getEngine().getDeltaTime() / 1000);
        camera.position.y += verticalVelocity; 
        //
        // TODO: this might be why the camera floats in the air when looking down
        // TODO: Lock the camera.rotation.x to stop the camera from looking fully down into the model

        // if camera is below the ground threshhold | Will defenitely have to change this but it works for now.
        if (camera.position.y <= SCENE_CONFIG.GROUND_CONFIG.yOffset) { 
            camera.position.y = SCENE_CONFIG.GROUND_CONFIG.yOffset; // reset camera to the ground
            if (isJumping || verticalVelocity < 0) {
                isJumping = false;
                jumpCount = 0;
                verticalVelocity = 0;
                
                if (player.animations.idle) {
                    player.animations.idle.play(true);
                }
            }
        }

        // TODO: Factor this out
        if (camera.parent) {
            // Update position
            const targetPosition = camera.position.clone();
            targetPosition.y -= SCENE_CONFIG.CAMERA_CONFIG.cameraOffset; // offset the camera from the player model

            // Move the player model to the camera's position
            if (player.mesh) {
                player.mesh.position = targetPosition; 
                
                // Get the camera's rotation
                const cameraWorldRotation = camera.absoluteRotation.toEulerAngles().y;
                
                // Force Euler rotation for the model 
                player.mesh.rotationQuaternion = null;
                player.mesh.rotation.set(0, cameraWorldRotation + Math.PI, 0); // rotate the model 180 degrees around the Y axis
            }
        } else {
            console.error("Camera does not have a parent: handlePlayerMovement.ts");
        }
    });
}
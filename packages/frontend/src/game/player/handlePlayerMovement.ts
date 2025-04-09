import { Scene, UniversalCamera, Vector3 } from "@babylonjs/core";
import { MAP_CONFIG } from "../map/mapConfig";
import { PlayerTransformNode } from './createPlayerTransformNode';
import { PlayerStateManager, PlayerAnimation } from "./PlayerState";
import { SCENE_CONFIG } from "../config";

export const handlePlayerMovement = (camera: UniversalCamera, scene: Scene, player: PlayerTransformNode, playerStateManager: PlayerStateManager) => {
    const localPlayer = playerStateManager.getLocalPlayer();
    if (!localPlayer) return;

    // Movement configuration
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D
    const moveKeys = ["KeyW", "KeyS", "KeyA", "KeyD"];

    // Jump configuration
    let jumpVelocity = 0;
    const JUMP_POWER = 15;
    const GRAVITY = -9.81;
    const MAX_JUMPS = 2;
    let jumpCount = 0;

    // Handle jumping
    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) { // key down
            if (kb.event.code === "Space" && !localPlayer.isJumping && jumpCount < MAX_JUMPS) {
                jumpVelocity = JUMP_POWER;
                localPlayer.isJumping = true;
                jumpCount++;
                localPlayer.setAnimationState(PlayerAnimation.JUMPING);
                if (player.animations.jump) {
                    player.animations.jump.stop();
                    player.animations.jump.play(false);
                }
            }
        }
    });

    // Update player state and model position
    scene.registerBeforeRender(() => {
        // Handle jumping physics
        if (localPlayer.isJumping) {
            camera.position.y += jumpVelocity * scene.getEngine().getDeltaTime() / 1000;
            jumpVelocity += GRAVITY * scene.getEngine().getDeltaTime() / 1000;

            // Check if landed
            if (camera.position.y <= MAP_CONFIG.GROUND_CONFIG.yOffset) {
                camera.position.y = MAP_CONFIG.GROUND_CONFIG.yOffset;
                localPlayer.isJumping = false;
                jumpCount = 0;
                jumpVelocity = 0;
                localPlayer.setAnimationState(PlayerAnimation.IDLE);
                if (player.animations.jump) {
                    player.animations.jump.stop();
                }
                if (player.animations.idle) {
                    player.animations.idle.play(true);
                }
            }
        } else if (camera.position.y > MAP_CONFIG.GROUND_CONFIG.yOffset) {
            // Only apply gravity when above ground
            camera.position.y += jumpVelocity * scene.getEngine().getDeltaTime() / 1000;
            jumpVelocity += GRAVITY * scene.getEngine().getDeltaTime() / 1000;

            // Check if landed
            if (camera.position.y <= MAP_CONFIG.GROUND_CONFIG.yOffset) {
                camera.position.y = MAP_CONFIG.GROUND_CONFIG.yOffset;
                jumpVelocity = 0;
            }
        }

        // Update player state
        localPlayer.updatePosition(camera.position);
        localPlayer.updateRotationY(camera.absoluteRotation.toEulerAngles().y);

        // Update player model
        if (camera.parent && player.mesh) {
            const targetPosition = camera.position.clone();
            targetPosition.y -= SCENE_CONFIG.CAMERA_CONFIG.cameraOffset;
            player.mesh.position = targetPosition;
            player.mesh.rotationQuaternion = null;
            player.mesh.rotation.set(0, camera.absoluteRotation.toEulerAngles().y, 0);
        }
    });

    // Handle movement animations
    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) { // key down
            if (moveKeys.includes(kb.event.code) && !localPlayer.isMoving) {
                localPlayer.isMoving = true;
                localPlayer.setAnimationState(PlayerAnimation.RUNNING);
                if (player.animations.run) {
                    player.animations.run.stop();
                    player.animations.run.play(true);
                }
            }
        } else if (kb.type === 2) { // key up
            if (moveKeys.includes(kb.event.code)) {
                localPlayer.isMoving = false;
                localPlayer.setAnimationState(PlayerAnimation.IDLE);
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
    scene.onKeyboardObservable.add((kb) => {
        if (kb.type === 1) {
            if (kb.event.key === "Shift") {
                camera.speed = SCENE_CONFIG.CAMERA_CONFIG.sprintSpeed;
                localPlayer.isSprinting = true;
            }
        } else if (kb.type === 2) {
            if (kb.event.key === "Shift") {
                camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;
                localPlayer.isSprinting = false;
            }
        }
    });
}
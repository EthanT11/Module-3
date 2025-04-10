import { Vector3 } from "@babylonjs/core";
import { MAP_CONFIG } from "./map/mapConfig";

// CONFIGS
export const SCENE_CONFIG = {
    ANTIALIASING: true,
    MAX_FPS: 60,
    
    GRAVITY: -9.81,

    CAMERA_CONFIG: {
        // player camera
        startPosition: MAP_CONFIG.SPAWN_CONFIG.startPosition,
        ellipsoid: new Vector3(0.5, 1, 0.5), // Collision box of the camera
        ellipsoidOffset: new Vector3(0, 1, 0), // offset to match player's height

        // Camera offset from the player model
        cameraOffset: 1.85,

        // movement
        speed: 5,
        sprintSpeed: 10,
        maxJumps: 2,
        jumpPower: 25, // Reduced jump power for more natural movement
        inertia: 0.7,

        // interpolation
        positionSmoothness: 0.05,
        rotationSmoothness: 0.1,
    },
    MODEL_CONFIG: {
        scaling: new Vector3(0.5, 0.5, 0.5)
    }
};
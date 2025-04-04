import { Vector3 } from "@babylonjs/core";

// CONFIGS
export const SCENE_CONFIG = {
    ANTIALIASING: true,
    MAX_FPS: 60,
    
    GRAVITY: -9.81, // More realistic gravity value

    CAMERA_CONFIG: {
        // player camera
        startPosition: new Vector3(0, 0, 0),
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
    },
    GROUND_CONFIG: {
        width: 200,
        height: 200,
        yOffset: 1.1,
    },
    LIGHT_CONFIG: {
        intensity: 0.8,
        position: new Vector3(0, 20, 0),
    },
};
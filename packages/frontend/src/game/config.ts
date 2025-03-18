import { Vector3 } from "@babylonjs/core";

// CONFIGS
export const SCENE_CONFIG = {
    ANTIALIASING: true,
    MAX_FPS: 60,
    
    GRAVITY: -0.4, // Closer to 0 is less gravity

    CAMERA_CONFIG: {
        // player camera
        startPosition: new Vector3(0, 0, 0),
        ellipsoid: new Vector3(1, 1, 1), // Collision box of the camera
        ellipsoidOffset: new Vector3(0, 1, 0), // offset to match player's height

        // Camera offset from the player model
        cameraOffset: 1.9,

        // movement
        speed: 0.50,
        sprintSpeed: 1.00,
        maxJumps: 2,
        jumpPower: 0.2,
        inertia: 0.7,

        // interpolation
        positionSmoothness: 0.15,
        rotationSmoothness: 0.15,
    },
    MODEL_CONFIG: {
        scaling: new Vector3(2, 2, 2)
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
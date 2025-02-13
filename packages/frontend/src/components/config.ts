import { Vector3 } from "@babylonjs/core";

// TODO: Add react context for configs

// CONFIGS
export const SCENE_CONFIG = {
    ANTIALIASING: true,
    MAX_FPS: 60,
    
    GRAVITY: -0.4, // Closer to 0 is less gravity

    CAMERA_CONFIG: {
        speed: 0.50,
        sprintSpeed: 1.00,
        maxJumps: 2,
        jumpPower: 0.2,
    },
    GROUND_CONFIG: {
        width: 200,
        height: 200,
    },
    LIGHT_CONFIG: {
        intensity: 0.8,
        position: new Vector3(0, 20, 0),
    },
};
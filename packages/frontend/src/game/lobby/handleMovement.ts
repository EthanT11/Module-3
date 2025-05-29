import { Scene, Vector3, AbstractMesh } from "@babylonjs/core";
import { Animations } from "./createPlayerModel";
import { handleRotation } from "./handleRotation";
import { AnimationHandler } from "./handleAnimations";

export interface MovementState {
    keys: { w: boolean; a: boolean; s: boolean; d: boolean };
    wasMoving: boolean;
    isPunching: boolean;
    isBigPunching: boolean;
}

const MOVE_SPEED = 0.3;
const KEY_MAP = {
    KeyW: 'w',
    KeyA: 'a',
    KeyS: 's',
    KeyD: 'd'
} as const;

// This is used to map the keys to the direction of the movement
const DIRECTION_MAP = {
    w: 0,
    a: Math.PI / 2,
    s: Math.PI,
    d: -Math.PI / 2,
} as const;

// Movement changed a lot changing from first person to third person | we no longer "control" the camera but move the player and the camera follows
// We use the direction map to map the keys to the direction of the movement
// The keys are stored in a state object
export const setupMovement = (
    scene: Scene,
    playerMesh: AbstractMesh,
    animationHandler: AnimationHandler
) => {

    // Init movement state 
    const state: MovementState = {
        keys: { w: false, a: false, s: false, d: false },
        wasMoving: false,
        isPunching: false,
        isBigPunching: false
    };

    // Setup mesh rotation
    handleRotation(scene, playerMesh);

    // Keyboard input handling
    scene.onKeyboardObservable.add((kb) => {
        const key = KEY_MAP[kb.event.code as keyof typeof KEY_MAP];
        if (key) {
            state.keys[key] = kb.type === 1;
        }
    });

    // Movement and animation update
    scene.onBeforeRenderObservable.add(() => {
        if (!playerMesh) return;
        
        // We create a vec3 to store the movement
        // We take the angle of the player mesh to know where to move
        const move = new Vector3(0, 0, 0);
        const angle = playerMesh.rotation.y;
        let isMoving = false;

        // Calculate movement based on keys pressed
        Object.entries(state.keys).forEach(([key, isPressed]) => {
            if (isPressed) {
                isMoving = true;
                // Get the direction of movement from the direction map and add it to the angle of the player mesh
                const dir = angle + DIRECTION_MAP[key as keyof typeof DIRECTION_MAP];
                // Add the movement to the vec3
                move.x += Math.sin(dir);
                move.z += Math.cos(dir);
            }
        });

        // Normalize for diagonal movement
        if (move.length() > 0) {
            move.normalize().scaleInPlace(MOVE_SPEED);
            playerMesh.position.addInPlace(move);
        }

        // Animation switching | pass the isMoving state to the animation handler
        animationHandler.handleMovement(isMoving);
    });

    return state;
}; 
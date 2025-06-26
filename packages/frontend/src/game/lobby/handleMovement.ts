import { Scene, Vector3 } from "@babylonjs/core";
import { handleRotation } from "./handleRotation";
import { PlayerState } from "./PlayerState";
export interface MovementState {
    keys: { w: boolean; a: boolean; s: boolean; d: boolean };
    wasMoving: boolean;
    isPunching: boolean;
    isBigPunching: boolean;
}

const MOVE_SPEED = 0.3;
const GOAL_DISTANCE = 5; // Distance threshold to consider player at goal
const KEY_MAP = {
    KeyW: 'w',
    KeyA: 'a',
    KeyS: 's',
    KeyD: 'd'
} as const;

// This is used to map the keys to the direction of the movement
const DIRECTION_MAP = {
    w: 0,
    a: -Math.PI / 2,
    s: Math.PI,
    d: Math.PI / 2,
} as const;

// Movement changed a lot changing from first person to third person | we no longer "control" the camera but move the player and the camera follows
// We use the direction map to map the keys to the direction of the movement
// The keys are stored in a state object
export const setupMovement = (
    scene: Scene,
    playerState: PlayerState,
    endPosition?: Vector3
) => {

    // Init movement state 
    const state: MovementState = {
        keys: { w: false, a: false, s: false, d: false },
        wasMoving: false,
        isPunching: false,
        isBigPunching: false
    };

    const playerMesh = playerState.getMesh();
    if (!playerMesh) {
        console.error("Player mesh not found: handleMovement");
        return;
    }
    // Setup mesh rotation
    handleRotation(scene, playerMesh, playerState);

    // Keyboard input handling
    scene.onKeyboardObservable.add((kb) => {
        const key = KEY_MAP[kb.event.code as keyof typeof KEY_MAP];
        if (key) {
            state.keys[key] = kb.type === 1;
        }
    });

    // Track if goal has been reached to avoid spam logging
    let goalReached = false;

    // Movement and animation update
    scene.onBeforeRenderObservable.add(() => {
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
            playerMesh.moveWithCollisions(move);
        }

        // Update player state position
        playerState.setPosition(playerMesh.position);
        // Animation switching | pass the isMoving state to the animation handler
        playerState.getAnimationHandler()?.handleMovement(isMoving);

        // Check if player reached the goal
        // TODO: Probably factor this out as it's own function since it's going to be quite large
        if (endPosition && !goalReached) {
            const distance = Vector3.Distance(playerMesh.position, endPosition);
            if (distance <= GOAL_DISTANCE) {
                console.log("🎉 GOAL REACHED! Player has reached the end point!");
                goalReached = true;
            }
        }
    });

    return state;
}; 
import { Scene, PointerEventTypes, AbstractMesh, Vector3, Ray, RayHelper, FollowCamera, Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { PlayerState } from "./PlayerState";
import { playerMeshes } from "./handleMultiplayer";

// Constants
const DEBUG_TIMER = 500;
const HITBOX_DEBUG = true;
const RAY_DEBUG = true;
const RAY_LENGTH = 4;
const OFFSET = 1;
const HITBOX_SIZE = new Vector3(2, 2, 2);
const HITBOX_DISTANCE = 2;

interface CombatState {
    isPunching: boolean;
    isBigPunching: boolean;
}

// Creates a ray shooting forward from the player
const createRay = (playerMesh: AbstractMesh): Ray => {
    const origin = playerMesh.getAbsolutePosition().clone();
    origin.y += OFFSET;
    const forward = playerMesh.getDirection(new Vector3(0, 0, 1));

    return new Ray(origin, forward, RAY_LENGTH);
}

// Creates a hitbox that is a box mesh
const createHitbox = (scene: Scene, origin: Vector3, forward: Vector3, playerRotation: Vector3): AbstractMesh => {
    const hitBox = MeshBuilder.CreateBox("hitBox", { size: 1 }, scene);
    hitBox.scaling = HITBOX_SIZE;
    hitBox.isVisible = false;
    hitBox.position = origin.add(forward.scale(HITBOX_DISTANCE));
    hitBox.position.y = origin.y + OFFSET;
    hitBox.rotation = playerRotation.clone();

    if (HITBOX_DEBUG) {
        hitBox.isVisible = true;
        hitBox.visibility = 0.3;
        const material = new StandardMaterial("hitBoxMat", scene);
        material.wireframe = true;
        material.diffuseColor = new Color3(0, 1, 0);
        hitBox.material = material;
    }

    return hitBox;
};

const checkIntersections = (hitBox: AbstractMesh, playerMeshes: Map<string, AbstractMesh>): void => {
    playerMeshes.forEach((mesh, sessionId) => {
        if (mesh === hitBox) return;
        const intersects = hitBox.intersectsMesh(mesh, true);
        if (intersects) {
            console.log(`Hit detected on player (hit box): ${sessionId}`);
        }
    });
};

const handlePunch = (scene: Scene, localPlayerMesh: AbstractMesh) => {
    if (!localPlayerMesh) {
        console.error("Combat: No mesh found");
        return;
    }

    // Create ray
    const ray = createRay(localPlayerMesh);

    // Visualize the ray
    if (RAY_DEBUG) {
        const rayHelper = new RayHelper(ray);
        rayHelper.show(scene, new Color3(1, 0, 0)); // Red ray
        setTimeout(() => rayHelper.hide(), DEBUG_TIMER); // Hide after 0.5s
    }

    // Create hitbox at the end of the ray
    const hitBox = createHitbox(scene, ray.origin, ray.direction, localPlayerMesh.rotation);

    // Check intersection with all remote player meshes
    checkIntersections(hitBox, playerMeshes);

    // Clean up hit box
    setTimeout(() => hitBox.dispose(), 500);
}


export const setupCombat = (
    scene: Scene,
    playerState: PlayerState
) => {
    scene.onPointerObservable.add((pointerInfo) => {
        const animationHandler = playerState.getAnimationHandler();
        if (!animationHandler) {
            console.error("Combat: No animation handler found");
            return;
        }
        const movementState = playerState.getMovementState();
        if (!movementState) {
            console.error("Combat: No movement state found");
            return;
        }
        const localPlayerMesh = playerState.getMesh();
        if (!localPlayerMesh) {
            console.error("Combat: No mesh found");
            return;
        }

        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            if (pointerInfo.event.button === 0) {
                // left click - normal punch
                animationHandler.handlePunch(true);
                movementState.isPunching = true;
                handlePunch(scene, playerState.getMesh()!);
            } else if (pointerInfo.event.button === 2) {
                // right click - big punch
                animationHandler.handleBigPunch(true);
                movementState.isBigPunching = true;
                handlePunch(scene, playerState.getMesh()!);
            }
        } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
            if (pointerInfo.event.button === 0) {
                animationHandler.handlePunch(false);
                movementState.isPunching = false;
            } else if (pointerInfo.event.button === 2) {
                animationHandler.handleBigPunch(false);
                movementState.isBigPunching = false;
            }
        }
    });
}; 
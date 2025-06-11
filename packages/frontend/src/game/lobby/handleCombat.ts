import { Scene, PointerEventTypes, AbstractMesh, Vector3, Ray, RayHelper, FollowCamera, Color3, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { PlayerState } from "./PlayerState";
import { playerMeshes } from "./handleMultiplayer";

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

        const handlePunch = (localPlayerMesh: AbstractMesh) => {
            if (!localPlayerMesh) {
                console.error("Combat: No mesh found");
                return;
            }

            const DEBUG_TIMER = 500;
            const HITBOX_DEBUG = true;
            const RAY_DEBUG = true;
            const RAY_LENGTH = 4;
            const OFFSET = 1;

            // Get origin position
            const origin = localPlayerMesh.getAbsolutePosition().clone();
            origin.y += OFFSET;
            // Get forward direction
            const forward = localPlayerMesh.getDirection(new Vector3(0, 0, 1));
            const ray = new Ray(origin, forward, RAY_LENGTH);

            // Visualize the ray
            if (RAY_DEBUG) {
                const rayHelper = new RayHelper(ray);
                rayHelper.show(scene, new Color3(1, 0, 0)); // Red ray
                setTimeout(() => rayHelper.hide(), DEBUG_TIMER); // Hide after 0.5s
            }

            // --- HIT BOX LOGIC ---
            // Create an invisible box in front of the player
            const hitBoxSize = new Vector3(2, 2, 2); // width, height, depth
            const hitBox = MeshBuilder.CreateBox("hitBox", { size: 1 }, scene);
            hitBox.scaling = hitBoxSize;
            hitBox.isVisible = false;
            // Position the hit box in front of the player
            hitBox.position = origin.add(forward.scale(2)); // 2 units in front
            hitBox.position.y = origin.y + OFFSET;
            // Align hit box with player rotation
            hitBox.rotation = localPlayerMesh.rotation.clone();

            // hitbox debug
            if (HITBOX_DEBUG) {
                hitBox.isVisible = true;
                hitBox.visibility = 0.3;
                hitBox.material = new StandardMaterial("hitBoxMat", scene);
                hitBox.material.wireframe = true;
                (hitBox.material as StandardMaterial).diffuseColor = new Color3(0, 1, 0);
            }

            // Check intersection with all remote player meshes
            playerMeshes.forEach((mesh, sessionId) => {
                if (mesh === localPlayerMesh) return;
                // Update hitbox position
                hitBox.getAbsolutePosition();
                // console.log("Checking intersection with:", mesh.name, mesh.position, mesh.getBoundingInfo().boundingBox);
                // console.log("Hitbox world position:", hitBox.getAbsolutePosition());
                // console.log("Enemy mesh world position:", mesh.getAbsolutePosition());

                const intersects = hitBox.intersectsMesh(mesh, true);
                console.log(`Hitbox intersects with ${mesh.name}:`, intersects);
                if (intersects) {
                    console.log(`Hit detected on player (hit box): ${sessionId}`);
                }
            });

            // Clean up hit box
            setTimeout(() => hitBox.dispose(), 500);
        }

        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            if (pointerInfo.event.button === 0) {
                // left click - normal punch
                animationHandler.handlePunch(true);
                movementState.isPunching = true;
                handlePunch(playerState.getMesh()!);
            } else if (pointerInfo.event.button === 2) {
                // right click - big punch
                animationHandler.handleBigPunch(true);
                movementState.isBigPunching = true;
                handlePunch(playerState.getMesh()!);
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
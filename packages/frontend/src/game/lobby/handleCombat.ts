import { Scene, PointerEventTypes } from "@babylonjs/core";
import { PlayerState } from "./PlayerState";

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

        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            if (pointerInfo.event.button === 0) {
                // left click - normal punch
                animationHandler.handlePunch(true);
                movementState.isPunching = true;
            } else if (pointerInfo.event.button === 2) {
                // right click - big punch
                animationHandler.handleBigPunch(true);
                movementState.isBigPunching = true;
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
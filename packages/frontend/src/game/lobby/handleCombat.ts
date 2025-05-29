import { Scene, PointerEventTypes } from "@babylonjs/core";
import { MovementState } from "./handleMovement";
import { AnimationHandler } from "./handleAnimations";

export const setupCombat = (
    scene: Scene,
    animationHandler: AnimationHandler,
    state: MovementState
) => {
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            if (pointerInfo.event.button === 0) {
                // left click - normal punch
                animationHandler.handlePunch(true);
                state.isPunching = true;
            } else if (pointerInfo.event.button === 2) {
                // right click - big punch
                animationHandler.handleBigPunch(true);
                state.isBigPunching = true;
            }
        } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
            if (pointerInfo.event.button === 0) {
                animationHandler.handlePunch(false);
                state.isPunching = false;
            } else if (pointerInfo.event.button === 2) {
                animationHandler.handleBigPunch(false);
                state.isBigPunching = false;
            }
        }
    });
}; 
import { Scene, PointerEventTypes } from "@babylonjs/core";
import { Animations } from "./createPlayerModel";
import { MovementState } from "./handleMovement";

export const setupCombat = (
    scene: Scene,
    animations: Animations,
    state: MovementState
) => {
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
            if (pointerInfo.event.button === 0) {
                // left click - normal punch
                if (animations.punch) {
                    if (!state.isPunching) {
                        state.isPunching = true;
                        animations.punch.loopAnimation = false;
                        animations.punch.from = 0;
                        animations.punch.to = 40;
                        animations.punch.play(true);
                    }
                }
            } else if (pointerInfo.event.button === 2) {
                // right click - big punch
                if (animations.bigPunch) {
                    if (!state.isBigPunching) {
                        state.isBigPunching = true;
                        animations.bigPunch.play(true);
                    }
                }
            }
        } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
            if (animations.punch) {
                state.isPunching = false;
                animations.punch.stop();
            }
            if (animations.bigPunch) {
                state.isBigPunching = false;
                animations.bigPunch.stop();
            }
        }
    });
}; 
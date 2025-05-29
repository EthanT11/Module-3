import { Scene } from "@babylonjs/core";
import { Animations } from "./createPlayerModel";

// Types of animations that can be player | NOTE: Jump is probably not going to be needed anymore and just need to integrat the rest as needed
export enum PlayerAnimation {
    IDLE = "idle",
    RUN = "run",
    // JUMP = "jump",
    // JUMP_UP = "jumpUp",
    PUNCH = "punch",
    BIG_PUNCH = "bigPunch",
    // GET_HIT = "getHit",
    // DEATH = "death",
    VICTORY = "victory"
}

export interface AnimationState {
    currentAnimation: PlayerAnimation;
    isPunching: boolean;
    isBigPunching: boolean;
    wasMoving: boolean;
}

export class AnimationHandler {
    private animations: Animations;
    private state: AnimationState;
    private scene: Scene;

    constructor(scene: Scene, animations: Animations) {
        this.scene = scene;
        this.animations = animations;
        // Init Anim State
        this.state = {
            currentAnimation: PlayerAnimation.IDLE,
            isPunching: false,
            isBigPunching: false,
            wasMoving: false
        };

        // Start with idle animation
        this.playAnimation(PlayerAnimation.IDLE);
    }

    public playAnimation(animation: PlayerAnimation, loop: boolean = true) {
        // Stop current animation if it exists
        const currentAnim = this.animations[this.state.currentAnimation.toLowerCase() as keyof Animations];
        if (currentAnim) {
            currentAnim.stop();
        }

        // Play new animation
        const newAnim = this.animations[animation.toLowerCase() as keyof Animations];
        if (newAnim) {
            newAnim.loopAnimation = loop;
            newAnim.play(true);
            this.state.currentAnimation = animation;
        }
    }

    // Handle movement animation | If moving play run animation, if not moving play idle animation
    public handleMovement(isMoving: boolean) {
        if (isMoving && !this.state.wasMoving) {
            this.playAnimation(PlayerAnimation.RUN);
        } else if (!isMoving && this.state.wasMoving) {
            this.playAnimation(PlayerAnimation.IDLE);
        }
        this.state.wasMoving = isMoving;
    }

    public handlePunch(isPunching: boolean) {
        if (isPunching && !this.state.isPunching) {
            this.state.isPunching = true;
            if (this.animations.punch) {
                this.animations.punch.loopAnimation = false;
                this.animations.punch.from = 0;
                this.animations.punch.to = 40;
                this.animations.punch.play(true);
            }
        } else if (!isPunching && this.state.isPunching) {
            this.state.isPunching = false;
            if (this.animations.punch) {
                this.animations.punch.stop();
            }
        }
    }

    public handleBigPunch(isBigPunching: boolean) {
        if (isBigPunching && !this.state.isBigPunching) {
            this.state.isBigPunching = true;
            if (this.animations.bigPunch) {
                this.animations.bigPunch.play(true);
            }
        } else if (!isBigPunching && this.state.isBigPunching) {
            this.state.isBigPunching = false;
            if (this.animations.bigPunch) {
                this.animations.bigPunch.stop();
            }
        }
    }

    public getCurrentAnimation(): PlayerAnimation {
        return this.state.currentAnimation;
    }

    public dispose() {
        // Stop all animations
        Object.values(this.animations).forEach(anim => {
            if (anim) {
                anim.stop();
            }
        });
    }
}
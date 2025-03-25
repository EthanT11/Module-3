import { Vector3 } from "@babylonjs/core";

// Enum helps with type safety when referencing animations
// TODO: Add falling animation, attacking animation(shove)
export enum PlayerAnimation {
    IDLE = "idle",
    RUNNING = "run",
    JUMPING = "jump",
}

export interface IPlayerState {
    position: Vector3;
    rotationY: number;
    isMoving: boolean;
    isSprinting: boolean;
    isJumping: boolean;
    currentAnimation: PlayerAnimation;
    sessionId: string;
}

// Implements keyword makes sure that the class implements all the properties of the interface
export class PlayerState implements IPlayerState {
    position: Vector3;
    rotationY: number;
    isMoving: boolean;
    isSprinting: boolean;
    isJumping: boolean;
    currentAnimation: PlayerAnimation;
    sessionId: string;

    constructor(sessionId: string) {
        this.position = new Vector3(0, 0, 0);
        this.rotationY = 0;
        this.isMoving = false;
        this.isSprinting = false;
        this.isJumping = false;
        this.currentAnimation = PlayerAnimation.IDLE;
        this.sessionId = sessionId;
    }

    updatePosition(position: Vector3) {
        this.position.set(position.x, position.y, position.z);
    }
}

export class PlayerStateManager {
    // private makes it so the variables can't be accessed outside the class
    private players: Map<string, PlayerState>;
    private localPlayerId: string | null;

    constructor() {
        this.players = new Map();
        this.localPlayerId = null;
    }
    
}
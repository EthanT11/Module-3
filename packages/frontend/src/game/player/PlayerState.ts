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
// A State to keep track of the player individual properties
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

    updateRotationY(rotationY: number) {
        this.rotationY = rotationY;
    }

    setAnimationState(state: PlayerAnimation) {
        this.currentAnimation = state;
    }
}

// A State to keep track of all the players in the room
export class PlayerStateManager {
    // private makes it so the variables can't be accessed outside the class
    private players: Map<string, PlayerState>;
    private localPlayerId: string | null;

    constructor() {
        this.players = new Map();
        this.localPlayerId = null;
    }

    // Create a new player state and add it to the map
    addPlayer(sessionId: string) {
        const playerState = new PlayerState(sessionId);
        this.players.set(sessionId, playerState);
        return playerState;
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
    
    // Get a player state from the map
    getPlayer(sessionId: string): PlayerState | undefined {
        return this.players.get(sessionId);
    }

    setLocalPlayer(sessionId: string) {
        this.localPlayerId = sessionId;
    }

    getLocalPlayer(): PlayerState | undefined {
        if (!this.localPlayerId) {
            return undefined;
        }
        return this.players.get(this.localPlayerId);
    }


}
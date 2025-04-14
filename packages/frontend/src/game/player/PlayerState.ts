import { Color3, Vector3 } from "@babylonjs/core";
import { Room } from "colyseus.js";

// Map State
export interface IMapState {
    data: number[];
    width: number;
    height: number;
    fogColor: number[];
    fogDensity: number;
}

export class MapState implements IMapState {
    data: number[];
    width: number;
    height: number;
    fogColor: number[];
    fogDensity: number;

    constructor() {
        this.data = [];
        this.width = 0;
        this.height = 0;
        this.fogColor = [0, 0, 0];
        this.fogDensity = 0;
    }
}

// Player State
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


// Keep track of the player individual properties
export class PlayerState implements IPlayerState {
    position: Vector3;
    rotationY: number;
    isMoving: boolean;
    isSprinting: boolean;
    isJumping: boolean;
    currentAnimation: PlayerAnimation;
    isHost: boolean;
    sessionId: string;
    
    constructor(sessionId: string) {
        this.position = new Vector3(0, 0, 0);
        this.rotationY = 0;
        this.isMoving = false;
        this.isSprinting = false;
        this.isJumping = false;
        this.currentAnimation = PlayerAnimation.IDLE;
        this.isHost = false;
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

    setIsHost(isHost: boolean) {
        this.isHost = isHost;
    }
}



// A State to keep track of all the players in the room
export class PlayerStateManager {
    // Map of all the players in the room
    private players: Map<string, PlayerState>;
    private localPlayerId: string | null;
    // Current map state
    private mapState: MapState;
    private isHost: boolean;

    constructor() {
        this.players = new Map();
        this.localPlayerId = null;
        this.mapState = new MapState();
        this.isHost = false;
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


    // Map State
    async setMapState(mapState: MapState, room: Room) {
        this.mapState = mapState;
        try {
            room.send("setMapState", this.mapState);
            console.log("Set map state: ", this.mapState);
        } catch (error) {
            console.error("Error setting map state: ", error);
            throw error;
        }
    }

    getMapState(room: Room): MapState | null {
        room.send("getMapState", this.mapState);
        return this.mapState;
    }

    setIsHost(isHost: boolean) {
        this.isHost = isHost;
        if (isHost) {
            this.mapState = new MapState();
        } 
    }

    getIsHost(): boolean {
        return this.isHost;
    }
}
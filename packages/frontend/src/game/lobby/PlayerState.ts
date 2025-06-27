import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { AnimationHandler } from "./handleAnimations";
import { MovementState } from "./handleMovement";

export interface IPlayerState {
    sessionId: string;
    isHost: boolean;
    position: Vector3;
    rotationY: number;
    
    mesh?: AbstractMesh;
    animationHandler?: AnimationHandler;
    movementState?: MovementState;

    health: number;
    maxHealth: number;
}

export class PlayerState implements IPlayerState {
    sessionId: string;
    isHost: boolean;
    isReady: boolean;

    position: Vector3;
    rotationY: number;
    
    mesh?: AbstractMesh;
    animationHandler?: AnimationHandler;
    movementState?: MovementState;

    health: number;
    maxHealth: number;
    isHit: boolean;

    constructor(sessionId: string, isHost: boolean) {
        // Position
        this.position = new Vector3(0, 0, 0); // TODO: Get position from server
        this.rotationY = 0; // TODO: Get rotation from server
        
        // Combat
        this.health = 100;
        this.maxHealth = 100;
        this.isHit = false;
        
        // Lobby
        this.sessionId = sessionId;
        this.isHost = isHost;
        this.isReady = false;
    }

    // Setters
    setMesh(mesh: AbstractMesh) {
        this.mesh = mesh;
    }

    setRotationY(rotationY: number) {
        this.rotationY = rotationY;
    }

    setPosition(position?: Vector3) {
        if (position) {
            this.position = position;
            if (this.mesh) {
                this.mesh.position = position;
            }
        } else if (this.mesh) {
            this.position = this.mesh.getAbsolutePosition();
        } else {
            console.error("PlayerState: No mesh or position provided");
        }
    }

    updatePosition(x: number, y: number, z: number) {
        this.position = new Vector3(x, y, z);
        if (this.mesh) {
            this.mesh.position = this.position;
        }
    }

    setAnimationHandler(animationHandler: AnimationHandler) {
        this.animationHandler = animationHandler;
    }

    setMovementState(movementState: MovementState) {
        this.movementState = movementState;
    }

    setHealth(health: number) {
        this.health = health;
    }

    setIsReady(isReady: boolean) {
        this.isReady = isReady;
    }

    getHealth() {
        return this.health;
    }

    setIsHit(isHit: boolean) {
        this.isHit = isHit;
        if (isHit) {
            this.animationHandler?.handleHit(true);
        } else {
            this.animationHandler?.handleHit(false);
        }
    }

    getIsHit() {
        return this.isHit;
    }

    // Getters
    getAnimationHandler() {
        return this.animationHandler;
    }

    getMovementState() {
        return this.movementState;
    }

    getMesh() {
        return this.mesh;
    }

    getPosition() {
        return this.position;
    }

    getRotationY() {
        return this.rotationY;
    }

    getIsReady() {
        return this.isReady;
    }
}
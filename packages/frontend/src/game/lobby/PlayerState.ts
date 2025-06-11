import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { AnimationHandler } from "./handleAnimations";
import { MovementState } from "./handleMovement";

export interface IPlayerState {
    sessionId: string;
    isHost: boolean;
    mesh?: AbstractMesh;
    position: Vector3;
    rotationY: number;

    animationHandler?: AnimationHandler;
    movementState?: MovementState;
}

export class PlayerState implements IPlayerState {
    sessionId: string;
    isHost: boolean;

    mesh?: AbstractMesh;
    position: Vector3;
    rotationY: number;

    animationHandler?: AnimationHandler;

    movementState?: MovementState;

    constructor(sessionId: string, isHost: boolean) {
        this.sessionId = sessionId;
        this.isHost = isHost;
        this.position = new Vector3(0, 0, 0); // TODO: Get position from server
        this.rotationY = 0; // TODO: Get rotation from server
    }

    // Setters
    setMesh(mesh: AbstractMesh) {
        this.mesh = mesh;
    }

    setRotationY(rotationY: number) {
        this.rotationY = rotationY;
    }

    setAnimationHandler(animationHandler: AnimationHandler) {
        this.animationHandler = animationHandler;
    }

    setMovementState(movementState: MovementState) {
        this.movementState = movementState;
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
}
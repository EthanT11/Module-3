import { Scene, PointerEventTypes, AbstractMesh } from "@babylonjs/core";

// Mouse sensitivity
const MOUSE_SENSITIVITY = 0.003;

export const handleRotation = (scene: Scene, playerMesh: AbstractMesh) => {
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE && document.pointerLockElement) {
            // deltaX is the amount of movement on the X axis
            const deltaX = pointerInfo.event.movementX || 0;
            // playerRotationY is the current rotation of the player mesh on the Y axis
            const playerRotationY = playerMesh.rotation.y - deltaX * MOUSE_SENSITIVITY;
            // Normalize rotation
            playerMesh.rotation.y = (playerRotationY + Math.PI * 2) % (Math.PI * 2);
        } 
    });
}; 
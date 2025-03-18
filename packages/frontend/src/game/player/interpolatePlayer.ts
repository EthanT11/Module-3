import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";
// Interpolate the player's position | Interpolation is used to smooth the movement
export const interpolatePlayerPosition = (
    mesh: AbstractMesh, 
    targetPosition: Vector3, 
    smoothness: number = SCENE_CONFIG.CAMERA_CONFIG.positionSmoothness
) => {
    mesh.position = Vector3.Lerp(
        mesh.position,
        targetPosition,
        smoothness
    );
}

export const interpolatePlayerRotation = ( 
    mesh: AbstractMesh, 
    targetRotation: number, 
    smoothness: number = SCENE_CONFIG.CAMERA_CONFIG.rotationSmoothness
) => {
    const currentRotation = mesh.rotation.y;
    // Handle rotation wrapping around 360 degrees
    let difference = targetRotation - currentRotation; // Calculate the difference between the target and current rotation
    if (difference > Math.PI) difference -= Math.PI * 2; // If the difference is greater than 180 degrees, wrap around to the other side
    if (difference < -Math.PI) difference += Math.PI * 2; // If the difference is less than -180 degrees, wrap around to the other side
    
    mesh.rotation.y = currentRotation + difference * smoothness;
}
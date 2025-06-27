import { AbstractMesh, FollowCamera, Vector3, Scene } from "@babylonjs/core";

export const createCamera = (target: AbstractMesh, scene: Scene) => {
    const camera = new FollowCamera("ThirdPersonCam", new Vector3(0, 7, -7), scene);
    camera.inertia = 0.4;
    camera.fov = 0.8;
    camera.minZ = 0.1;

    // Set the camera to always follow the player mesh
    // TODO: Decided on a better camera position
    camera.lockedTarget = target;
    // camera.upperHeightOffsetLimit = 10;
    // camera.heightOffset = 20;
    // camera.lowerHeightOffsetLimit = 5; // Helps angle the camera and avoid clipping
    camera.rotationOffset = 180; // Always behind the player

    return camera;
}
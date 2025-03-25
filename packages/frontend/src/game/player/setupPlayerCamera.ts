import { Scene, UniversalCamera, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { SCENE_CONFIG } from "../config";

export const setupPlayerCamera = (scene: Scene, canvas: HTMLCanvasElement): UniversalCamera => {
    try {
        const camera = new UniversalCamera(
            "camera", 
            SCENE_CONFIG.CAMERA_CONFIG.startPosition,
            scene
        );
        camera.attachControl(canvas, true);
    
        // camera.applyGravity = true; // Gravity is applied in the handlePlayerMovement function |
        camera.checkCollisions = true;
        camera.ellipsoid = SCENE_CONFIG.CAMERA_CONFIG.ellipsoid; // Collision box of the camera
        camera.ellipsoidOffset = SCENE_CONFIG.CAMERA_CONFIG.ellipsoidOffset; // offset to match player's height
        
        // Add ellipsoid visualization
        const ellipsoidMaterial = new StandardMaterial("ellipsoidMat", scene);
        ellipsoidMaterial.alpha = 0.5;
        ellipsoidMaterial.diffuseColor = new Color3(1, 0, 0);
        ellipsoidMaterial.emissiveColor = new Color3(0.5, 0, 0);
        ellipsoidMaterial.wireframe = false;

        const ellipsoidMesh = MeshBuilder.CreateSphere("ellipsoid", {
            segments: 16,
            diameter: 2,
        }, scene);
        ellipsoidMesh.material = ellipsoidMaterial;
        ellipsoidMesh.parent = camera;
        ellipsoidMesh.isVisible = false; // Hidden by default

        // Update ellipsoid visualization
        scene.registerBeforeRender(() => {
            ellipsoidMesh.scaling = camera.ellipsoid;
            ellipsoidMesh.position = camera.ellipsoidOffset;
        });

        // Toggle visualization with 'B' key
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === 1 && kbInfo.event.key === 'b') {
                ellipsoidMesh.isVisible = !ellipsoidMesh.isVisible;
                scene.meshes.forEach(mesh => {
                    if (mesh.checkCollisions) {
                        mesh.showBoundingBox = !mesh.showBoundingBox;
                    }
                });
            }
        });

        camera.minZ = 0.1; // Helps with camera clipping
        camera.speed = SCENE_CONFIG.CAMERA_CONFIG.speed;
        camera.inertia = SCENE_CONFIG.CAMERA_CONFIG.inertia; // 0 is no inertia, 1 is full inertia
        
        camera.rotationQuaternion = camera.absoluteRotation;

        console.log("Camera setup complete");
        return camera;
    } catch (error) {
        console.error("Error setting up camera:", error);
        throw error;
        
    }
}
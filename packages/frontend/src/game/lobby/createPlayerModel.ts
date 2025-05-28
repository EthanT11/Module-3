import { Scene, AnimationGroup, AbstractMesh } from "@babylonjs/core";
import { LoadAssetContainerAsync } from "@babylonjs/core";
import useSupabase from "../../hooks/useSupabase";

export interface Animations {
    tpose: AnimationGroup;
    idle: AnimationGroup;
    run: AnimationGroup;
    jump: AnimationGroup;
    jumpUp: AnimationGroup;
    punch: AnimationGroup;
    bigPunch: AnimationGroup;
    getHit: AnimationGroup;
    death: AnimationGroup;
    victory: AnimationGroup;
}

export const createPlayerModel = async (scene: Scene): Promise<{ playerMesh: AbstractMesh; animations: Animations } | null> => {
    try {
        const { getAssetUrl } = useSupabase();
        const modelUrl = getAssetUrl("models", "newCharacterModel.glb");
        
        const modelContainer = await LoadAssetContainerAsync(
            modelUrl,
            scene,
            {
                pluginExtension: ".glb"
            }
        );

        // Add meshes to scene
        modelContainer.meshes.forEach(mesh => {
            scene.addMesh(mesh);
        });

        // Add animation groups to scene
        modelContainer.animationGroups.forEach(group => {
            if (scene.animationGroups.find(g => g.name === group.name)) {
                scene.removeAnimationGroup(group);
            }
            scene.addAnimationGroup(group);
        });

        // Get player mesh
        const playerMesh = scene.getMeshByName("characterMedium") as AbstractMesh;
        if (!playerMesh) {
            console.error("CreatePlayer: Player mesh not found");
            return null;
        }

        // Setup animations
        const animations: Animations = {
            tpose: scene.getAnimationGroupByName("t-pose") as AnimationGroup,
            idle: scene.getAnimationGroupByName("idle") as AnimationGroup,
            run: scene.getAnimationGroupByName("run") as AnimationGroup,
            jump: scene.getAnimationGroupByName("jump") as AnimationGroup,
            jumpUp: scene.getAnimationGroupByName("jumpUp") as AnimationGroup,
            punch: scene.getAnimationGroupByName("punch1") as AnimationGroup,
            bigPunch: scene.getAnimationGroupByName("punch2") as AnimationGroup,
            getHit: scene.getAnimationGroupByName("hit") as AnimationGroup,
            death: scene.getAnimationGroupByName("death") as AnimationGroup,
            victory: scene.getAnimationGroupByName("dance") as AnimationGroup,
        };

        // Start with idle animation
        animations.idle.play(true);

        return { playerMesh, animations };
    } catch (error) {
        console.error("CreatePlayer: Error creating player", error);
        return null;
    }
};
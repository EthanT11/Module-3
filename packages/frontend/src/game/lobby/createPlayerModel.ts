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
    hit: AnimationGroup;
    death: AnimationGroup;
    victory: AnimationGroup;
}

export const createPlayerModel = async (scene: Scene, playerId?: string): Promise<{ playerMesh: AbstractMesh; animations: Animations } | null> => {
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

        // Use name if provided
        // TODO: Get name from Start Screem input
        const uniqueId = playerId || `player_${Date.now()}`;
        
        // Add meshes to scene with unique names
        modelContainer.meshes.forEach(mesh => {
            mesh.name = `${mesh.name}_${uniqueId}`;
            scene.addMesh(mesh);
        });

        // Add animation groups to scene
        modelContainer.animationGroups.forEach(group => {
            console.log("Animation group: ", group.name);
            group.name = `${group.name}_${uniqueId}`;
            if (scene.animationGroups.find(g => g.name === group.name)) {
                scene.removeAnimationGroup(group);
            }
            scene.addAnimationGroup(group);
        });

        // Get player mesh
        const meshId = `characterMedium_${uniqueId}`;
        const playerMesh = scene.getMeshByName(meshId) as AbstractMesh;
        if (!playerMesh) {
            console.error("CreatePlayer: Player mesh not found with id: ", meshId);
            return null;
        }

        // Setup animations
        const animations: Animations = {
            tpose: scene.getAnimationGroupByName(`t-pose_${uniqueId}`) as AnimationGroup,
            idle: scene.getAnimationGroupByName(`idle_${uniqueId}`) as AnimationGroup,
            run: scene.getAnimationGroupByName(`run_${uniqueId}`) as AnimationGroup,
            jump: scene.getAnimationGroupByName(`jump_${uniqueId}`) as AnimationGroup,
            jumpUp: scene.getAnimationGroupByName(`jumpUp_${uniqueId}`) as AnimationGroup,
            punch: scene.getAnimationGroupByName(`punch1_${uniqueId}`) as AnimationGroup,
            bigPunch: scene.getAnimationGroupByName(`punch2_${uniqueId}`) as AnimationGroup,
            hit: scene.getAnimationGroupByName(`hit_${uniqueId}`) as AnimationGroup,
            death: scene.getAnimationGroupByName(`death_${uniqueId}`) as AnimationGroup,
            victory: scene.getAnimationGroupByName(`dance_${uniqueId}`) as AnimationGroup,
        };

        // Start with idle animation
        animations.idle.play(true);

        return { playerMesh, animations };
    } catch (error) {
        console.error("CreatePlayer: Error creating player", error);
        return null;
    }
};
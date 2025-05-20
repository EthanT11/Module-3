import { Engine, Scene, ArcRotateCamera } from "@babylonjs/core";
import { createLight, createSkyBox, createGround, createFog } from "../../map/map_objects";
import fillMap from "../../map/utility/fillMap";
import { createArcCamera } from "./createArcCamera";
import { startScreenMap } from "../../map/utility/startScreenMaps";
import generateMaze from "../../map/utility/generateMaze";
import { SCENE_CONFIG } from "../../config";
import { startScreenConfig } from "../start_menu/startScreenConfig";
export interface MenuEnvironment {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera;
}

export const createMenuEnvironment = async (canvas: HTMLCanvasElement): Promise<MenuEnvironment> => {
  const engine = new Engine(canvas, true);
  engine.setHardwareScalingLevel(1.0); // Helps with performance on low end devices
  engine.maxFPS = SCENE_CONFIG.MAX_FPS;
  const scene = new Scene(engine);
  
  // Setup loading screen
  engine.loadingScreen.displayLoadingUI();
  engine.loadingScreen.loadingUIBackgroundColor = "gray";
  try {
    // Create basic environment
    createLight(scene);
    createSkyBox(scene);
    createGround(scene);
    createFog(scene);

    // Create and fill map
    // const map = startScreenMap;
    const map = generateMaze();
    if (!map) {
        throw new Error("Failed to create map");
    } else {
        fillMap([...map].reverse(), scene);
    }

    // Create camera
    const camera = createArcCamera(canvas, scene);
    if (!camera) {
      throw new Error("Failed to create camera");
    }

    engine.runRenderLoop(() => {
      camera.alpha += startScreenConfig.CAMERA.CAMERA_SPEED;  
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    console.log("Start Environment Created");
    return { engine, scene, camera };
  } catch (error) {
    console.error("Error creating menu environment:", error);
    throw error;
  } finally {
    engine.loadingScreen.hideLoadingUI();
  }
}
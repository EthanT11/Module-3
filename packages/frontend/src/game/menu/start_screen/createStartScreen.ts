import { Engine, Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { startScreenConfig } from "./startScreenConfig";
import { createStartMenu } from "../utility/createStartMenu";
import { createTitle } from "../utility/createTitle";
import { createMenuEnvironment } from "../utility/createMenuEnvironment";

export interface BabylonStartScreenProps {
  onStart: () => void;
}

export const createBabylonStartScreen = async (canvas: HTMLCanvasElement, props: BabylonStartScreenProps): Promise<{ engine: Engine; scene: Scene; dispose: () => void }> => {
  const { engine, scene, camera } = await createMenuEnvironment(canvas);

  // Create UI
  const startScreenUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  createTitle(startScreenUI);
  createStartMenu(startScreenUI, props);
  
  // Render loop
  engine.runRenderLoop(() => {
    // Rotate camera around the map
    camera.alpha += startScreenConfig.CAMERA.CAMERA_SPEED;  
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });

  const dispose = () => {
    scene.dispose();
    engine.dispose();
  };
  return { engine, scene, dispose };
};

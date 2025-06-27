import { ArcRotateCamera, Scene } from "@babylonjs/core";
import { startScreenConfig } from "../start_menu/startScreenConfig";

export const createArcCamera = (canvas: HTMLCanvasElement, startScreenScene: Scene) => {   
    const camera = new ArcRotateCamera(
      "arcCamera",
      startScreenConfig.CAMERA.ALPHA,
      startScreenConfig.CAMERA.BETA,
      startScreenConfig.CAMERA.RADIUS,
      startScreenConfig.CAMERA.TARGET,
      startScreenScene
    );
    camera.attachControl(canvas, true);
    // limit camera radius
    camera.lowerRadiusLimit = startScreenConfig.CAMERA.LOWER_RADIUS_LIMIT;
    camera.upperRadiusLimit = startScreenConfig.CAMERA.UPPER_RADIUS_LIMIT;
    camera.wheelDeltaPercentage = startScreenConfig.CAMERA.WHEEL_DELTA_PERCENTAGE; // scroll speed
    camera.fov = startScreenConfig.CAMERA.FOV;
    
    return camera;
  }
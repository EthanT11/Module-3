import { Engine, Scene, Vector3, Color4, ArcRotateCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, TextBlock } from "@babylonjs/gui";
import fillMap from "../game/map/utility/fillMap";
import { createLight, createSkyBox, createGround } from "../game/map/map_objects";

export interface BabylonStartScreenProps {
  onStart: () => void;
}

export const createBabylonStartScreen = (canvas: HTMLCanvasElement, props: BabylonStartScreenProps): { engine: Engine; scene: Scene; dispose: () => void } => {
  const startScreenEngine = new Engine(canvas, true);
  const startScreenScene = new Scene(startScreenEngine);
  startScreenScene.clearColor = new Color4(0.1, 0.12, 0.16, 1);

  // Arc camera rotates around a point
  const camera = new ArcRotateCamera(
    "arcCamera",
    0,        // alpha - rotation angle
    Math.PI / 3, // beta - vertical angle
    45,       // radius - distance from target
    new Vector3(0, 5, 0),
    startScreenScene
  );
  camera.attachControl(canvas, true);
  // limit camera radius
  camera.lowerRadiusLimit = 30;
  camera.upperRadiusLimit = 60;

  camera.wheelDeltaPercentage = 0.01; // scroll speed
  camera.fov = 0.8;
  
  // Create environment
  createLight(startScreenScene);
  createSkyBox(startScreenScene);
  createGround(startScreenScene);
  
  const startScreenMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  
  fillMap(startScreenMap, startScreenScene);

  // Start screen UI
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, startScreenScene);
  
  const titleText = new TextBlock();
  titleText.text = "Maze Punch";
  titleText.color = "white";
  titleText.fontSize = 50;
  titleText.top = "-150px";
  titleText.shadowColor = "black";
  titleText.shadowBlur = 10;
  titleText.shadowOffsetX = 2;
  titleText.shadowOffsetY = 2;
  advancedTexture.addControl(titleText);

  // Start button
  const startButton = Button.CreateSimpleButton("startButton", "Start Game");
  startButton.width = "200px";
  startButton.height = "50px";
  startButton.color = "white";
  startButton.background = "green";
  startButton.paddingBottom = "10px";
  startButton.paddingTop = "10px";
  startButton.cornerRadius = 10;
  startButton.top = "100px";
  
  startButton.onPointerClickObservable.add(() => {
    props.onStart();
  });
  
  advancedTexture.addControl(startButton);
  
  // Render loop
  startScreenEngine.runRenderLoop(() => {
    // Rotate camera around the map
    camera.alpha += 0.001;
    startScreenScene.render();
  });

  window.addEventListener("resize", () => {
    startScreenEngine.resize();
  });

  const dispose = () => {
    startScreenScene.dispose();
    startScreenEngine.dispose();
  };

  return { engine: startScreenEngine, scene: startScreenScene, dispose };
};

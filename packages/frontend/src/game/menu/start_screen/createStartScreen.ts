import { Engine, Scene, Vector3, Color4, ArcRotateCamera, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, InputText, TextBlock } from "@babylonjs/gui";
import fillMap from "../../map/utility/fillMap";
import { createLight, createSkyBox, createGround, createFog } from "../../map/map_objects";
import { startScreenMap } from "../../map/utility/startScreenMaps";
import generateMaze from "../../map/utility/generateMaze";

export interface BabylonStartScreenProps {
  onStart: () => void;
}

export const createBabylonStartScreen = (canvas: HTMLCanvasElement, props: BabylonStartScreenProps): { engine: Engine; scene: Scene; dispose: () => void } => {
  const startScreenEngine = new Engine(canvas, true);
  const startScreenScene = new Scene(startScreenEngine);

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
  // TODO: Add Loading Screen
  createLight(startScreenScene);
  createSkyBox(startScreenScene);
  createGround(startScreenScene);
  createFog(startScreenScene);

  // This might be where the problem with the coordinates is. I have to reverse the map
  const maze = generateMaze();
  // startScreenMap instead of maze for the Punch Maze Title Screen
  fillMap([...maze].reverse(), startScreenScene);

  // Start screen UI
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, startScreenScene);
  
  const titleText = new TextBlock();
  titleText.text = "PUNCH MAZE";
  titleText.color = "white";
  titleText.fontSize = 50;
  titleText.top = "-150px";
  titleText.shadowColor = "black";
  titleText.shadowBlur = 10;
  titleText.shadowOffsetX = 2;
  titleText.shadowOffsetY = 2;
  advancedTexture.addControl(titleText);


  // Contestant name
  const contestantNameText = new TextBlock();
  contestantNameText.text = "Contestant Name";
  contestantNameText.color = "white";
  contestantNameText.fontSize = 20;
  contestantNameText.top = "-100px";
  advancedTexture.addControl(contestantNameText);

  // Name input
  const nameInput = new InputText();
  nameInput.width = "200px";
  nameInput.height = "50px";
  nameInput.color = "white";
  nameInput.fontSize = 20;
  nameInput.top = "-50px";
  advancedTexture.addControl(nameInput);

  // Join Match button
  const joinMatchButton = Button.CreateSimpleButton("joinMatchButton", "Join Match");
  joinMatchButton.width = "200px";
  joinMatchButton.height = "50px";
  joinMatchButton.color = "white";
  joinMatchButton.background = "green";
  joinMatchButton.top = "0px";
  advancedTexture.addControl(joinMatchButton);

  // Start button
  const startButton = Button.CreateSimpleButton("createMatchButton", "Create Match");
  startButton.width = "200px";
  startButton.height = "50px";
  startButton.color = "white";
  startButton.background = "green";
  startButton.paddingBottom = "10px";
  startButton.paddingTop = "10px";
  startButton.cornerRadius = 10;
  startButton.top = "100px";
  advancedTexture.addControl(startButton);

  
  startButton.onPointerClickObservable.add(() => {
    props.onStart();
  });
  
  
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

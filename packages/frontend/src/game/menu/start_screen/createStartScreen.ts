import { Engine, Scene, Vector3, Color4, ArcRotateCamera, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, InputText, TextBlock, Rectangle, StackPanel, Control } from "@babylonjs/gui";
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


  const startScreenUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, startScreenScene);
  
  // Title StackPanel
  const titleStack = new StackPanel();
  titleStack.width = 1;
  titleStack.height = "20%";
  titleStack.isVertical = true;
  titleStack.spacing = 15;
  titleStack.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  startScreenUI.addControl(titleStack);

  const titleText = new TextBlock();
  titleText.width = 1;
  titleText.text = "PUNCH MAZE";
  titleText.color = "white";
  titleText.fontSize = 82;
  // Text Shadow
  titleText.shadowColor = "yellow";
  titleText.shadowBlur = 10;
  titleText.shadowOffsetX = 2;
  titleText.shadowOffsetY = 2;
  titleStack.addControl(titleText);

  // Menu Container
  const menuContainer = new Rectangle();
  menuContainer.width = "300px";
  menuContainer.height = "450px";
  menuContainer.background = "rgba(0, 0, 0, 0.3)";
  menuContainer.cornerRadius = 10;
  menuContainer.thickness = 2;
  menuContainer.color = "white";
  menuContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; 
  menuContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  menuContainer.top = "5%";
  startScreenUI.addControl(menuContainer);

  // StackPanel for name input section
  const topStack = new StackPanel();
  topStack.width = 1;
  topStack.height = 1;
  topStack.isVertical = true;
  topStack.paddingTop = "20px";
  topStack.paddingLeft = "20px";
  topStack.paddingRight = "20px";
  topStack.spacing = 15;
  menuContainer.addControl(topStack);

  // Contestant name
  const contestantNameText = new TextBlock();
  contestantNameText.text = "Contestant Name";
  contestantNameText.color = "white";
  contestantNameText.fontSize = 20;
  contestantNameText.height = "30px";
  contestantNameText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  topStack.addControl(contestantNameText);
  
  // Name input
  const nameInput = new InputText();
  nameInput.width = 1;
  nameInput.height = "40px";
  nameInput.color = "white";
  nameInput.fontSize = 20;
  topStack.addControl(nameInput);

  // Name check text
  const nameCheckText = new TextBlock();
  nameCheckText.text = "Name must be at least 3 characters long and less than 10 characters";
  nameCheckText.color = "white";
  nameCheckText.fontSize = 15;
  nameCheckText.width = 1;
  nameCheckText.height = 0.2;
  nameCheckText.alpha = 0.2;
  nameCheckText.textWrapping = true;
  nameCheckText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  topStack.addControl(nameCheckText);


  // Divider
  const divider = new Rectangle();
  divider.width = 1;
  divider.height = "2px";
  divider.color = "white";
  divider.cornerRadius = 10;
  menuContainer.addControl(divider);

  // Bottom StackPanel for buttons section
  const bottomStack = new StackPanel();
  bottomStack._automaticSize = true;
  bottomStack.width = 1;
  bottomStack.height = 1;
  bottomStack.isVertical = true;
  bottomStack.paddingLeft = "20px";
  bottomStack.paddingRight = "20px";
  bottomStack.spacing = 15;
  bottomStack.top = "60%";
  menuContainer.addControl(bottomStack);

  // Join Match button
  const joinMatchButton = Button.CreateSimpleButton("joinMatchButton", "Join Match");
  joinMatchButton.width = 1;
  joinMatchButton.height = "50px";
  joinMatchButton.color = "white";
  joinMatchButton.background = "green";
  joinMatchButton.cornerRadius = 10;
  bottomStack.addControl(joinMatchButton);

  // Start button
  const startButton = Button.CreateSimpleButton("createMatchButton", "Create Match");
  startButton.width = 1;
  startButton.height = "50px";
  startButton.color = "white";
  startButton.background = "green";
  startButton.cornerRadius = 10;
  bottomStack.addControl(startButton);

  // SelfPlug
  // TODO: Add github and normal selfplug things
  // Just wanted to create the space to know how to account for it
  const selfPlug = new TextBlock();
  selfPlug.text = "Made with ❤️ by Ethan Tracey \n GetBuilding 2025";
  selfPlug.textWrapping = true;
  selfPlug.color = "white";
  selfPlug.fontSize = 15;
  selfPlug.height = "40px";
  selfPlug.alpha = 0.2;
  selfPlug.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  bottomStack.addControl(selfPlug);

  const handleInputText = (input: InputText): boolean => {
    console.log(input.text);
    return input.text.length > 0;
  }

  // Start button on click
  startButton.onPointerClickObservable.add(() => {
    const textCheck = handleInputText(nameInput);
    nameInput.background = textCheck ? "green" : "red";
    if (textCheck) {
      props.onStart();
    }
  });

  nameInput.onTextChangedObservable.add(() => {
    const textCheck = handleInputText(nameInput);
    nameInput.background = textCheck ? "green" : "red";
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

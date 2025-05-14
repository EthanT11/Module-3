import { Engine, Scene, Vector3, Color4, ArcRotateCamera, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, InputText, TextBlock, Rectangle, StackPanel, Control } from "@babylonjs/gui";
import fillMap from "../../map/utility/fillMap";
import { createLight, createSkyBox, createGround, createFog } from "../../map/map_objects";
import { startScreenMap } from "../../map/utility/startScreenMaps";
import generateMaze from "../../map/utility/generateMaze";
import { startScreenConfig } from "./startScreenConfig";

export interface BabylonStartScreenProps {
  onStart: () => void;
}

export const createBabylonStartScreen = (canvas: HTMLCanvasElement, props: BabylonStartScreenProps): { engine: Engine; scene: Scene; dispose: () => void } => {
  const startScreenEngine = new Engine(canvas, true);
  const startScreenScene = new Scene(startScreenEngine);

  // Arc camera rotates around a point
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
  titleText.text = startScreenConfig.UI_CONFIG.TITLE_TEXT;
  titleText.color = startScreenConfig.UI_CONFIG.TITLE_COLOR;
  titleText.fontSize = startScreenConfig.UI_CONFIG.TITLE_FONT_SIZE;
  // Text Shadow
  titleText.shadowColor = startScreenConfig.UI_CONFIG.TITLE_SHADOW_COLOR;
  titleText.shadowBlur = startScreenConfig.UI_CONFIG.TITLE_SHADOW_BLUR;
  titleText.shadowOffsetX = startScreenConfig.UI_CONFIG.TITLE_SHADOW_OFFSET_X;
  titleText.shadowOffsetY = startScreenConfig.UI_CONFIG.TITLE_SHADOW_OFFSET_Y;
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
  contestantNameText.text = startScreenConfig.UI_CONFIG.INPUT_HEADER_TEXT;
  contestantNameText.color = startScreenConfig.UI_CONFIG.INPUT_HEADER_COLOR;
  contestantNameText.fontSize = startScreenConfig.UI_CONFIG.INPUT_HEADER_FONT_SIZE;
  contestantNameText.height = "40px";
  contestantNameText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  topStack.addControl(contestantNameText);
  
  // Name input
  const nameInput = new InputText();
  nameInput.width = 1;
  nameInput.height = "40px";
  nameInput.color = startScreenConfig.UI_CONFIG.INPUT_COLOR;
  nameInput.fontSize = startScreenConfig.UI_CONFIG.INPUT_FONT_SIZE;
  topStack.addControl(nameInput);

  // Name check text
  const nameCheckText = new TextBlock();
  nameCheckText.text = startScreenConfig.UI_CONFIG.CHECK_TEXT;
  nameCheckText.color = startScreenConfig.UI_CONFIG.CHECK_TEXT_COLOR;
  nameCheckText.fontSize = startScreenConfig.UI_CONFIG.CHECK_TEXT_FONT_SIZE;
  nameCheckText.width = 1;
  nameCheckText.height = 0.2;
  nameCheckText.alpha = startScreenConfig.UI_CONFIG.CHECK_TEXT_ALPHA;
  nameCheckText.textWrapping = true;
  nameCheckText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
  topStack.addControl(nameCheckText);


  // Divider
  const divider = new Rectangle();
  divider.width = startScreenConfig.UI_CONFIG.DIVIDER_WIDTH;
  divider.height = "2px";
  divider.color = startScreenConfig.UI_CONFIG.DIVIDER_COLOR;
  divider.cornerRadius = startScreenConfig.UI_CONFIG.DIVIDER_CORNER_RADIUS;
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
  joinMatchButton.height = startScreenConfig.UI_CONFIG.BUTTON_HEIGHT;
  joinMatchButton.color = startScreenConfig.UI_CONFIG.BUTTON_COLOR;
  joinMatchButton.background = startScreenConfig.UI_CONFIG.BUTTON_BACKGROUND;
  joinMatchButton.cornerRadius = startScreenConfig.UI_CONFIG.BUTTON_CORNER_RADIUS;
  bottomStack.addControl(joinMatchButton);

  // Start button
  const startButton = Button.CreateSimpleButton("createMatchButton", "Create Match");
  startButton.width = 1;
  startButton.height = startScreenConfig.UI_CONFIG.BUTTON_HEIGHT;
  startButton.color = startScreenConfig.UI_CONFIG.BUTTON_COLOR;
  startButton.background = startScreenConfig.UI_CONFIG.BUTTON_BACKGROUND;
  startButton.cornerRadius = startScreenConfig.UI_CONFIG.BUTTON_CORNER_RADIUS;
  bottomStack.addControl(startButton);

  // SelfPlug
  // TODO: Add github and normal selfplug things
  // Just wanted to create the space to know how to account for it
  const selfPlug = new TextBlock();
  selfPlug.text = startScreenConfig.UI_CONFIG.SELF_PLUG_TEXT;
  selfPlug.textWrapping = true;
  selfPlug.color = startScreenConfig.UI_CONFIG.SELF_PLUG_COLOR;
  selfPlug.fontSize = startScreenConfig.UI_CONFIG.SELF_PLUG_FONT_SIZE;
  selfPlug.height = "40px";
  selfPlug.alpha = startScreenConfig.UI_CONFIG.SELF_PLUG_ALPHA;
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
    camera.alpha += startScreenConfig.CAMERA.CAMERA_SPEED;  
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

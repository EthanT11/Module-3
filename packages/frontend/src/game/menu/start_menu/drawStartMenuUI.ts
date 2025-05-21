import { startScreenConfig, startScreenUIDimensions } from "./startScreenConfig";
import { AdvancedDynamicTexture, TextBlock, InputText } from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";
import { drawTitle, drawInput, drawDivider, drawMenuContainer, drawButton, drawHeader, drawStack, drawInfoMessage } from "../utility";
interface DrawStartMenuUIProps {
  onJoinMatch: () => void;
  onCreateMatch: () => void;
}

export const drawStartMenuUI = async (scene: Scene, props: DrawStartMenuUIProps): Promise<{ startMenuUI: AdvancedDynamicTexture, dispose: () => void }> => {
    const startMenuUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    drawTitle(startMenuUI);

    const dispose = () => {
        startMenuUI.dispose();
    }

    // Menu Container
    const menuContainer = drawMenuContainer();
    startMenuUI.addControl(menuContainer);

    // StackPanel for name input section
    const topStack = drawStack("top");
    menuContainer.addControl(topStack);

    // Contestant name
    const inputHeader = drawHeader("Contestant Name");
    topStack.addControl(inputHeader);
    
    // Name input
    // NOTE: Babylon apparently doesn't support text horizontal alignment for InputText type field
    const nameInput = drawInput(startScreenConfig.UI_CONFIG.INPUT.PLACEHOLDER_TEXT);
    
    topStack.addControl(nameInput);

    // Name check text | Also error 
    // TODO: implement error message
    const nameCheckText = drawInfoMessage(startScreenConfig.UI_CONFIG.CHECK_TEXT.TEXT);
    topStack.addControl(nameCheckText);

    // Divider
    const divider = drawDivider("20px");
    menuContainer.addControl(divider);

    // Bottom StackPanel for buttons section
    const bottomStack = drawStack("bottom");
    menuContainer.addControl(bottomStack);

    // Join Match button
    const joinMatchButton = drawButton("joinMatchButton", "Join Match", "primary");
    bottomStack.addControl(joinMatchButton);

    // Start button
    const createMatchButton = drawButton("createMatchButton", "Create Match", "secondary");
    bottomStack.addControl(createMatchButton);

    // SelfPlug
    // TODO: Add github and normal selfplug things
    // Just wanted to create the space to know how to account for it
    const selfPlug = new TextBlock();
    selfPlug.text = startScreenConfig.UI_CONFIG.SELF_PLUG.TEXT;
    selfPlug.textWrapping = true;
    selfPlug.color = startScreenConfig.UI_CONFIG.SELF_PLUG.COLOR;
    selfPlug.fontSize = startScreenConfig.UI_CONFIG.SELF_PLUG.FONT_SIZE;
    selfPlug.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    selfPlug.alpha = startScreenConfig.UI_CONFIG.SELF_PLUG.ALPHA;
    selfPlug.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    bottomStack.addControl(selfPlug);

    const handleInputText = (input: InputText): boolean => {
      console.log(input.text);
      return input.text.length > 0;
    }

    nameInput.onTextChangedObservable.add(() => {
      const textCheck = handleInputText(nameInput);
      nameInput.background = textCheck ? "green" : "red";
    });
    
    // Start button on click
    createMatchButton.onPointerClickObservable.add(() => {
      const textCheck = handleInputText(nameInput);
      nameInput.background = textCheck ? "green" : "red";
      if (textCheck) {
        props.onCreateMatch();
      }
    });


    joinMatchButton.onPointerClickObservable.add(() => {
      const textCheck = handleInputText(nameInput);
      nameInput.background = textCheck ? "green" : "red";
      if (textCheck) {
        props.onJoinMatch();
      }
    });

    return { startMenuUI, dispose };
  }
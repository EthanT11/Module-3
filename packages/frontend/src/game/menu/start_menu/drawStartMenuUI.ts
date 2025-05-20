import { startScreenConfig, startScreenUIDimensions } from "./startScreenConfig";
import { AdvancedDynamicTexture, Rectangle, Control, StackPanel, TextBlock, InputText, Button } from "@babylonjs/gui";
import { drawTitle } from "../utility/drawTitle";
import { Scene } from "@babylonjs/core";

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
    const menuContainer = new Rectangle();
    menuContainer.width = startScreenUIDimensions.MENU_CONTAINER.WIDTH;
    menuContainer.height = startScreenUIDimensions.MENU_CONTAINER.HEIGHT;
    
    menuContainer.background = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BACKGROUND;
    menuContainer.cornerRadius = startScreenConfig.UI_CONFIG.MENU_CONTAINER.CORNER_RADIUS;
    menuContainer.thickness = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BORDER_THICKNESS;
    menuContainer.color = startScreenConfig.UI_CONFIG.MENU_CONTAINER.COLOR;
    menuContainer.shadowColor = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_COLOR;
    menuContainer.shadowBlur = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_BLUR;
    menuContainer.shadowOffsetX = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_X;
    menuContainer.shadowOffsetY = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_Y;
    menuContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; 
    menuContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    menuContainer.top = startScreenConfig.UI_CONFIG.MENU_CONTAINER.TOP;
    startMenuUI.addControl(menuContainer);

    // StackPanel for name input section
    const topStack = new StackPanel();
    topStack.width = startScreenUIDimensions.TOP_STACK.WIDTH;
    topStack.height = startScreenUIDimensions.TOP_STACK.HEIGHT;
    topStack.isVertical = true;
    topStack.paddingTop = startScreenUIDimensions.PADDING;
    topStack.paddingLeft = startScreenUIDimensions.PADDING;
    topStack.paddingRight = startScreenUIDimensions.PADDING;
    topStack.spacing = startScreenUIDimensions.SPACING;
    menuContainer.addControl(topStack);

    // Contestant name
    const inputHeader = new TextBlock();
    inputHeader.text = startScreenConfig.UI_CONFIG.INPUT_HEADER.TEXT;
    inputHeader.fontSize = startScreenConfig.UI_CONFIG.INPUT_HEADER.FONT_SIZE
    inputHeader.color = startScreenConfig.UI_CONFIG.INPUT_HEADER.COLOR;
    inputHeader.shadowColor = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_COLOR;
    inputHeader.shadowBlur = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_BLUR;
    inputHeader.shadowOffsetX = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_OFFSET_X;
    inputHeader.shadowOffsetY = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_OFFSET_Y;
    inputHeader.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    inputHeader.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    topStack.addControl(inputHeader);
    
    // Name input
    // NOTE: Babylon apparently doesn't support text horizontal alignment for InputText type field
    const nameInput = new InputText();
    nameInput.background = startScreenConfig.UI_CONFIG.INPUT.BACKGROUND;
    nameInput.color = startScreenConfig.UI_CONFIG.INPUT.COLOR;
    nameInput.focusedBackground = startScreenConfig.UI_CONFIG.INPUT.FOCUSED_BACKGROUND;
    nameInput.fontSize = startScreenConfig.UI_CONFIG.INPUT.FONT_SIZE;
    nameInput.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    nameInput.highlightColor = startScreenConfig.UI_CONFIG.INPUT.HIGHLIGHT_COLOR;
    nameInput.placeholderText = startScreenConfig.UI_CONFIG.INPUT.PLACEHOLDER_TEXT;
    nameInput.shadowBlur = startScreenConfig.UI_CONFIG.INPUT.SHADOW_BLUR;
    nameInput.shadowColor = startScreenConfig.UI_CONFIG.INPUT.SHADOW_COLOR;
    nameInput.shadowOffsetX = startScreenConfig.UI_CONFIG.INPUT.SHADOW_OFFSET_X;
    nameInput.shadowOffsetY = startScreenConfig.UI_CONFIG.INPUT.SHADOW_OFFSET_Y;
    nameInput.textHighlightColor = startScreenConfig.UI_CONFIG.INPUT.TEXT_HIGHLIGHT_COLOR;
    nameInput.width = startScreenUIDimensions.ELEMENT_WIDTH;
    
    topStack.addControl(nameInput);

    // Name check text
    const nameCheckText = new TextBlock();
    nameCheckText.text = startScreenConfig.UI_CONFIG.CHECK_TEXT.TEXT;
    nameCheckText.color = startScreenConfig.UI_CONFIG.CHECK_TEXT.COLOR;
    nameCheckText.fontSize = startScreenConfig.UI_CONFIG.CHECK_TEXT.FONT_SIZE;
    nameCheckText.width = startScreenUIDimensions.ELEMENT_WIDTH;
    nameCheckText.height = "80px";
    nameCheckText.alpha = startScreenConfig.UI_CONFIG.CHECK_TEXT.ALPHA;
    nameCheckText.textWrapping = true;
    nameCheckText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    topStack.addControl(nameCheckText);


    // Divider
    const divider = new Rectangle();
    divider.width = startScreenUIDimensions.ELEMENT_WIDTH;
    divider.height = "2px";
    divider.top = "20px";
    divider.color = startScreenConfig.UI_CONFIG.DIVIDER.COLOR;
    divider.cornerRadius = startScreenConfig.UI_CONFIG.DIVIDER.CORNER_RADIUS;
    menuContainer.addControl(divider);

    // Bottom StackPanel for buttons section
    const bottomStack = new StackPanel();
    bottomStack.width = startScreenUIDimensions.BOTTOM_STACK.WIDTH;
    bottomStack.height = startScreenUIDimensions.BOTTOM_STACK.HEIGHT;
    bottomStack.top = startScreenUIDimensions.BOTTOM_STACK.TOP;
    bottomStack.isVertical = true;
    bottomStack.paddingLeft = startScreenUIDimensions.PADDING;
    bottomStack.paddingRight = startScreenUIDimensions.PADDING;
    bottomStack.spacing = startScreenUIDimensions.SPACING;
    menuContainer.addControl(bottomStack);

    // Join Match button
    const joinMatchButton = Button.CreateSimpleButton("joinMatchButton", "Join Match");
    joinMatchButton.width = startScreenUIDimensions.ELEMENT_WIDTH;
    joinMatchButton.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    joinMatchButton.color = startScreenConfig.UI_CONFIG.BUTTON.COLOR;
    joinMatchButton.background = startScreenConfig.UI_CONFIG.BUTTON.BACKGROUND;
    joinMatchButton.cornerRadius = startScreenConfig.UI_CONFIG.BUTTON.CORNER_RADIUS;
    // Text color
    if (joinMatchButton.textBlock) {
      joinMatchButton.textBlock.color = startScreenConfig.UI_CONFIG.BUTTON.TEXT_COLOR;
    }
    bottomStack.addControl(joinMatchButton);

    // Start button
    const createMatchButton = Button.CreateSimpleButton("createMatchButton", "Create Match");
    createMatchButton.width = startScreenUIDimensions.ELEMENT_WIDTH;
    createMatchButton.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    createMatchButton.color = startScreenConfig.UI_CONFIG.BUTTON.COLOR;
    createMatchButton.background = startScreenConfig.UI_CONFIG.BUTTON.BACKGROUND;
    createMatchButton.cornerRadius = startScreenConfig.UI_CONFIG.BUTTON.CORNER_RADIUS;
    // Text color
    if (createMatchButton.textBlock) {
      createMatchButton.textBlock.color = startScreenConfig.UI_CONFIG.BUTTON.TEXT_COLOR;
    }
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
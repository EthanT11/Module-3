import { StackPanel, AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";
import { startScreenConfig } from "../start_menu/startScreenConfig";

export const drawTitle = (startScreenUI: AdvancedDynamicTexture) => {
    // Title StackPanel
    const titleStack = new StackPanel();
    titleStack.width = startScreenConfig.UI_CONFIG.TITLE.WIDTH;
    titleStack.height = startScreenConfig.UI_CONFIG.TITLE.HEIGHT;
    titleStack.isVertical = true;
    titleStack.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleStack.fontWeight = "bold";
    titleStack.top = startScreenConfig.UI_CONFIG.TITLE.TOP;
    startScreenUI.addControl(titleStack);

    const titleText = new TextBlock();
    titleText.width = startScreenConfig.UI_CONFIG.TITLE.WIDTH;
    titleText.height = startScreenConfig.UI_CONFIG.TITLE.HEIGHT; 
    titleText.text = startScreenConfig.UI_CONFIG.TITLE.TEXT;
    titleText.color = startScreenConfig.UI_CONFIG.TITLE.COLOR;
    titleText.fontSize = startScreenConfig.UI_CONFIG.TITLE.FONT_SIZE;
    // Text Shadow
    titleText.shadowColor = startScreenConfig.UI_CONFIG.TITLE.SHADOW_COLOR;
    titleText.shadowBlur = startScreenConfig.UI_CONFIG.TITLE.SHADOW_BLUR;
    titleText.shadowOffsetX = startScreenConfig.UI_CONFIG.TITLE.SHADOW_OFFSET_X;
    titleText.shadowOffsetY = startScreenConfig.UI_CONFIG.TITLE.SHADOW_OFFSET_Y;
    titleStack.addControl(titleText);
  }
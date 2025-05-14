import { StackPanel, AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";
import { startScreenConfig } from "../start_screen/startScreenConfig";

export const createTitle = (startScreenUI: AdvancedDynamicTexture) => {
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
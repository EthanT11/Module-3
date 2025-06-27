import { startScreenConfig, startScreenUIDimensions } from "../start_menu/startScreenConfig";
import { InputText } from "@babylonjs/gui";

export const drawInput = (placeholderText: string ) => {
    const input = new InputText();
    input.background = startScreenConfig.UI_CONFIG.INPUT.BACKGROUND;
    input.color = startScreenConfig.UI_CONFIG.INPUT.COLOR;
    input.focusedBackground = startScreenConfig.UI_CONFIG.INPUT.FOCUSED_BACKGROUND;
    input.fontSize = startScreenConfig.UI_CONFIG.INPUT.FONT_SIZE;
    input.highlightColor = startScreenConfig.UI_CONFIG.INPUT.HIGHLIGHT_COLOR;
    input.placeholderText = placeholderText;
    input.shadowBlur = startScreenConfig.UI_CONFIG.INPUT.SHADOW_BLUR;
    input.shadowColor = startScreenConfig.UI_CONFIG.INPUT.SHADOW_COLOR;
    input.shadowOffsetX = startScreenConfig.UI_CONFIG.INPUT.SHADOW_OFFSET_X;
    input.shadowOffsetY = startScreenConfig.UI_CONFIG.INPUT.SHADOW_OFFSET_Y;
    input.textHighlightColor = startScreenConfig.UI_CONFIG.INPUT.TEXT_HIGHLIGHT_COLOR;
    input.width = startScreenUIDimensions.ELEMENT_WIDTH;
    input.height = startScreenUIDimensions.ELEMENT_HEIGHT;
    
    return input;
  }
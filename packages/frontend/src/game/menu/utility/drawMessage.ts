import { TextBlock } from "@babylonjs/gui";
import { startScreenUIDimensions } from "../start_menu/startScreenConfig";
import { startScreenConfig } from "../start_menu/startScreenConfig";

export const drawInfoMessage = (text: string) => {
    const infoMessage = new TextBlock();
    infoMessage.text = text;
    infoMessage.color = startScreenConfig.UI_CONFIG.CHECK_TEXT.COLOR;
    infoMessage.fontSize = startScreenConfig.UI_CONFIG.CHECK_TEXT.FONT_SIZE;
    infoMessage.width = startScreenUIDimensions.ELEMENT_WIDTH;
    infoMessage.height = "80px";
    infoMessage.alpha = startScreenConfig.UI_CONFIG.CHECK_TEXT.ALPHA;
    infoMessage.textWrapping = true;
    infoMessage.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    return infoMessage;
};